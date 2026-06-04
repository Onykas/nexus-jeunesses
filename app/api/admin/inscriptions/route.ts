import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

function requireAdmin(req: NextRequest) {
  const pw = req.headers.get('x-admin-password');
  return pw === process.env.NEXT_PUBLIC_ADMIN_DEMO || pw === process.env.ADMIN_API_KEY;
}

export async function GET(req: NextRequest) {
  if (!requireAdmin(req)) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const exportCsv = searchParams.get('export') === 'csv';
  const search = searchParams.get('search') || '';
  const role = searchParams.get('role') || '';

  try {
    const where: Record<string, unknown> = {};
    if (role) where.role = role;
    if (search) {
      where.OR = [
        { prenom: { contains: search, mode: 'insensitive' } },
        { nom: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [inscriptions, total, byRole, accounts, candidates, votes] = await Promise.all([
      prisma.inscription.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: 200,
      }),
      prisma.inscription.count(),
      prisma.inscription.groupBy({ by: ['role'], _count: { role: true } }),
      prisma.userAccount.count(),
      prisma.eloquenceCandidate.count(),
      prisma.vote.count(),
    ]);

    if (exportCsv) {
      const rows = inscriptions.map((i) =>
        [i.id, i.prenom, i.nom, i.email, i.telephone, i.role, i.nationalite, i.status, i.createdAt.toISOString()].join(',')
      );
      const csv = ['ID,Prénom,Nom,Email,Téléphone,Rôle,Nationalité,Statut,Date', ...rows].join('\n');
      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': 'attachment; filename="nexus-inscriptions.csv"',
        },
      });
    }

    return NextResponse.json({ inscriptions, total, byRole, accounts, candidates, votes });
  } catch (err) {
    console.error('[admin/inscriptions]', err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
