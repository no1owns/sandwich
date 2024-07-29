// src/photoUpload.js
import { supabase } from './supabaseConfig.js';

console.log('photoUpload.js loaded');

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('photo-upload-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const file = document.getElementById('photo-upload').files[0];
    const name = document.getElementById('sandwich-name').value;
    const description = document.getElementById('photo-description').value;
    const type = document.getElementById('sandwich-type').value;

    if (file && name && description && type) {
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

          const { data: sandwichData, error: insertError } = await supabase
            .from('sandwiches')
            .insert([{ name, photo_url: photoUrl, description: `${description} (Labels: ${labels})`, type }]);

          if (insertError) throw insertError;

          await fetchSandwiches();
          alert('Sandwich uploaded successfully! Image labels: ' + labels);
        };
      } catch (error) {
        console.error('Error:', error.message);
        alert(`Error: ${error.message}`);
      }
    } else {
      alert('Please fill in all fields and select a file.');
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
