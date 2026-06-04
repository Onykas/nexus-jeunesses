import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

function requireAdmin(req: NextRequest) {
  const pw = req.headers.get('x-admin-password');
  return pw === process.env.NEXT_PUBLIC_ADMIN_DEMO || pw === process.env.ADMIN_API_KEY;
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!requireAdmin(req)) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  const { id } = await params;
  try {
    const body = await req.json();
    const { titre, categorie, contenu, auteur, imageUrl, publie } = body;
    const current = await prisma.article.findUnique({ where: { id } });
    if (!current) return NextResponse.json({ error: 'Article introuvable' }, { status: 404 });

    const article = await prisma.article.update({
      where: { id },
      data: {
        titre: titre ?? current.titre,
        categorie: categorie ?? current.categorie,
        contenu: contenu ?? current.contenu,
        auteur: auteur ?? current.auteur,
        imageUrl: imageUrl !== undefined ? imageUrl : current.imageUrl,
        publie: publie ?? current.publie,
        publishedAt: publie && !current.publishedAt ? new Date() : current.publishedAt,
      },
    });
    return NextResponse.json(article);
  } catch (err) {
    console.error('[admin/articles PUT]', err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!requireAdmin(req)) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  const { id } = await params;
  try {
    await prisma.article.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Article introuvable' }, { status: 404 });
  }
}
