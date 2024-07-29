// src/photoUpload.js
import { supabase } from './supabaseConfig.js';

console.log('photoUpload.js loaded');

document.addEventListener('DOMContentLoaded', () => {
  const photoUploadForm = document.getElementById('photo-upload-form');
  const sandwichDetailsForm = document.getElementById('sandwich-details-form');
  let uploadedFile = null;

  photoUploadForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const file = document.getElementById('photo-upload').files[0];
    if (file) {
      uploadedFile = file;
      processPhoto(file);
    } else {
      alert('Please select a file.');
    }
  });

  async function processPhoto(file) {
    try {
      // Load the image and perform image recognition using TensorFlow.js
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = async () => {
        const model = await mobilenet.load();
        const predictions = await model.classify(img);
        console.log('Predictions:', predictions);

        // Pre-fill form fields
        document.getElementById('sandwich-name').value = predictions[0]?.className || '';
        document.getElementById('photo-description').value = predictions.map(prediction => prediction.className).join(', ');

        // Show the sandwich details form
        sandwichDetailsForm.style.display = 'block';
      };
    } catch (error) {
      console.error('Error processing photo:', error.message);
      alert(`Error: ${error.message}`);
    }
  }

  sandwichDetailsForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('sandwich-name').value;
    const description = document.getElementById('photo-description').value;
    const type = document.getElementById('sandwich-type').value;

    if (uploadedFile && name && description && type) {
      const fileName = `${Date.now()}-${uploadedFile.name}`;

      try {
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('photos')
          .upload(`public/${fileName}`, uploadedFile);

        if (uploadError) throw uploadError;

        const { data: publicUrlData, error: urlError } = await supabase.storage
          .from('photos')
          .getPublicUrl(`public/${fileName}`);

        if (urlError) throw urlError;

        const photoUrl = publicUrlData.publicUrl;
        if (!photoUrl) throw new Error('Public URL is null or undefined');

        const { data: sandwichData, error: insertError } = await supabase
          .from('sandwiches')
          .insert([{ name, photo_url: photoUrl, description, type }]);

        if (insertError) throw insertError;

        await fetchSandwiches();
        alert('Sandwich saved successfully!');
        sandwichDetailsForm.reset();
        sandwichDetailsForm.style.display = 'none';
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
