import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const articles = await prisma.article.findMany({
      where: { publie: true },
      orderBy: { publishedAt: 'desc' },
    });
    return NextResponse.json(articles);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}
