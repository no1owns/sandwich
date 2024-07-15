// src/supabaseConfig.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://uzjaizmdgwfyiixwspdp.supabase.co'; // Replace with your Supabase URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV6amFpem1kZ3dmeWlpeHdzcGRwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTk0NTAyNTUsImV4cCI6MjAzNTAyNjI1NX0.7HEUiRGbVWTv8St_PEcwiTVjazkCRDwK324oPJuF7Ns'; // Replace with your Supabase anon key

export const supabase = createClient(supabaseUrl, supabaseKey);
