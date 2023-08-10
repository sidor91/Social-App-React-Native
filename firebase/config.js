// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	// apiKey: "AIzaSyCPWQJd14hSSrpM3ExYLemV7iZcAefg9LM",
	// authDomain: "social-app-bcdc3.firebaseapp.com",
	// projectId: "social-app-bcdc3",
	// storageBucket: "social-app-bcdc3.appspot.com",
	// messagingSenderId: "1044531107704",
	// appId: "1:1044531107704:web:f5e1f9eca62cbf94465a8d",
	// measurementId: "G-008NG95V6K",
	//////////////////////////////////////
	// apiKey: "AIzaSyAzjYOfiIfr4yzuawQm5NTDVl2T0zWpXmM",
	// authDomain: "social-app-c6417.firebaseapp.com",
	// projectId: "social-app-c6417",
	// storageBucket: "social-app-c6417.appspot.com",
	// messagingSenderId: "543862207457",
	// appId: "1:543862207457:web:923f9e215ed335fe9c18a0",
	//////////////////////////////////////
	apiKey: "AIzaSyC_lkZXJJ2Pfx0wZRB6Uk2a87ll_bGUQfQ",
	authDomain: "react-native-95b77.firebaseapp.com",
	projectId: "react-native-95b77",
	storageBucket: "react-native-95b77.appspot.com",
	messagingSenderId: "621801866736",
	appId: "1:621801866736:web:77d35eecfb2f4cc2ce0935",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


export const auth = getAuth(app)
export const db = getFirestore(app);
export const storage = getStorage(app);

