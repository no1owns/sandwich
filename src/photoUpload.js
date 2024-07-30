// src/photoUpload.js
import { supabase } from './supabaseConfig.js';

console.log('photoUpload.js loaded');

document.addEventListener('DOMContentLoaded', () => {
  const photoUploadForm = document.getElementById('photo-upload-form');
  const formFields = document.getElementById('form-fields');
  const processingModal = document.getElementById('processing-modal');
  const photoUploadInput = document.getElementById('photo-upload');

  photoUploadInput.addEventListener('change', async (e) => {
    e.preventDefault();
    const file = photoUploadInput.files[0];
    if (file) {
      processingModal.style.display = 'block';
      const fileName = `${Date.now()}-${file.name}`;

      try {
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('photos')
          .upload(`public/${fileName}`, file);

        if (uploadError) throw uploadError;

        const { data: publicUrlData, error: urlError } = await supabase.storage
          .from('photos')
          .getPublicUrl(`public/${fileName}`);

        if (urlError) throw urlError;

        const photoUrl = publicUrlData.publicUrl;
        if (!photoUrl) throw new Error('Public URL is null or undefined');

        // Load the image and perform image recognition using TensorFlow.js
        const img = new Image();
        img.src = URL.createObjectURL(file);
        img.onload = async () => {
          const model = await mobilenet.load();
          const predictions = await model.classify(img);
          console.log('Predictions:', predictions);

          const labels = predictions.map(prediction => prediction.className).join(', ');

          // Populate hidden fields with prediction results
          document.getElementById('photo-description').value = `Labels: ${labels}`;
          document.getElementById('photo-url').value = photoUrl;

          // Show form fields
          formFields.style.display = 'block';
          processingModal.style.display = 'none';
        };
      } catch (error) {
        console.error('Error:', error.message);
        alert(`Error: ${error.message}`);
        processingModal.style.display = 'none';
      }
    }
  });

  photoUploadForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('sandwich-name').value;
    const description = document.getElementById('photo-description').value;
    const type = document.getElementById('sandwich-type').value;
    const photoUrl = document.getElementById('photo-url').value;

    if (name && description && type && photoUrl) {
      try {
        const { data: sandwichData, error: insertError } = await supabase
          .from('sandwiches')
          .insert([{ name, photo_url: photoUrl, description, type }]);

        if (insertError) throw insertError;

        await fetchSandwiches();
        alert('Sandwich uploaded successfully!');
      } catch (error) {
        console.error('Error:', error.message);
        alert(`Error: ${error.message}`);
      }
    } else {
      alert('Please fill in all fields.');
    }
  });

  async function fetchSandwiches() {
    try {
      const { data, error } = await supabase
        .from('sandwiches')
        .select('photo_url, description, name, type, date');

      if (error) throw error;

      displaySandwiches(data);
    } catch (error) {
      console.error('Error fetching sandwiches:', error.message);
      alert(`Error fetching sandwiches: ${error.message}`);
    }
  }

  function displaySandwiches(sandwiches) {
    const sandwichList = document.getElementById('sandwich-list');
    sandwichList.innerHTML = '';

    sandwiches.forEach(sandwich => {
      const listItem = document.createElement('li');
      listItem.innerHTML = `
        <div class="content">
          <img src="${sandwich.photo_url}" alt="Sandwich Image">
          <div class="details">
            <h3>${sandwich.name}</h3>
            <p>${sandwich.description}</p>
          </div>
        </div>
        <div class="meta">
          <span class="type">${sandwich.type}</span>
          <span class="date">${new Date(sandwich.date).toLocaleDateString()}</span>
        </div>
      `;
      sandwichList.appendChild(listItem);
    });
  }

  fetchSandwiches();
});
