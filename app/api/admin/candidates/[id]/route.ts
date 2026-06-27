import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

function requireAdmin(req: NextRequest) {
  const pw = req.headers.get('x-admin-password');
  return pw === process.env.NEXT_PUBLIC_ADMIN_DEMO || pw === process.env.ADMIN_API_KEY;
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!requireAdmin(req)) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  try {
    const { id } = await params;
    const body = await req.json();
    const { status, videoPublique } = body as {
      status?: 'pending' | 'validated' | 'rejected';
      videoPublique?: boolean;
    };

    const data: Record<string, unknown> = {};
    if (status !== undefined) data.status = status;
    if (videoPublique !== undefined) data.videoPublique = videoPublique;

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: 'Aucune modification' }, { status: 400 });
    }

    const updated = await prisma.eloquenceCandidate.update({
      where: { id },
      data,
    });

    return NextResponse.json({ ok: true, id: updated.id, status: updated.status, videoPublique: updated.videoPublique });
  } catch (err) {
    console.error('[admin/candidates] erreur:', err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
