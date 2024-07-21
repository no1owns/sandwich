// src/supabaseConfig.js
const supabaseUrl = window.SUPABASE_URL;
const supabaseKey = window.SUPABASE_KEY;

export const supabase = supabase.createClient(supabaseUrl, supabaseKey);

console.log('supabaseConfig.js loaded');