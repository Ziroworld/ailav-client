// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBOBuy2F4VqUjcXEAiv6EzyKJ1lN_cOW8s",
  authDomain: "ailav-5e0a8.firebaseapp.com",
  projectId: "ailav-5e0a8",
  storageBucket: "ailav-5e0a8.firebasestorage.app",
  messagingSenderId: "731834648523",
  appId: "1:731834648523:web:c9262f8064c61f2cc5184e",
  measurementId: "G-8VTC6J1FN6"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage, ref, uploadBytes, getDownloadURL };
