import axios from 'axios';

export const uploadImage = async (file) => {
  const url = `https://api.cloudinary.com/v1_1/dx3bvihmi/upload`;
  const formData = new FormData();
  formData.append('file', file);
  // Replace 'your_unsigned_upload_preset' with your actual unsigned preset name from Cloudinary
  formData.append('upload_preset', 'ailav-images');
  try {
    const response = await axios.post(url, formData);
    return response.data.secure_url; // URL of the uploaded image
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error);
    throw error;
  }
};
