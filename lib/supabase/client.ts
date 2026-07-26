import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { isSupabaseConfigured, supabasePublishableKey, supabaseUrl } from './config';
import type { Database } from './database.types';

let browserClient: SupabaseClient<Database> | null = null;

export function createBrowserSupabaseClient(): SupabaseClient<Database> | null {
  if (!isSupabaseConfigured || !supabaseUrl || !supabasePublishableKey) return null;

  if (!browserClient) {
    browserClient = createClient<Database>(supabaseUrl, supabasePublishableKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: 'pkce',
      },
      global: {
        headers: {
          'x-application-name': 'alpha-weber-crm',
        },
      },
    });
  }

  return browserClient;
}
