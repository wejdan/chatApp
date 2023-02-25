// Import the functions you need from the SDKs you need

import {initializeApp} from 'firebase/app';

import Config from 'react-native-config';
import {getAuth} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore';
import {initializeFirestore} from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: Config.API_KEY,
  authDomain: Config.AUTH_DOMAIN,
  projectId: Config.PROJECT_ID,
  storageBucket: Config.STORAGE_BUCKET,
  messagingSenderId: Config.MESSAGING_SENDER_Id,
  appId: Config.APP_ID,
};

// Initialize Firebase
// let app;
// if (firebase.apps.length === 0) {
//   app = initializeApp(firebaseConfig);
// } else {
//   app = firebase.app();
// }

const app = initializeApp(firebaseConfig);
export const auth = getAuth();

export const database = initializeFirestore(app, {
  experimentalForceLongPolling: true,
});
