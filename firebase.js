import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDnNC3rr64dBYFBDxpwmH5fEjfwn8cGrQ4",
  authDomain: "imageuploader-rn.firebaseapp.com",
  projectId: "imageuploader-rn",
  storageBucket: "imageuploader-rn.appspot.com",
  messagingSenderId: "60764133368",
  appId: "1:60764133368:web:668d00afeda167d529a80d",
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const db = getFirestore(app);
