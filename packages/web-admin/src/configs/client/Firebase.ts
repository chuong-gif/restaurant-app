// Firebase.js
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

// Cấu hình Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCmwskfloA_osrDvKy_J7oDNHI3iVu5bPU",
    authDomain: "huong-sen-restaurant.firebaseapp.com",
    projectId: "huong-sen-restaurant",
    storageBucket: "huong-sen-restaurant.appspot.com",
    messagingSenderId: "293477909059",
    appId: "1:293477909059:web:8f97e9dea82f5702a5caf6",
    measurementId: "G-QF876EG003"
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);

// Xuất Storage và Firestore để dùng trong project
export const storage = getStorage(app);
export const db = getFirestore(app);
