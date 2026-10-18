// Firebase Console > Project settings > Your apps > SDK setup and configuration
// এখানকার মানগুলো আপনার নিজের Firebase web app-এর firebaseConfig দিয়ে বদলান।
window.FIREBASE_CONFIG = {
  apiKey: "PASTE_YOUR_API_KEY",
  authDomain: "golpokotha.firebaseapp.com",
  projectId: "golpokotha",
  storageBucket: "golpokotha.firebasestorage.app",
  messagingSenderId: "PASTE_YOUR_MESSAGING_SENDER_ID",
  appId: "PASTE_YOUR_APP_ID"
};

if (!firebase.apps.length) {
  firebase.initializeApp(window.FIREBASE_CONFIG);
}
window.golpokothaDb = firebase.firestore();
window.golpokothaAuth = firebase.auth();
