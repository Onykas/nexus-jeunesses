import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { sendConfirmationEmail } from '@/lib/email';
import { generateICalendar, sanitizeInput, rateLimit } from '@/lib/utils';

const rateLimitMap = new Map<string, { count: number; ts: number }>();

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown';

  if (!rateLimit(rateLimitMap, ip, 5)) {
    return NextResponse.json({ error: 'Trop de tentatives. Réessayez demain.' }, { status: 429 });
  }

  let fields: Record<string, string> = {};
  let cvFileName: string | null = null;

  const contentType = req.headers.get('content-type') || '';

  if (contentType.includes('multipart/form-data')) {
    try {
      const formData = await req.formData();
      formData.forEach((value, key) => {
        if (typeof value === 'string') fields[key] = value;
        else if (value instanceof File && key === 'cv') cvFileName = value.name;
      });
    } catch {
      return NextResponse.json({ error: 'Requête invalide.' }, { status: 400 });
    }
  } else {
    try {
      fields = await req.json();
    } catch {
      return NextResponse.json({ error: 'Requête invalide.' }, { status: 400 });
    }
  }

  const { role, prenom, nom, email, telephone, nationalite, dateNaissance,
          motivation, organisation, secteur, nomMedia, typeMedia, lienPublication,
          consentEmail, consentSMS, consentWhatsapp, rgpd } = fields;

  if (!role || !prenom || !nom || !email || !telephone || !nationalite || !dateNaissance) {
    return NextResponse.json({ error: 'Champs requis manquants.' }, { status: 422 });
  }
  if (!['spectateur', 'volontaire', 'partenaire', 'media'].includes(role)) {
    return NextResponse.json({ error: 'Rôle invalide.' }, { status: 422 });
  }
  if (rgpd !== 'true' && rgpd !== true as unknown as string) {
    return NextResponse.json({ error: 'Consentement RGPD requis.' }, { status: 422 });
  }

  try {
    const existing = await prisma.inscription.findFirst({
      where: { email: email.toLowerCase() },
    });
    if (existing) {
      return NextResponse.json({ error: 'Un compte avec cet email existe déjà.' }, { status: 409 });
    }

    const inscription = await prisma.inscription.create({
      data: {
        role: role as any,
        prenom: sanitizeInput(prenom),
        nom: sanitizeInput(nom),
        email: email.toLowerCase(),
        telephone,
        nationalite,
        dateNaissance: new Date(dateNaissance),
        motivation: motivation ? sanitizeInput(motivation) : null,
        cvUrl: cvFileName || null,
        organisation: organisation ? sanitizeInput(organisation) : null,
        secteur: secteur || null,
        nomMedia: nomMedia ? sanitizeInput(nomMedia) : null,
        typeMedia: typeMedia || null,
        lienPublication: lienPublication || null,
        consentEmail: consentEmail === 'true' || consentEmail === true as unknown as string,
        consentSMS: consentSMS === 'true' || consentSMS === true as unknown as string,
        consentWhatsapp: consentWhatsapp === 'true' || consentWhatsapp === true as unknown as string,
        status: 'confirmed',
        ipAddress: ip,
      },
    });

    if (consentEmail !== 'false') {
      try {
        const emailResult = await sendConfirmationEmail({ prenom, nom, email, telephone, nationalite, role });
        console.log('[inscription] email envoyé:', emailResult);
      } catch (emailErr) {
        const msg = emailErr instanceof Error ? emailErr.message : String(emailErr);
        console.error('[inscription] ÉCHEC email:', msg);
        console.error('[inscription] GMAIL_USER défini:', !!process.env.GMAIL_USER);
      }
    }

    const ics = generateICalendar({
      title: 'NEXUS SPECTACLE 2026',
      description: `Votre inscription est confirmée. Rôle: ${role}.`,
      location: 'Théâtre INSMAC, Rabat, Maroc',
      startDate: new Date('2026-07-11T13:00:00Z'),
      endDate: new Date('2026-07-11T16:00:00Z'),
    });

    return NextResponse.json({
      success: true,
      id: inscription.id,
      message: 'Inscription confirmée. Email de confirmation envoyé.',
      ics,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[inscription] erreur:', message);

    if (message.includes('connect') || message.includes('ECONNREFUSED') || message.includes('DATABASE_URL')) {
      console.error('[inscription] DATABASE_URL:', process.env.DATABASE_URL ? 'définie' : 'MANQUANTE');
      return NextResponse.json({ error: 'Base de données inaccessible. Contactez l\'administrateur.' }, { status: 503 });
    }
    if (message.includes('Unique constraint') || message.includes('unique')) {
      return NextResponse.json({ error: 'Un compte avec cet email existe déjà.' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Erreur serveur. Veuillez réessayer.', detail: process.env.NODE_ENV !== 'production' ? message : undefined }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const key = req.headers.get('x-admin-key');
  if (key !== process.env.ADMIN_API_KEY) {
    return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 });
  }
  const inscriptions = await prisma.inscription.findMany({
    orderBy: { createdAt: 'desc' },
    take: 200,
    select: {
      id: true, prenom: true, nom: true, email: true, role: true,
      nationalite: true, status: true, createdAt: true,
    },
  });
  return NextResponse.json({ inscriptions });
}
