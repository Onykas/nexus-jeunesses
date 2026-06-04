import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email et mot de passe requis' }, { status: 400 });
    }

    const user = await prisma.userAccount.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return NextResponse.json({ error: 'Email ou mot de passe incorrect' }, { status: 401 });
    }

    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await prisma.userSession.create({
      data: { userId: user.id, token, expiresAt },
    });

    const res = NextResponse.json({
      id: user.id,
      email: user.email,
      prenom: user.prenom,
      nom: user.nom,
      isJury: user.isJury,
    });

    res.cookies.set('nexus_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: expiresAt,
      path: '/',
    });

    return res;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[login] Erreur:', message);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
