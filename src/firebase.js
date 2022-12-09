
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyCpl02irNekjl_TOjynKIasqWo1V2a1_hQ",
  authDomain: "appchat-ae8e1.firebaseapp.com",
  projectId: "appchat-ae8e1",
  storageBucket: "appchat-ae8e1.appspot.com",
  messagingSenderId: "164735608347",
  appId: "1:164735608347:web:1d93076882e99f52a63abe"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();
const analytics = getAnalytics(app);