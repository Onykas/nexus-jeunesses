import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { uploadVideo } from '@/lib/supabase';
import { sendCandidatureConfirmation, sendCandidatureNotifAdmin } from '@/lib/email';

export const maxDuration = 60;
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const prenom      = formData.get('prenom') as string;
    const nom         = formData.get('nom') as string;
    const email       = formData.get('email') as string;
    const telephone   = formData.get('telephone') as string;
    const nationalite = formData.get('nationalite') as string;
    const dateNaissanceStr = formData.get('dateNaissance') as string | null;
    const motivation  = (formData.get('motivation') as string | null) ?? '';
    const ville       = (formData.get('ville') as string | null) ?? '';
    const profession  = (formData.get('profession') as string | null) ?? '';
    const sujet       = (formData.get('sujet') as string | null) ?? '';
    const preUploadedUrl = formData.get('videoUrl') as string | null;
    const videoFile = (!preUploadedUrl
      ? (formData.get('video') ?? formData.get('cv'))
      : null) as File | null;

    if (!prenom || !nom || !email || !telephone || !nationalite) {
      return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 });
    }

    const existing = await prisma.eloquenceCandidate.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: 'Une candidature existe déjà avec cet email' }, { status: 409 });
    }

    let videoUrl: string | null = preUploadedUrl;
    if (!videoUrl && videoFile && videoFile.size > 0) {
      try {
        videoUrl = await uploadVideo(videoFile);
      } catch (uploadErr) {
        const msg = uploadErr instanceof Error ? uploadErr.message : String(uploadErr);
        console.error('[candidature] upload vidéo échoué:', msg);
      }
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
        ville: ville || null,
        profession: profession || null,
        sujet: sujet || null,
        cvUrl: videoUrl ?? undefined,
      },
    });

    sendCandidatureConfirmation({
      prenom, nom, email, telephone, nationalite,
      motivation: motivation || undefined,
      videoUrl: videoUrl ?? undefined,
    }).catch((e) => console.error('[candidature] email candidat échoué:', e));

    sendCandidatureNotifAdmin({
      prenom, nom, email, telephone, nationalite,
      motivation: motivation || undefined,
      videoUrl: videoUrl ?? undefined,
    }).catch((e) => console.error('[candidature] email admin échoué:', e));

    return NextResponse.json({ id: candidate.id, videoUrl }, { status: 201 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[candidature] erreur:', msg);
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
