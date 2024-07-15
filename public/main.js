// public/main.js
console.log('main.js loaded');

try {
  import('./src/photoUpload.js').then(module => {
    console.log('photoUpload.js imported successfully');
  }).catch(error => {
    console.error('Error importing photoUpload.js:', error);
  });
} catch (error) {
  console.error('Error in main.js:', error);
}

document.addEventListener('DOMContentLoaded', () => {
  console.log('Application initialized');
});