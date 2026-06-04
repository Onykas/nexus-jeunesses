import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { nomComplet, organisation, email, message } = body;

    if (!nomComplet || !organisation || !email || !message) {
      return NextResponse.json({ error: 'Tous les champs sont requis' }, { status: 400 });
    }

    await prisma.partnerRequest.create({
      data: { nomComplet, organisation, email, message },
    });

    if (process.env.RESEND_API_KEY) {
      await resend.emails.send({
        from: process.env.FROM_EMAIL || 'noreply@nexusjeunesses.org',
        to: 'olgasangupambanika@gmail.com',
        subject: `[NEXUS] Nouvelle demande de partenariat — ${organisation}`,
        html: `
          <h2>Nouvelle demande de partenariat</h2>
          <p><strong>Nom :</strong> ${nomComplet}</p>
          <p><strong>Organisation :</strong> ${organisation}</p>
          <p><strong>Email :</strong> ${email}</p>
          <p><strong>Message :</strong></p>
          <blockquote>${message.replace(/\n/g, '<br>')}</blockquote>
        `,
      }).catch((e) => console.error('Email send failed:', e));
    }

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    console.error('Partenariat error:', err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const requests = await prisma.partnerRequest.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(requests);
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
