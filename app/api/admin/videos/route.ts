import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

function requireAdmin(req: NextRequest) {
  const pw = req.headers.get('x-admin-password');
  return pw === process.env.NEXT_PUBLIC_ADMIN_DEMO || pw === process.env.ADMIN_API_KEY;
}

export async function GET(req: NextRequest) {
  if (!requireAdmin(req)) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  const videos = await prisma.video.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json(videos);
}

export async function POST(req: NextRequest) {
  if (!requireAdmin(req)) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  try {
    const { titre, url, description, categorie } = await req.json();
    if (!titre || !url) return NextResponse.json({ error: 'Titre et URL requis' }, { status: 400 });
    const video = await prisma.video.create({
      data: { titre, url, description: description || null, categorie: categorie || 'general' },
    });
    return NextResponse.json(video, { status: 201 });
  } catch (err) {
    console.error('[admin/videos POST]', err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
