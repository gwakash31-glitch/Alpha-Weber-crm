import { createBrowserSupabaseClient } from '@/lib/supabase/client';

export { isSupabaseConfigured } from '@/lib/supabase/config';
export { createBrowserSupabaseClient } from '@/lib/supabase/client';

export const supabase = createBrowserSupabaseClient();
