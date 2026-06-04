import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(req: NextRequest) {
  const token = req.cookies.get('nexus_session')?.value;
  if (!token) return NextResponse.json(null);

  try {
    const session = await prisma.userSession.findUnique({
      where: { token },
      include: { user: { select: { id: true, prenom: true, nom: true, email: true, isJury: true } } },
    });

    if (!session || session.expiresAt < new Date()) {
      const res = NextResponse.json(null);
      res.cookies.delete('nexus_session');
      return res;
    }

    return NextResponse.json(session.user);
  } catch {
    return NextResponse.json(null);
  }
}
