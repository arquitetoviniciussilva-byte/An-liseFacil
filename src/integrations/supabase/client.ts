import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Log for debugging (remove in production)
if (import.meta.env.DEV) {
  console.log('Supabase URL:', SUPABASE_URL ? 'Set' : 'Not set');
  console.log('Supabase Anon Key:', SUPABASE_ANON_KEY ? 'Set' : 'Not set');
}

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn('Supabase URL or ANON KEY not found. Make sure to set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment variables.');
  // Create a dummy client to prevent crashes during development
  // In a real app, you might want to handle this differently
  export const supabase = createClient('', '');
} else {
  export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}