// public/signUp.js
import { supabase } from '../src/supabaseConfig.js';

document.getElementById('sign-up-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('sign-up-email').value;
  const password = document.getElementById('sign-up-password').value;

  const { user, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    console.error('Error signing up:', error.message);
  } else {
    console.log('User signed up:', user);
  }
});
