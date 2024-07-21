// src/supabaseConfig.js
export let supabase;

document.addEventListener('DOMContentLoaded', () => {
  if (!window.SUPABASE_URL || !window.SUPABASE_KEY) {
    throw new Error('Supabase URL and Key must be defined');
  }
  supabase = supabase.createClient(window.SUPABASE_URL, window.SUPABASE_KEY);
  console.log('supabaseConfig.js loaded');
});
