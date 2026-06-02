import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { sendConfirmationEmail } from '@/lib/email';
import { generateICalendar, sanitizeInput, rateLimit } from '@/lib/utils';

const schema = z.object({
  role: z.enum(['spectateur', 'participant', 'volontaire', 'partenaire', 'media']),
  prenom: z.string().min(2).max(50),
  nom: z.string().min(2).max(50),
  email: z.string().email().max(254),
  telephone: z.string().min(8).max(20),
  nationalite: z.string().min(2).max(50),
  dateNaissance: z.string().optional(),
  motivation: z.string().max(200).optional(),
  besoinsSpeciaux: z.array(z.string()).optional(),
  consentEmail: z.boolean().optional(),
  consentSMS: z.boolean().optional(),
  consentWhatsapp: z.boolean().optional(),
  rgpd: z.literal(true),
});

const rateLimitMap = new Map<string, { count: number; ts: number }>();

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown';

  if (!rateLimit(rateLimitMap, ip, 5)) {
    return NextResponse.json({ error: 'Trop de tentatives. Réessayez demain.' }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Requête invalide.' }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Données invalides.', details: parsed.error.flatten() }, { status: 422 });
  }

  const data = parsed.data;

  try {
    // Check for duplicate
    const existing = await prisma.inscription.findFirst({
      where: { OR: [{ email: data.email }, { telephone: data.telephone }] },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Un compte avec cet email ou ce téléphone existe déjà.' },
        { status: 409 }
      );
    }

    // Save to DB
    const inscription = await prisma.inscription.create({
      data: {
        role: data.role,
        prenom: sanitizeInput(data.prenom),
        nom: sanitizeInput(data.nom),
        email: data.email.toLowerCase(),
        telephone: data.telephone,
        nationalite: data.nationalite,
        dateNaissance: data.dateNaissance ? new Date(data.dateNaissance) : null,
        motivation: data.motivation ? sanitizeInput(data.motivation) : null,
        besoinsSpeciaux: data.besoinsSpeciaux ?? [],
        consentEmail: data.consentEmail ?? false,
        consentSMS: data.consentSMS ?? false,
        consentWhatsapp: data.consentWhatsapp ?? false,
        status: 'confirmed',
      },
    });

    // Send confirmation email
    if (data.consentEmail !== false) {
      await sendConfirmationEmail({
        prenom: data.prenom,
        nom: data.nom,
        email: data.email,
        telephone: data.telephone,
        nationalite: data.nationalite,
        role: data.role,
      });
    }

    // Generate iCalendar
    const ics = generateICalendar({
      title: 'NEXUS SPECTACLE 2026',
      description: `Votre inscription est confirmée. Rôle: ${data.role}. Organisé par UESCOM.`,
      location: 'Théâtre Mohamed Bahnini, Rabat, Maroc',
      startDate: new Date('2026-07-11T17:00:00Z'),
      endDate: new Date('2026-07-11T21:00:00Z'),
    });

    return NextResponse.json({
      success: true,
      id: inscription.id,
      message: 'Inscription confirmée. Email de confirmation envoyé.',
      ics,
    });
  } catch (err) {
    console.error('[inscription]', err);
    return NextResponse.json({ error: 'Erreur serveur. Veuillez réessayer.' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const key = req.headers.get('x-admin-key');
  if (key !== process.env.ADMIN_API_KEY) {
    return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 });
  }
  const inscriptions = await prisma.inscription.findMany({
    orderBy: { createdAt: 'desc' },
    take: 100,
    select: { id: true, prenom: true, nom: true, email: true, role: true, nationalite: true, status: true, createdAt: true },
  });
  return NextResponse.json({ inscriptions });
}
