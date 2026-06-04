import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const prenom = formData.get('prenom') as string;
    const nom = formData.get('nom') as string;
    const email = formData.get('email') as string;
    const telephone = formData.get('telephone') as string;
    const nationalite = formData.get('nationalite') as string;
    const dateNaissanceStr = formData.get('dateNaissance') as string;
    const motivation = formData.get('motivation') as string;
    const cvFile = formData.get('cv') as File | null;

    if (!prenom || !nom || !email || !telephone || !nationalite || !motivation) {
      return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 });
    }

    const existing = await prisma.eloquenceCandidate.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: 'Une candidature existe déjà avec cet email' }, { status: 409 });
    }

    const candidate = await prisma.eloquenceCandidate.create({
      data: {
        prenom,
        nom,
        email,
        telephone,
        nationalite,
        dateNaissance: dateNaissanceStr ? new Date(dateNaissanceStr) : null,
        motivation,
        cvUrl: cvFile ? cvFile.name : null,
      },
    });

    return NextResponse.json({ id: candidate.id }, { status: 201 });
  } catch (err) {
    console.error('Candidature error:', err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    const candidates = await prisma.eloquenceCandidate.findMany({
      where: status ? { status: status as any } : undefined,
      include: { _count: { select: { votes: true } } },
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json(candidates);
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
