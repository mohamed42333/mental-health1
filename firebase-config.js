
export const firebaseConfig = {
  apiKey: "AIzaSyBNqHjRNffI-0FzazC0qooFraxQA5H0cFQ",
  authDomain: "mental-health-38d37.firebaseapp.com",
  projectId: "mental-health-38d37",
  storageBucket: "mental-health-38d37.firebasestorage.app",
  messagingSenderId: "2953787588",
  appId: "1:2953787588:web:e7b87dbc90b1484ab63191",
  measurementId: "G-M7JM4KPJ5K"
};

export const ADMIN_UID = "rPcEdXPhZnfm4RTVkHAuRNptx062";
export const FIREBASE_CONFIGURED =
  !firebaseConfig.apiKey.startsWith("PASTE_") &&
  !firebaseConfig.projectId.startsWith("YOUR_") &&
  !firebaseConfig.appId.startsWith("PASTE_") &&
  !ADMIN_UID.startsWith("PASTE_");
