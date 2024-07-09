// public/dataOperations.js
import { supabase } from '../src/supabaseConfig.js';

async function fetchSandwiches() {
  const { data, error } = await supabase
    .from('sandwiches')
    .select('*');

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
      <p>${sandwich.description}</p>
      <img src="${sandwich.photo_url}" alt="Sandwich Image" width="200">
    `;
    sandwichList.appendChild(listItem);
  });
}

// Initial fetch of sandwiches
document.addEventListener('DOMContentLoaded', fetchSandwiches);
