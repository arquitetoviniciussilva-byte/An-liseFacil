import { createClient } from '@supabase/supabase-js';

// Fallback para evitar erro de inicialização caso as variáveis não estejam definidas
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder-url.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.warn(
    "Supabase: Credenciais não encontradas. Por favor, clique no botão 'Add Supabase' para configurar a integração."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);