// uploadImage.js
import { storage, ref, uploadBytes, getDownloadURL } from './firebaseConfig';

export const uploadImage = async (file) => {
  if (!file) return null;

  // Create a reference with a unique name for the image
  const storageRef = ref(storage, `images/${Date.now()}_${file.name}`);
  try {
    // Upload the file
    await uploadBytes(storageRef, file);
    // Get the download URL
    const url = await getDownloadURL(storageRef);
    return url;
  } catch (error) {
    console.error("Error uploading image: ", error);
    return null;
  }
};
