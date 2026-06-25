import nodemailer from 'nodemailer';

function getTransporter() {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_PASS;
  if (!user || !pass) throw new Error('GMAIL_USER ou GMAIL_PASS manquant');
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: { user, pass },
  });
}

const FROM_NAME = 'NEXUS JEUNESSES';

export interface InscriptionData {
  prenom: string;
  nom: string;
  email: string;
  telephone: string;
  nationalite: string;
  role: string;
  motivation?: string;
  consentEmail?: boolean;
}

function baseTemplate(content: string, preheader = '') {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>NEXUS JEUNESSES</title>
<style>
  body{margin:0;padding:0;background:#f4f4f5;font-family:'Inter',Arial,sans-serif;}
  .wrapper{max-width:600px;margin:0 auto;padding:32px 16px;}
  .card{background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(10,30,60,.08);}
  .header{background:#0A1E3C;padding:32px;text-align:center;}
  .logo{font-family:Georgia,serif;font-weight:900;font-size:28px;color:#fff;letter-spacing:2px;}
  .tagline{color:rgba(255,255,255,.6);font-size:12px;letter-spacing:4px;text-transform:uppercase;margin-top:4px;}
  .body{padding:32px;}
  .title{font-size:24px;font-weight:700;color:#0A1E3C;margin:0 0 12px;}
  .text{font-size:15px;color:#444;line-height:1.7;margin:0 0 16px;}
  .btn{display:inline-block;background:#D32F2F;color:#fff !important;text-decoration:none;padding:14px 32px;border-radius:8px;font-weight:700;font-size:15px;margin:16px 0;}
  .info-box{background:#f8f9fa;border-radius:10px;padding:16px;margin:16px 0;font-size:14px;color:#555;}
  .info-row{display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #eee;}
  .footer{padding:20px 32px;text-align:center;font-size:12px;color:#999;}
  .accent{color:#D32F2F;font-weight:700;}
</style>
</head>
<body>
${preheader ? `<div style="display:none;max-height:0;overflow:hidden;">${preheader}</div>` : ''}
<div class="wrapper">
  <div class="card">
    <div class="header">
      <div class="logo">NEXUS</div>
      <div class="tagline">JEUNESSES</div>
    </div>
    <div class="body">${content}</div>
    <div class="footer">
      <p>NEXUS JEUNESSES — UESCOM · Speak To Lead · CESAM</p>
      <p>Théâtre INSMAC, Rabat, Maroc</p>
      <p>+212 7 15 79 59 62</p>
      <p style="margin-top:12px;font-size:11px;">Vous recevez cet email car vous vous êtes inscrit(e) à NEXUS SPECTACLE.</p>
    </div>
  </div>
</div>
</body>
</html>`;
}

async function sendMail(to: string, subject: string, html: string) {
  const transporter = getTransporter();
  const from = `${FROM_NAME} <${process.env.GMAIL_USER}>`;
  return transporter.sendMail({ from, to, subject, html });
}

export async function sendConfirmationEmail(data: InscriptionData) {
  const content = `
    <p class="title">Votre inscription est confirmée ! 🎉</p>
    <p class="text">Bonjour <strong>${data.prenom}</strong>,</p>
    <p class="text">
      Bienvenue dans la famille <span class="accent">NEXUS JEUNESSES</span>.
      Votre place au <strong>NEXUS SPECTACLE</strong> est réservée.
    </p>
    <div class="info-box">
      <div class="info-row"><span>Événement</span><strong>NEXUS SPECTACLE</strong></div>
      <div class="info-row"><span>Date</span><strong>11 juillet 2026 — 18h00</strong></div>
      <div class="info-row"><span>Lieu</span><strong>Théâtre Mohamed Bahnini, Rabat</strong></div>
      <div class="info-row"><span>Rôle</span><strong>${data.role}</strong></div>
      <div class="info-row" style="border:none"><span>Statut</span><strong style="color:#4CAF50">✓ Confirmé</strong></div>
    </div>
    <p class="text">Ajoutez l'événement à votre calendrier :</p>
    <a href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=NEXUS+SPECTACLE&dates=20260711T160000Z/20260711T200000Z&details=Inscription+confirm%C3%A9e&location=Th%C3%A9%C3%A2tre+Mohamed+Bahnini+Rabat" class="btn">📅 Google Calendar</a>
    <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:20px;margin:24px 0;text-align:center;">
      <p style="font-size:15px;font-weight:700;color:#15803d;margin:0 0 8px;">💬 Rejoignez notre groupe WhatsApp NEXUS</p>
      <p style="font-size:14px;color:#444;margin:0 0 16px;">Restez informé(e) de toutes les actualités et préparez-vous avec la communauté :</p>
      <a href="https://chat.whatsapp.com/FvbLrzGwxDS9ThyoApsz6M?mode=gi_t"
         style="display:inline-block;background:#25D366;color:#fff;text-decoration:none;padding:12px 28px;border-radius:8px;font-weight:700;font-size:14px;">
        📱 Rejoindre le groupe WhatsApp
      </a>
    </div>
    <p class="text" style="margin-top:24px;">
      La jeunesse ne subit plus. Elle éclaire.<br/>
      <span class="accent">À très bientôt à Rabat.</span>
    </p>
    <p class="text" style="color:#999;font-size:13px;">L'équipe NEXUS JEUNESSES</p>
  `;
  return sendMail(
    data.email,
    `✅ Inscription confirmée — NEXUS SPECTACLE 11 Juillet 2026`,
    baseTemplate(content, `Votre place au NEXUS SPECTACLE est confirmée, ${data.prenom} !`)
  );
}

export async function sendReminderEmail(
  data: Pick<InscriptionData, 'prenom' | 'email'>,
  daysUntil: number
) {
  const copies: Record<number, { subject: string; headline: string; body: string }> = {
    30: {
      subject: `NEXUS SPECTACLE dans 30 jours — Confirmez votre présence`,
      headline: `Plus que 30 jours 🗓️`,
      body: `L'événement approche. Votre place est réservée — pensez à confirmer votre présence et à partager l'événement autour de vous.`,
    },
    14: {
      subject: `NEXUS SPECTACLE dans 2 semaines — Voici le programme`,
      headline: `Le programme complet est là ⚡`,
      body: `Eloquentia 2.0, 3 interventions NEXUS TALK, performance de danse culturelle. Dans 14 jours, vous serez au cœur de l'action.`,
    },
    7: {
      subject: `Une semaine. Préparez-vous à être illuminé(e)s.`,
      headline: `J-7 🔥`,
      body: `Dans 7 jours, NEXUS SPECTACLE illumine le Théâtre Mohamed Bahnini. 12 voix, 12 nationalités, une seule scène.`,
    },
    3: {
      subject: `NEXUS SPECTACLE dans 3 jours — Infos pratiques`,
      headline: `Détails pratiques — J-3 📍`,
      body: `Retrouvez toutes les informations logistiques : accès, parking, horaires, dresscode. Soyez prêt(e)s.`,
    },
    1: {
      subject: `Demain, la jeunesse brille. Soyez au rendez-vous.`,
      headline: `Demain soir ✨`,
      body: `C'est demain ! Les portes ouvrent à 17h45. Tenue élégante recommandée. Nous vous attendons.`,
    },
  };

  const copy = copies[daysUntil];
  if (!copy) return;

  const content = `
    <p class="title">${copy.headline}</p>
    <p class="text">Bonjour <strong>${data.prenom}</strong>,</p>
    <p class="text">${copy.body}</p>
    <div class="info-box">
      <div class="info-row"><span>Date</span><strong>11 juillet 2026 — 18h00</strong></div>
      <div class="info-row" style="border:none"><span>Lieu</span><strong>Théâtre Mohamed Bahnini, Rabat</strong></div>
    </div>
    <a href="${process.env.NEXT_PUBLIC_APP_URL}/spectacle" class="btn">Voir le programme →</a>
  `;
  return sendMail(data.email, copy.subject, baseTemplate(content));
}

export async function sendAdminNotification(subject: string, body: string) {
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) return;
  return sendMail(
    adminEmail,
    `[NEXUS Admin] ${subject}`,
    baseTemplate(`<p class="title">${subject}</p><p class="text">${body}</p>`)
  );
}

export interface CandidatureData {
  prenom: string;
  nom: string;
  email: string;
  telephone: string;
  nationalite: string;
  motivation?: string;
  videoUrl?: string;
}

export async function sendCandidatureConfirmation(data: CandidatureData) {
  const content = `
    <p class="title">Candidature reçue avec succès ! 🎉</p>
    <p class="text">Bonjour <strong>${data.prenom}</strong>,</p>
    <p class="text">
      Votre candidature au <span class="accent">Concours d'Éloquence NEXUS SPECTACLE</span> a bien été reçue.
      L'équipe NEXUS examinera votre dossier et vous contactera prochainement.
    </p>
    <div class="info-box">
      <div class="info-row"><span>Nom</span><strong>${data.prenom} ${data.nom}</strong></div>
      <div class="info-row"><span>Email</span><strong>${data.email}</strong></div>
      <div class="info-row"><span>Téléphone</span><strong>${data.telephone}</strong></div>
      <div class="info-row" style="border:none"><span>Nationalité</span><strong>${data.nationalite}</strong></div>
    </div>
    <p class="text">
      La jeunesse ne subit plus. Elle éclaire.<br/>
      <span class="accent">Bonne chance !</span>
    </p>
    <p class="text" style="color:#999;font-size:13px;">L'équipe NEXUS JEUNESSES</p>
  `;
  return sendMail(
    data.email,
    `✅ Candidature reçue — Concours d'Éloquence NEXUS SPECTACLE`,
    baseTemplate(content, `Votre candidature au concours d'éloquence NEXUS a été reçue, ${data.prenom} !`)
  );
}

export async function sendCandidatureNotifAdmin(data: CandidatureData) {
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) return;

  const videoSection = data.videoUrl
    ? `<div class="info-row"><span>Vidéo</span><a href="${data.videoUrl}" style="color:#D32F2F;font-weight:700;">▶ Voir la vidéo</a></div>`
    : `<div class="info-row"><span>Vidéo</span><strong style="color:#999;">Non disponible</strong></div>`;

  const content = `
    <p class="title">Nouvelle candidature éloquence</p>
    <p class="text">Une nouvelle candidature vient d'être soumise :</p>
    <div class="info-box">
      <div class="info-row"><span>Nom</span><strong>${data.prenom} ${data.nom}</strong></div>
      <div class="info-row"><span>Email</span><a href="mailto:${data.email}" style="color:#D32F2F;font-weight:700;">${data.email}</a></div>
      <div class="info-row"><span>Téléphone</span><strong>${data.telephone}</strong></div>
      <div class="info-row"><span>Nationalité</span><strong>${data.nationalite}</strong></div>
      ${data.motivation ? `<div class="info-row"><span>Motivation</span><strong>${data.motivation}</strong></div>` : ''}
      ${videoSection}
    </div>
    <a href="${process.env.NEXT_PUBLIC_APP_URL ?? 'https://nexusjeunesses.org'}/admin" class="btn">Voir dans l'admin →</a>
  `;
  return sendMail(
    adminEmail,
    `[NEXUS] Nouvelle candidature — ${data.prenom} ${data.nom}`,
    baseTemplate(content)
  );
}

export async function sendBulkEmail(emails: string[], subject: string, html: string) {
  const results = await Promise.allSettled(
    emails.map((to) => sendMail(to, subject, html))
  );
  const sent = results.filter((r) => r.status === 'fulfilled').length;
  const failed = results.length - sent;
  return { sent, failed };
}
