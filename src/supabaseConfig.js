// src/supabaseConfig.js
if (!window.SUPABASE_URL || !window.SUPABASE_KEY) {
    throw new Error('Supabase URL and Key must be defined');
  }
  
  export const supabase = supabase.createClient(window.SUPABASE_URL, window.SUPABASE_KEY);
  
  console.log('supabaseConfig.js loaded');  