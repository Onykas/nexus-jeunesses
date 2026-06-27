import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const candidates = await prisma.eloquenceCandidate.findMany({
      where: { status: 'validated' },
      select: {
        id: true,
        prenom: true,
        nom: true,
        nationalite: true,
        sujet: true,
        ville: true,
        cvUrl: true,
        videoPublique: true,
        _count: { select: { votes: true } },
      },
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json(
      candidates.map((c) => ({
        ...c,
        cvUrl: c.videoPublique ? c.cvUrl : null,
      }))
    );
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
