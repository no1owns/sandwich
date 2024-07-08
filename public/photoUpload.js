// public/photoUpload.js
import { supabase } from '../src/supabaseConfig.js';

document.getElementById('photo-upload-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const file = document.getElementById('photo-upload').files[0];

  if (file) {
    const { data, error } = await supabase.storage
      .from('photos')
      .upload(`public/${file.name}`, file);

    if (error) {
      console.error('Error uploading photo:', error.message);
    } else {
      console.log('Photo uploaded:', data);
      const photoUrl = supabase.storage.from('photos').getPublicUrl(`public/${file.name}`).publicURL;
      console.log('Photo URL:', photoUrl);

      // Save the photo URL to the sandwich record
      const sandwichId = 'your-sandwich-id'; // Replace with actual sandwich ID
      const { data: updateData, error: updateError } = await supabase
        .from('sandwiches')
        .update({ photo_url: photoUrl })
        .eq('id', sandwichId);

      if (updateError) {
        console.error('Error updating sandwich record:', updateError.message);
      } else {
        console.log('Sandwich record updated:', updateData);
      }
    }
  }
});
