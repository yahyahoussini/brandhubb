import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';
import { config } from '@/shared/config';

// Import the supabase client like this:
// import { supabase } from "@/shared/api/supabase/client";

const isBrowser = typeof window !== 'undefined';

export const supabase = createClient<Database>(config.VITE_SUPABASE_URL, config.VITE_SUPABASE_ANON_KEY, {
  auth: {
    storage: isBrowser ? localStorage : undefined,
    persistSession: isBrowser,
    autoRefreshToken: isBrowser,
  }
});