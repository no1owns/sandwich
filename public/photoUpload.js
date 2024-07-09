// public/photoUpload.js
import { supabase } from '../src/supabaseConfig.js';

document.getElementById('photo-upload-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const file = document.getElementById('photo-upload').files[0];
  const description = document.getElementById('photo-description').value;

  if (file && description) {
    const { data, error } = await supabase.storage
      .from('photos')
      .upload(`public/${file.name}`, file);

    if (error) {
      console.error('Error uploading photo:', error.message);
    } else {
      console.log('Photo uploaded:', data);
      const photoUrl = supabase.storage.from('photos').getPublicUrl(`public/${file.name}`).publicURL;
      console.log('Photo URL:', photoUrl);

      // Save the photo URL and description to the sandwiches table
      const { data: sandwichData, error: insertError } = await supabase
        .from('sandwiches')
        .insert([{ photo_url: photoUrl, description }]);

      if (insertError) {
        console.error('Error saving sandwich:', insertError.message);
      } else {
        console.log('Sandwich saved:', sandwichData);
        // Refresh the sandwich list
        await fetchSandwiches();
      }
    }
  }
});
