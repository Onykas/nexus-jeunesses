import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  const checks: Record<string, string> = {};

  // Variables d'environnement critiques
  checks.DATABASE_URL = process.env.DATABASE_URL ? '✅ définie' : '❌ MANQUANTE';
  checks.GMAIL_USER = process.env.GMAIL_USER ? '✅ définie' : '❌ MANQUANTE';
  checks.GMAIL_PASS = process.env.GMAIL_PASS ? '✅ définie' : '❌ MANQUANTE';
  checks.ADMIN_API_KEY = process.env.ADMIN_API_KEY ? '✅ définie' : '❌ MANQUANTE';
  checks.NEXT_PUBLIC_ADMIN_DEMO = process.env.NEXT_PUBLIC_ADMIN_DEMO ? '✅ définie' : '❌ MANQUANTE';

  // Test connexion base de données
  try {
    await prisma.$queryRaw`SELECT 1`;
    checks.database_connection = '✅ connectée';
  } catch (err) {
    checks.database_connection = `❌ ERREUR: ${err instanceof Error ? err.message : String(err)}`;
  }

  const allOk = Object.values(checks).every(v => v.startsWith('✅'));

  return NextResponse.json(
    { status: allOk ? 'ok' : 'degraded', checks },
    { status: allOk ? 200 : 503 }
  );
}
