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

// Function to fetch sandwiches
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

// Example usage
document.addEventListener('DOMContentLoaded', () => {
  fetchSandwiches().then(sandwiches => {
    // Display sandwiches on the page
    console.log(sandwiches);
  });
});

export { addSandwich, fetchSandwiches };
