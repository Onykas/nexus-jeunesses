import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { uploadVideo } from '@/lib/supabase';
import { sendCandidatureConfirmation, sendCandidatureNotifAdmin } from '@/lib/email';

export const maxDuration = 60;
// Permet les vidéos jusqu'à 200MB
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const prenom     = formData.get('prenom') as string;
    const nom        = formData.get('nom') as string;
    const email      = formData.get('email') as string;
    const telephone  = formData.get('telephone') as string;
    const nationalite = formData.get('nationalite') as string;
    const dateNaissanceStr = formData.get('dateNaissance') as string;
    const motivation = (formData.get('motivation') as string | null) ?? '';
    const videoFile  = formData.get('cv') as File | null;

    if (!prenom || !nom || !email || !telephone || !nationalite) {
      return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 });
    }
    if (!videoFile || videoFile.size === 0) {
      return NextResponse.json({ error: 'La vidéo de présentation est requise' }, { status: 400 });
    }

    const existing = await prisma.eloquenceCandidate.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: 'Une candidature existe déjà avec cet email' }, { status: 409 });
    }

    // Upload vidéo vers Supabase Storage
    let videoUrl: string | null = null;
    try {
      videoUrl = await uploadVideo(videoFile);
    } catch (uploadErr) {
      console.error('[candidature] upload vidéo échoué:', uploadErr);
      // On continue sans la vidéo plutôt que de bloquer la candidature
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
        cvUrl: videoUrl ?? undefined,
      },
    });

    // Email de confirmation au candidat
    sendCandidatureConfirmation({ prenom, nom, email, telephone, nationalite, motivation: motivation ?? undefined, videoUrl: videoUrl ?? undefined })
      .catch((e) => console.error('[candidature] email candidat échoué:', e));

    // Email de notification à l'admin
    sendCandidatureNotifAdmin({ prenom, nom, email, telephone, nationalite, motivation: motivation ?? undefined, videoUrl: videoUrl ?? undefined })
      .catch((e) => console.error('[candidature] email admin échoué:', e));

    return NextResponse.json({ id: candidate.id, videoUrl }, { status: 201 });
  } catch (err) {
    console.error('[candidature] erreur:', err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    const candidates = await prisma.eloquenceCandidate.findMany({
      where: status ? { status: status as 'pending' | 'validated' | 'rejected' } : undefined,
      include: { _count: { select: { votes: true } } },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(candidates);
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
