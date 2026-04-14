import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://gloaemkvvqsluhcsrcwg.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdsb2FlbWt2dnFzbHVoY3NyY3dnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU4NDA3OTQsImV4cCI6MjA5MTQxNjc5NH0.3Xei42v6ZWo8Yk3f0ArmZCrptJ07ZuRfZDAwMg5zJ7U";

// Exporta como default para que possa ser importado com `import supabase from "@/lib/supabase"`
export default createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);