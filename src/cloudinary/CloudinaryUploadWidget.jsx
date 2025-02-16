import React from 'react';

// const CloudinaryUploadWidget = ({ onUpload }) => {
//   const openWidget = () => {
//     // Create the upload widget with your cloud name and unsigned preset
//     const widget = window.cloudinary.createUploadWidget(
//       {
//         cloudName: 'dx3bvihmi',
//         uploadPreset: 'ailav-images', // Replace with your preset name
//         sources: ['local', 'url', 'camera'],
//       },
//       (error, result) => {
//         if (!error && result && result.event === "success") {
//           console.log('Upload successful: ', result.info);
//           // Pass the secure URL to the parent component
//           onUpload(result.info.secure_url);
//         } else if (error) {
//           console.error('Upload widget error:', error);
//         }
//       }
//     );
//     widget.open();
//   };

//   return (
//     <button className="btn bg-blue-600 text-white" onClick={openWidget}>
//       Upload Image via Cloudinary
//     </button>
//   );
// };

// export default CloudinaryUploadWidget;

export async function uploadImage(file) {
  const url = `https://api.cloudinary.com/v1_1/dx3bvihmi/upload`;
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "ailav-images"); // your unsigned preset

  try {
    const response = await fetch(url, {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    if (data.secure_url) {
      return data.secure_url;
    } else {
      throw new Error("Upload failed");
    }
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw error;
  }
}
