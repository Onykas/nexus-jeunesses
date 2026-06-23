import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { sendBulkEmail } from '@/lib/email';

function requireAdmin(req: NextRequest) {
  const pw = req.headers.get('x-admin-password');
  return pw === process.env.NEXT_PUBLIC_ADMIN_DEMO || pw === process.env.ADMIN_API_KEY;
}

function buildHtml(sujet: string, contenu: string) {
  const paragraphs = contenu
    .split('\n')
    .filter(Boolean)
    .map((p) => `<p style="font-size:15px;color:#444;line-height:1.7;margin:0 0 14px;">${p}</p>`)
    .join('');
  return `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:Arial,sans-serif;">
<div style="max-width:600px;margin:0 auto;padding:32px 16px;">
  <div style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(10,30,60,.08);">
    <div style="background:#0A1E3C;padding:32px;text-align:center;">
      <div style="font-family:Georgia,serif;font-weight:900;font-size:28px;color:#fff;letter-spacing:2px;">NEXUS</div>
      <div style="color:rgba(255,255,255,.6);font-size:12px;letter-spacing:4px;text-transform:uppercase;margin-top:4px;">JEUNESSES</div>
    </div>
    <div style="padding:32px;">
      <p style="font-size:22px;font-weight:700;color:#0A1E3C;margin:0 0 16px;">${sujet}</p>
      ${paragraphs}
    </div>
    <div style="padding:20px 32px;text-align:center;font-size:12px;color:#999;border-top:1px solid #f0f0f0;">
      <p>NEXUS JEUNESSES — Théâtre INSMAC, Rabat, Maroc</p>
      <p>+212 7 15 79 59 62</p>
    </div>
  </div>
</div>
</body></html>`;
}

export async function POST(req: NextRequest) {
  if (!requireAdmin(req)) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  try {
    const { destinataires, sujet, contenu } = await req.json();

    if (!sujet || !contenu) {
      return NextResponse.json({ error: 'Sujet et contenu requis' }, { status: 400 });
    }

    let emails: string[] = [];

    if (destinataires === 'newsletter') {
      const subs = await prisma.newsletter.findMany({ where: { active: true }, select: { email: true } });
      emails = subs.map((s) => s.email);
    } else {
      const where = destinataires === 'tous'
        ? {}
        : { role: destinataires as 'spectateur' | 'volontaire' | 'partenaire' | 'media' };
      const inscriptions = await prisma.inscription.findMany({
        where: { ...where, status: 'confirmed' },
        select: { email: true },
      });
      emails = inscriptions.map((i) => i.email);
    }

    if (emails.length === 0) {
      return NextResponse.json({ error: 'Aucun destinataire trouvé', sent: 0 }, { status: 400 });
    }

    const html = buildHtml(sujet, contenu);
    const { sent, failed } = await sendBulkEmail(emails, sujet, html);

    await prisma.emailLog.create({
      data: {
        to: `${destinataires} (${sent}/${emails.length} destinataires)`,
        subject: sujet,
        type: 'bulk',
        status: sent > 0 ? 'sent' : 'failed',
        messageId: `bulk-${Date.now()}`,
      },
    });

    return NextResponse.json({ ok: true, sent, failed });
  } catch (err) {
    console.error('[admin/send-email]', err);
    return NextResponse.json({ error: 'Erreur lors de l\'envoi' }, { status: 500 });
  }
}
