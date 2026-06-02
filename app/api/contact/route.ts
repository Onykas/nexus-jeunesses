import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { sendAdminNotification } from '@/lib/email';
import { sanitizeInput, rateLimit } from '@/lib/utils';

const schema = z.object({
  type: z.enum(['diner', 'question', 'newsletter']),
  nom: z.string().min(2).max(100),
  titre: z.string().max(100).optional(),
  secteur: z.string().max(100).optional(),
  organisation: z.string().max(100).optional(),
  email: z.string().email(),
  telephone: z.string().max(20).optional(),
  motivation: z.string().max(500).optional(),
  message: z.string().max(1000).optional(),
  rgpd: z.literal(true),
});

const rateLimitMap = new Map<string, { count: number; ts: number }>();

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown';
  if (!rateLimit(rateLimitMap, ip, 5)) {
    return NextResponse.json({ error: 'Trop de tentatives.' }, { status: 429 });
  }

  let body: unknown;
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: 'Requête invalide.' }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Données invalides.' }, { status: 422 });
  }

  const data = parsed.data;

  try {
    await prisma.contactRequest.create({
      data: {
        type: data.type,
        nom: sanitizeInput(data.nom),
        titre: data.titre ? sanitizeInput(data.titre) : null,
        secteur: data.secteur ?? null,
        organisation: data.organisation ? sanitizeInput(data.organisation) : null,
        email: data.email.toLowerCase(),
        telephone: data.telephone ?? null,
        motivation: data.motivation ? sanitizeInput(data.motivation) : null,
        message: data.message ? sanitizeInput(data.message) : null,
      },
    });

    await sendAdminNotification(
      `Nouvelle candidature ${data.type.toUpperCase()}`,
      `De : ${data.nom} (${data.email})<br/>Titre : ${data.titre || 'N/A'}<br/>Secteur : ${data.secteur || 'N/A'}<br/>Motivation : ${data.motivation || 'N/A'}`
    );

    return NextResponse.json({ success: true, message: 'Candidature reçue. Réponse sous 48h.' });
  } catch (err) {
    console.error('[contact]', err);
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 });
  }
}
