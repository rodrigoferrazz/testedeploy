const supabase = require('../config/supabase');

// Generates a signed URL for an image stored in Supabase Storage
async function generateSignedUrl(path) {
  // Request a signed URL for the given file path, valid for 1 hour (3600 seconds)
  const { data, error } = await supabase
    .storage
    .from('images')
    .createSignedUrl(path, 60 * 60);

  // If there is an error, log it and return null
  if (error) {
    console.error('Error generating signed URL:', error);
    return null;
  }

  // Return the signed URL if successful
  return data.signedUrl;
}

// Generates a signed URL for an image stored in Supabase Storage
async function generateSignedPDF(path) {
  // Request a signed URL for the given file path, valid for 1 hour (3600 seconds)
  const { data, error } = await supabase
    .storage
    .from('pdfs')
    .createSignedUrl(path, 60 * 60, { download: true });

  // If there is an error, log it and return null
  if (error) {
    console.error('Error generating signed URL:', error);
    return null;
  }

  // Return the signed URL if successful
  return data.signedUrl;
}

// Export the function for use in other modules
module.exports = { generateSignedUrl, generateSignedPDF };
