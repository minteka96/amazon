
import firebase from "firebase/compat/app";
import {getAuth} from "firebase/auth"
import "firebase/compat/firestore"
import "firebase/compat/auth"
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBbwE8JiJn3SOgyiHIRAiwYKpMwJKvbees",
  authDomain: "e-clone-910ad.firebaseapp.com",
  projectId: "e-clone-910ad",
  storageBucket: "e-clone-910ad.appspot.com",
  messagingSenderId: "475589110948",
  appId: "1:475589110948:web:f801737d9b226277964a31",
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
export const auth=getAuth(app);
export const db=app.firestore();