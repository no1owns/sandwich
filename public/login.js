// public/login.js
import { supabase } from '../src/supabaseConfig.js';

document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  const { user, error } = await supabase.auth.signIn({ email, password });

  if (error) {
    console.error('Error logging in:', error.message);
  } else {
    console.log('User logged in:', user);
  }
});
