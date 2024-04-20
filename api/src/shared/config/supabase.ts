import { createClient } from '@supabase/supabase-js';
import { env } from './env';

export const supabaseClient = createClient(env.supabaseUrl, env.supabaseApi, {
  auth: { persistSession: false },
});
