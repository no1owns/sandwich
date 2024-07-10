// public/photoUpload.js
import { supabase } from '../src/supabaseConfig.js';

document.getElementById('photo-upload-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const file = document.getElementById('photo-upload').files[0];
  const name = document.getElementById('sandwich-name').value;
  const description = document.getElementById('photo-description').value;
  const dummyUserId = '00000000-0000-0000-0000-000000000000'; // Dummy user ID for testing

  if (file && name && description) {
    const fileName = `${Date.now()}-${file.name}`; // Ensure unique file names

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('photos')
      .upload(`public/${fileName}`, file);

    if (uploadError) {
      console.error('Error uploading photo:', uploadError.message);
    } else {
      console.log('Photo uploaded:', uploadData);
      const { publicURL } = supabase.storage
        .from('photos')
        .getPublicUrl(`public/${fileName}`);
      console.log('Photo URL:', publicURL);

      // Save the photo URL, name, description, and dummy user ID to the sandwiches table
      const { data: sandwichData, error: insertError } = await supabase
        .from('sandwiches')
        .insert([{ name, photo_url: publicURL, description, user_id: dummyUserId }]);

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
