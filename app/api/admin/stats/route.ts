import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

function requireAdmin(req: NextRequest) {
  const key = req.headers.get('x-admin-key');
  return key === process.env.ADMIN_API_KEY;
}

export async function GET(req: NextRequest) {
  if (!requireAdmin(req)) {
    return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const exportCsv = searchParams.get('export') === 'csv';

  try {
    const [total, byRole, byNationalite, recentInscriptions] = await Promise.all([
      prisma.inscription.count(),
      prisma.inscription.groupBy({ by: ['role'], _count: { role: true } }),
      prisma.inscription.groupBy({ by: ['nationalite'], _count: { nationalite: true }, orderBy: { _count: { nationalite: 'desc' } }, take: 10 }),
      prisma.inscription.findMany({ orderBy: { createdAt: 'desc' }, take: 50, select: { id: true, prenom: true, nom: true, email: true, role: true, nationalite: true, status: true, createdAt: true } }),
    ]);

    if (exportCsv) {
      const rows = recentInscriptions.map((i) =>
        [i.id, i.prenom, i.nom, i.email, i.role, i.nationalite, i.status, i.createdAt.toISOString()].join(',')
      );
      const csv = ['ID,Prénom,Nom,Email,Rôle,Nationalité,Statut,Date', ...rows].join('\n');
      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="nexus-inscriptions.csv"`,
        },
      });
    }

    return NextResponse.json({ total, byRole, byNationalite, recentInscriptions });
  } catch (err) {
    console.error('[admin/stats]', err);
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 });
  }
}
