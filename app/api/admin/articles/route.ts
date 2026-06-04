import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

function requireAdmin(req: NextRequest) {
  const pw = req.headers.get('x-admin-password');
  return pw === process.env.NEXT_PUBLIC_ADMIN_DEMO || pw === process.env.ADMIN_API_KEY;
}

function slugify(str: string) {
  return str
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80);
}

export async function GET(req: NextRequest) {
  if (!requireAdmin(req)) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  const articles = await prisma.article.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(articles);
}

export async function POST(req: NextRequest) {
  if (!requireAdmin(req)) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  try {
    const body = await req.json();
    const { titre, categorie, contenu, auteur, imageUrl, publie } = body;
    if (!titre || !categorie || !contenu || !auteur) {
      return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 });
    }
    const baseSlug = slugify(titre);
    const existing = await prisma.article.findUnique({ where: { slug: baseSlug } });
    const slug = existing ? `${baseSlug}-${Date.now()}` : baseSlug;

    const article = await prisma.article.create({
      data: {
        titre,
        slug,
        categorie,
        contenu,
        auteur,
        imageUrl: imageUrl || null,
        publie: publie ?? false,
        publishedAt: publie ? new Date() : null,
      },
    });
    return NextResponse.json(article, { status: 201 });
  } catch (err) {
    console.error('[admin/articles POST]', err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
