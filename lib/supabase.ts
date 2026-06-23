import { createClient, SupabaseClient } from '@supabase/supabase-js';

let _client: SupabaseClient | null = null;

function getClient(): SupabaseClient {
  if (_client) return _client;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY manquant');
  _client = createClient(url, key);
  return _client;
}

export async function uploadVideo(file: File, folder = 'candidatures'): Promise<string> {
  const client = getClient();
  const ext = file.name.split('.').pop() ?? 'mp4';
  const filename = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const arrayBuffer = await file.arrayBuffer();

  const { error } = await client.storage
    .from('videos')
    .upload(filename, arrayBuffer, {
      contentType: file.type || 'video/mp4',
      upsert: false,
    });

  if (error) throw new Error(`Upload échoué: ${error.message}`);

  const { data } = client.storage.from('videos').getPublicUrl(filename);
  return data.publicUrl;
}
