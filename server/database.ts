import { createClient, type SupabaseClient } from '@supabase/supabase-js';

export const STATE_BUCKETS = [
  'documents',
  'complaints',
  'passes',
  'notifications',
  'feedback',
  'campusfind',
  'surveys',
] as const;

export type StateBucket = (typeof STATE_BUCKETS)[number];

let client: SupabaseClient | null | undefined;

export function databaseStatus() {
  return {
    configured: Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SECRET_KEY),
    provider: 'supabase',
  };
}

function database() {
  if (client !== undefined) return client;
  const url = process.env.SUPABASE_URL;
  const secret = process.env.SUPABASE_SECRET_KEY;
  client = url && secret
    ? createClient(url, secret, {
        auth: { persistSession: false, autoRefreshToken: false },
      })
    : null;
  return client;
}

export async function readState(bucket: StateBucket) {
  const db = database();
  if (!db) return { configured: false, found: false, data: null } as const;
  const { data, error } = await db
    .from('campus_demo_state')
    .select('data')
    .eq('bucket', bucket)
    .maybeSingle();
  if (error) throw new Error(`Supabase read failed: ${error.message}`);
  return { configured: true, found: Boolean(data), data: data?.data ?? null } as const;
}

export async function writeState(bucket: StateBucket, data: unknown) {
  const db = database();
  if (!db) return { configured: false } as const;
  const { error } = await db.from('campus_demo_state').upsert({
    bucket,
    data,
    updated_at: new Date().toISOString(),
  });
  if (error) throw new Error(`Supabase write failed: ${error.message}`);
  return { configured: true } as const;
}
