import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { rateLimit } from '@/lib/utils';

const schema = z.object({
  email: z.string().email(),
  source: z.string().optional(),
});

const rateLimitMap = new Map<string, { count: number; ts: number }>();

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown';
  if (!rateLimit(rateLimitMap, ip, 10)) {
    return NextResponse.json({ error: 'Trop de tentatives.' }, { status: 429 });
  }

  let body: unknown;
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: 'Requête invalide.' }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Email invalide.' }, { status: 422 });

  try {
    await prisma.newsletter.upsert({
      where: { email: parsed.data.email.toLowerCase() },
      update: { source: parsed.data.source ?? 'site', active: true },
      create: { email: parsed.data.email.toLowerCase(), source: parsed.data.source ?? 'site' },
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[newsletter]', err);
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 });
  }
}
