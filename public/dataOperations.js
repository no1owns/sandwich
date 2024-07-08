// public/dataOperations.js
import { supabase } from '../src/supabaseConfig.js';

// Function to add a sandwich
async function addSandwich(sandwich) {
  const { data, error } = await supabase
    .from('sandwiches')
    .insert([sandwich]);

  if (error) {
    console.error('Error adding sandwich:', error.message);
  } else {
    console.log('Sandwich added:', data);
  }
}

async function fetchSandwiches() {
  const { data, error } = await supabase
    .from('sandwiches')
    .select('*');

  if (error) {
    console.error('Error fetching sandwiches:', error.message);
  } else {
    console.log('Sandwiches fetched:', data);
    return data;
  }
}

// Example usage: fetch and display sandwiches
document.addEventListener('DOMContentLoaded', async () => {
  const sandwiches = await fetchSandwiches();
  const sandwichList = document.getElementById('sandwich-list');

  sandwiches.forEach(sandwich => {
    const listItem = document.createElement('li');
    listItem.innerHTML = `
      <h3>${sandwich.name}</h3>
      <p>${sandwich.description}</p>
      <img src="${sandwich.photo_url}" alt="${sandwich.name}" width="200">
    `;
    sandwichList.appendChild(listItem);
  });
});
// Example usage
document.addEventListener('DOMContentLoaded', () => {
  fetchSandwiches().then(sandwiches => {
    // Display sandwiches on the page
    console.log(sandwiches);
  });
});

export { addSandwich, fetchSandwiches };
