// src/supabaseConfig.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

export let supabase;

document.addEventListener('DOMContentLoaded', () => {
  if (!window.SUPABASE_URL || !window.SUPABASE_KEY) {
    throw new Error('Supabase URL and Key must be defined');
  }
  supabase = createClient(window.SUPABASE_URL, window.SUPABASE_KEY);
  console.log('Supabase initialized');
});