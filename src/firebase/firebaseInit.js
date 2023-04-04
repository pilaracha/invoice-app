import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
    apiKey: "AIzaSyDFL4W_ceWRXGcA0Oxlys0dlFbKWSMdYsw",
    authDomain: "invoice-app-1a818.firebaseapp.com",
    projectId: "invoice-app-1a818",
    storageBucket: "invoice-app-1a818.appspot.com",
    messagingSenderId: "1024692342469",
    appId: "1:1024692342469:web:159bce2bd5d1e45f3e2aac"
};
  

const firebaseApp = initializeApp(firebaseConfig);

export default getFirestore(firebaseApp);