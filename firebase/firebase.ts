// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider, GithubAuthProvider, signInWithEmailAndPassword, signInWithPopup, createUserWithEmailAndPassword, sendPasswordResetEmail, signOut, applyActionCode, onAuthStateChanged,  } from "firebase/auth";
import { doc, getFirestore, setDoc, getDoc, addDoc, collection, getDocs, query, where, orderBy, limit, onSnapshot, serverTimestamp, updateDoc, deleteDoc, Timestamp } from "firebase/firestore";
import { getDownloadURL,  getStorage, ref, uploadBytes } from "firebase/storage";
import { useCollectionData } from "react-firebase-hooks/firestore";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAs4Czmjzm59C-40Fffhy41kOXfiPQ8tHE",
  authDomain: "tcc-uni.firebaseapp.com",
  projectId: "tcc-uni",
  storageBucket: "tcc-uni.appspot.com",
  messagingSenderId: "544804281516",
  appId: "1:544804281516:web:385f36322663075d871309",
  measurementId: "G-W6FQCJ7BVF"
};

// Initialize Firebase App (singleton pattern)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export {
    auth,
    db,
    storage,
    ref,
    uploadBytes,
    getDownloadURL,
    doc,
    getFirestore,
    serverTimestamp,
    setDoc,
    getDoc,
    addDoc,
    collection,
    getDocs,
    query,
    where,
    applyActionCode,
    onSnapshot,
    GoogleAuthProvider,
    FacebookAuthProvider,
    GithubAuthProvider,
    signInWithPopup,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    signOut,
    orderBy,
    limit,
    useCollectionData,
    onAuthStateChanged,
    updateDoc,
    deleteDoc,
    Timestamp,
    getStorage
}

