import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from './database.types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let supabase: SupabaseClient<Database> | null = null;

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
    },
  });
} else {
  console.warn('Supabase environment variables not set. Supabase client will be null.');
}

export const getSupabase = (): SupabaseClient<Database> | null => {
  if (!supabase) {
    console.error('Supabase client is not initialized. Check environment variables.');
  }
  return supabase;
};

// Alias for backwards compatibility
export const supabaseClient = supabase;

export const supabaseAdmin: SupabaseClient<Database> | null = (() => {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (supabaseUrl && serviceKey) {
    return createClient<Database>(supabaseUrl, serviceKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
      },
    });
  }
  console.warn('Supabase admin environment variables not set.');
  return null;
})();