import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(req: NextRequest) {
  const token = req.cookies.get('nexus_session')?.value;
  if (token) {
    await prisma.userSession.deleteMany({ where: { token } }).catch(() => {});
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.delete('nexus_session');
  return res;
}
