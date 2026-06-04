import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

function requireAdmin(req: NextRequest) {
  const pw = req.headers.get('x-admin-password');
  return pw === process.env.NEXT_PUBLIC_ADMIN_DEMO || pw === process.env.ADMIN_API_KEY;
}

export async function GET(req: NextRequest) {
  if (!requireAdmin(req)) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  const logs = await prisma.emailLog.findMany({
    orderBy: { sentAt: 'desc' },
    take: 50,
  });
  return NextResponse.json(logs);
}
