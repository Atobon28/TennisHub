import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAa3ZnkmWSG4JVtD-RvABoEI-w3YvoGcZo",
  authDomain: "tennishub-50942.firebaseapp.com",
  projectId: "tennishub-50942",
  storageBucket: "tennishub-50942.firebasestorage.app",
  messagingSenderId: "1005756638024",
  appId: "1:1005756638024:web:7f74103242f531047dc97d",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
