import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

export async function createServerSupabase(): Promise<SupabaseClient> {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseAnonKey =
    process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Supabase is not configured. Set SUPABASE_URL and SUPABASE_ANON_KEY environment variables.'
    );
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      detectSessionInUrl: false,
      persistSession: false,
    },
  });
}
