import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prenom, nom, email, password, nationalite, dateNaissance } = body;

    if (!prenom || !nom || !email || !password || !nationalite) {
      return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: 'Mot de passe trop court (min. 8 caractères)' }, { status: 400 });
    }

    const existing = await prisma.userAccount.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: 'Un compte existe déjà avec cet email' }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.userAccount.create({
      data: {
        email,
        passwordHash,
        prenom,
        nom,
        nationalite,
        dateNaissance: dateNaissance ? new Date(dateNaissance) : null,
      },
    });

    return NextResponse.json({ id: user.id, email: user.email, prenom: user.prenom }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[register] Erreur:', message);
    console.error('[register] Stack:', err instanceof Error ? err.stack : '—');
    return NextResponse.json(
      {
        error: 'Erreur serveur',
        ...(process.env.NODE_ENV !== 'production' && { detail: message }),
      },
      { status: 500 },
    );
  }
}
