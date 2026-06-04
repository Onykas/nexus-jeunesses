import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

async function getUserFromSession(req: NextRequest) {
  const token = req.cookies.get('nexus_session')?.value;
  if (!token) return null;
  const session = await prisma.userSession.findUnique({
    where: { token },
    include: { user: true },
  });
  if (!session || session.expiresAt < new Date()) return null;
  return session.user;
}

export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromSession(req);
    if (!user) {
      return NextResponse.json({ error: 'Connexion requise pour voter' }, { status: 401 });
    }

    const { candidateId, phase, score } = await req.json();

    if (!candidateId || !phase) {
      return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 });
    }

    if (phase === 'jury' && !user.isJury) {
      return NextResponse.json({ error: 'Accès jury requis' }, { status: 403 });
    }

    if (phase === 'public') {
      const settings = await prisma.siteSettings.findUnique({ where: { key: 'votePublicActive' } });
      if (settings?.value !== 'true') {
        return NextResponse.json({ error: 'Le vote public n\'est pas encore ouvert' }, { status: 403 });
      }
    }

    if (phase === 'jury') {
      const settings = await prisma.siteSettings.findUnique({ where: { key: 'voteFinalActive' } });
      if (settings?.value !== 'true') {
        return NextResponse.json({ error: 'Le vote final n\'est pas ouvert' }, { status: 403 });
      }
      if (!user.isPresent) {
        return NextResponse.json({ error: 'Vous devez être marqué présent pour voter' }, { status: 403 });
      }
    }

    const candidate = await prisma.eloquenceCandidate.findUnique({ where: { id: candidateId } });
    if (!candidate || candidate.status !== 'validated') {
      return NextResponse.json({ error: 'Candidat non trouvé ou non validé' }, { status: 404 });
    }

    const existing = await prisma.vote.findUnique({
      where: { userId_candidateId_phase: { userId: user.id, candidateId, phase } },
    });
    if (existing) {
      return NextResponse.json({ error: 'Vous avez déjà voté pour ce candidat' }, { status: 409 });
    }

    const vote = await prisma.vote.create({
      data: {
        userId: user.id,
        candidateId,
        phase,
        score: score || 1,
      },
    });

    return NextResponse.json({ id: vote.id }, { status: 201 });
  } catch (err) {
    console.error('Vote error:', err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const candidateId = searchParams.get('candidateId');

    const votes = await prisma.vote.groupBy({
      by: ['candidateId'],
      where: candidateId ? { candidateId } : undefined,
      _sum: { score: true },
      _count: { id: true },
    });

    return NextResponse.json(votes);
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
