// Firebase Console > Project settings > Your apps > SDK setup and configuration
// এখানকার মানগুলো আপনার নিজের Firebase web app-এর firebaseConfig দিয়ে বদলান।
window.FIREBASE_CONFIG = {
  apiKey: "AIzaSyBhoFpzxJXrcgmliQ2HPCL5gEREwryaht4",
  authDomain: "golpokotha-1.firebaseapp.com",
  projectId: "golpokotha-1",
  storageBucket: "golpokotha-1.firebasestorage.app",
  messagingSenderId: "1016671173196",
  appId: "1:1016671173196:web:4c1de0e6d089cd87fb52e9"
};

if (!firebase.apps.length) {
  firebase.initializeApp(window.FIREBASE_CONFIG);
}
window.golpokothaDb = firebase.firestore();
window.golpokothaAuth = firebase.auth();
