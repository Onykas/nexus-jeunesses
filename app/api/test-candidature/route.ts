import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const results: Record<string, string> = {
    DATABASE_URL: process.env.DATABASE_URL ? 'OK (set)' : 'MANQUANT',
    SUPABASE_URL: process.env.SUPABASE_URL ? 'OK (set)' : 'MANQUANT',
    SUPABASE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'OK (set)' : 'MANQUANT',
  };

  try {
    const count = await prisma.eloquenceCandidate.count();
    results.eloquenceTable = `OK (${count} candidats)`;
  } catch (e) {
    results.eloquenceTable = `ERREUR: ${e instanceof Error ? e.message : String(e)}`;
  }

  try {
    const count = await prisma.inscription.count();
    results.inscriptionTable = `OK (${count} inscrits)`;
  } catch (e) {
    results.inscriptionTable = `ERREUR: ${e instanceof Error ? e.message : String(e)}`;
  }

  return NextResponse.json(results);
}
