// public/src/photoUpload.js

console.log('photoUpload.js loaded');

document.getElementById('photo-upload-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  console.log('Form submitted');

  const file = document.getElementById('photo-upload').files[0];
  const name = document.getElementById('sandwich-name').value;
  const description = document.getElementById('photo-description').value;
  const type = document.getElementById('sandwich-type').value;

  if (file && name && description && type) {
    const fileName = `${Date.now()}-${file.name}`; // Ensure unique file names

    console.log('Uploading file:', fileName);

    // Upload the file
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('photos')
      .upload(`public/${fileName}`, file);

    if (uploadError) {
      console.error('Error uploading photo:', uploadError.message);
      return;
    }

    console.log('Photo uploaded:', uploadData);

    // Generate public URL for the uploaded file
    const { data: publicUrlData, error: urlError } = await supabase.storage
      .from('photos')
      .getPublicUrl(`public/${fileName}`);

    if (urlError) {
      console.error('Error getting public URL:', urlError.message);
      return;
    }

    console.log('Public URL Data:', publicUrlData);

    const photoUrl = publicUrlData.publicUrl;
    console.log('Public URL:', photoUrl);

    if (!photoUrl) {
      console.error('Public URL is null or undefined');
      return;
    }

    // Save the photo URL, name, description, and type to the sandwiches table
    const { data: sandwichData, error: insertError } = await supabase
      .from('sandwiches')
      .insert([{ name, photo_url: photoUrl, description, type }]);

    if (insertError) {
      console.error('Error saving sandwich:', insertError.message);
    } else {
      console.log('Sandwich saved:', sandwichData);
      // Refresh the sandwich list
      await fetchSandwiches();
    }
  }
});

// Fetch and Display Sandwiches
async function fetchSandwiches() {
  const { data, error } = await supabase
    .from('sandwiches')
    .select('photo_url, description, name, type, date');

  if (error) {
    console.error('Error fetching sandwiches:', error.message);
  } else {
    console.log('Sandwiches fetched:', data);
    displaySandwiches(data);
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

// Initial fetch of sandwiches
document.addEventListener('DOMContentLoaded', fetchSandwiches);
