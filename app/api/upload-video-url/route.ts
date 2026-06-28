import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const { fileName } = await req.json().catch(() => ({ fileName: 'video' }));

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ error: 'Configuration Supabase manquante' }, { status: 500 });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  const ext = String(fileName ?? 'video').split('.').pop() ?? 'mp4';
  const path = `candidatures/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { data, error } = await supabase.storage.from('videos').createSignedUploadUrl(path);
  if (error) {
    console.error('[upload-video-url] Supabase erreur:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const publicUrl = supabase.storage.from('videos').getPublicUrl(path).data.publicUrl;
  // Le token doit être ajouté à l'URL signée pour que le PUT fonctionne
  const signedUrl = `${data.signedUrl}?token=${data.token}`;
  return NextResponse.json({ signedUrl, publicUrl });
}
