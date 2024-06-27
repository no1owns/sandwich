// public/photoUpload.js
import { supabase } from '../src/supabaseConfig.js';

document.getElementById('photo-upload-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const file = document.getElementById('photo-upload').files[0];

  const { data, error } = await supabase.storage
    .from('photos')
    .upload(`public/${file.name}`, file);

  if (error) {
    console.error('Error uploading photo:', error.message);
  } else {
    console.log('Photo uploaded:', data);
    // Optionally, save the photo URL to the sandwich record
    const photoUrl = data.publicURL;
    console.log('Photo URL:', photoUrl);
  }
});
