/**
 * Supabase Client Configuration
 * Initialized with public/publishable credentials for secure client-side communication.
 * Never exposes or uses secret / service-role keys in frontend code.
 */

import { createClient } from '@supabase/supabase-js';

const rawUrl = (import.meta.env.VITE_SUPABASE_URL || 'https://qpvonoyzceptitgwvcas.supabase.co') as string;
// Clean URL to base domain in case /rest/v1/ was included
const supabaseUrl = rawUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '');
const supabasePublishableKey = (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_yZ4cB94LtZT0c_q34RRoEw_Q5fcFXnx') as string;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabasePublishableKey);

export const supabase = createClient(supabaseUrl, supabasePublishableKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});
