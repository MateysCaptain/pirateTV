import { initializeApp } from 'firebase/app';
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCe2-GTKMCiUoB2OeT5T_VHVSUTlk3c-X8",
  authDomain: "project2-875b7.firebaseapp.com",
  projectId: "project2-875b7",
  storageBucket: "project2-875b7.appspot.com",
  messagingSenderId: "499099103246",
  appId: "1:499099103246:web:da4227ec3685a669a2cc5f",
  measurementId: "G-L3RJH684DJ"
};

const app = initializeApp(firebaseConfig);

const analytics = getAnalytics(app);

export const authentication = getAuth(app);