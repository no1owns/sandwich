// src/supabaseConfig.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

export let supabase;

document.addEventListener('DOMContentLoaded', () => {
  if (!window.SUPABASE_URL || !window.SUPABASE_KEY) {
    throw new Error('Supabase URL and Key must be defined');
  }

  supabase = createClient(window.SUPABASE_URL, window.SUPABASE_KEY);
  console.log('Supabase initialized');

  // Check if the user is already logged in
  supabase.auth.getSession().then(({ data: { session } }) => {
    if (session) {
      // User is logged in, show main content
      document.getElementById('main-content').style.display = 'block';
      document.getElementById('login-button').style.display = 'none';
      document.getElementById('logout-button').style.display = 'block';
    } else {
      // User is not logged in, show login button
      document.getElementById('login-button').style.display = 'block';
      document.getElementById('logout-button').style.display = 'none';
    }
  });

  // Handle login button click
  document.getElementById('login-button').addEventListener('click', async () => {
    const { user, session, error } = await supabase.auth.signInWithOAuth({
      provider: 'google'
    });
    if (error) {
      console.error('Error during sign-in:', error.message);
      alert(`Error during sign-in: ${error.message}`);
    } else {
      // Show main content after successful login
      document.getElementById('main-content').style.display = 'block';
      document.getElementById('login-button').style.display = 'none';
      document.getElementById('logout-button').style.display = 'block';
    }
  });

  // Handle logout button click
  document.getElementById('logout-button').addEventListener('click', async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error during sign-out:', error.message);
      alert(`Error during sign-out: ${error.message}`);
    } else {
      // Hide main content after logout
      document.getElementById('main-content').style.display = 'none';
      document.getElementById('login-button').style.display = 'block';
      document.getElementById('logout-button').style.display = 'none';
    }
  });
});
