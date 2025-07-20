import { createContext, useContext, useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import {
    getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, FacebookAuthProvider, GithubAuthProvider, signInWithPopup,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut
} from "firebase/auth";
import { getDatabase, set, ref, get, update } from "firebase/database";
import { getFirestore, doc, setDoc, getDoc, collection, addDoc, getDocs, serverTimestamp, getCountFromServer } from "firebase/firestore";


const firebaseConfig = {
    apiKey: "AIzaSyCJaQmENPeufN0VNIKVAiNw9wzUJXN52rk",
    authDomain: "easy-2-ride.firebaseapp.com",
    projectId: "easy-2-ride",
    storageBucket: "easy-2-ride.firebasestorage.app",
    messagingSenderId: "1077937386249",
    appId: "1:1077937386249:web:8b77aea0eca3c9d93099d8",
    measurementId: "G-P7F9NXHR3X",
    databaseURL: "https://easy-2-ride-default-rtdb.firebaseio.com/"
};
export const firebase_app = initializeApp(firebaseConfig);



const firebase_auth = getAuth(firebase_app);
const googleProvider = new GoogleAuthProvider(); // for google sign up
const facebookProvider = new FacebookAuthProvider(); // for facebook sign up
const githubProvider = new GithubAuthProvider(); // for github sign up

const realtime_database = getDatabase(firebase_app);
const firestore = getFirestore(firebase_app);



const FirebaseContext = createContext(null);
export const useFirebase = () => useContext(FirebaseContext); //made a custom hook called useFirebase()


export const FirebaseProvider = (props) => {

    const [currentUser, setCurrentUser] = useState(undefined); // state to store current user
    const [initializing, setInitializing] = useState(true); // state to check if firebase is initialized or not

    useEffect(() => {
        const unsub = onAuthStateChanged(firebase_auth, user => {
            setCurrentUser(user);
            setInitializing(false);
        });
        return unsub;
    }, []);

    const isLoggedIn = currentUser ? true : false;


    // function to signup user with email and password
    const signupUserWithEmailAndPassword = (email, password) => {
        return createUserWithEmailAndPassword(firebase_auth, email, password);
    }
    // function to sign up user with google
    const signupWithGoogle = () => {
        return signInWithPopup(firebase_auth, googleProvider);
    }
    // function to sign up user with facebook
    const signupWithFacebook = () => {
        return signInWithPopup(firebase_auth, facebookProvider);
    }
    // function to sign up user with github
    const signupWithGithub = () => {
        return signInWithPopup(firebase_auth, githubProvider);
    }

    // function to login with Google
    const loginWithGoogle = () => {
        return signInWithPopup(firebase_auth, googleProvider);
    }

    // function to login with Facebook
    const loginWithFacebook = () => {
        return signInWithPopup(firebase_auth, facebookProvider);
    }

    // function to login with GitHub
    const loginWithGithub = () => {
        return signInWithPopup(firebase_auth, githubProvider);
    }


    // function to Login user with email and password
    const loginUserWithEmailAndPassword = (email, password) => {
        return signInWithEmailAndPassword(firebase_auth, email, password);
    }

    // function to log out user
    const logoutUser = () => {
        return signOut(firebase_auth);
    };





    // ------------------------------------ REALTIME - DATABASE 👇🏻---------------------------------------

    // putting data in the realtime database
    const putData = (key, data) => set(ref(realtime_database, key), data);

    // getting data from the realtime database
    const getData = async (path) => {
        const dbRef = ref(realtime_database, path);
        const snapshot = await get(dbRef);
        return snapshot.exists() ? snapshot.val() : null;
    };

    // updating the data in the realtime database
    const updateData = (path, value) => {
        return update(ref(realtime_database, path), value);
    };

    // ------------------------------------ REALTIME - DATABASE 👆🏻---------------------------------------






    // ------------------------------------ FIRESTORE - DATABASE 👇🏻---------------------------------------

    // Write a document to Firestore. In this I can set my docId (it won't be auto-generated like in the case of addFirestoreData function)
    const setFirestoreData = async (collectionName, docId, data, merge = true) => {
        const docRef = doc(firestore, collectionName, docId);
        return await setDoc(docRef, data, { merge });
    };

    // Add a document with auto-generated ID
    const addFirestoreData = async (collectionName, data) => {
        const colRef = collection(firestore, collectionName);
        const docRef = await addDoc(colRef, data);
        return docRef.id;
    };

    // Get a specific document
    const getFirestoreData = async (collectionName, docId) => {
        const docRef = doc(firestore, collectionName, docId);
        const snapshot = await getDoc(docRef);
        return snapshot.exists() ? snapshot.data() : null;
    };

    // Get all documents from a collection
    const getAllFirestoreDocs = async (collectionName) => {
        const colRef = collection(firestore, collectionName);
        const snapshot = await getDocs(colRef);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    };

    // Count documents in a Firestore subcollection
    const getFirestoreDocCount = async (collectionPath) => {
        const colRef = collection(firestore, collectionPath);
        const snapshot = await getCountFromServer(colRef);
        return snapshot.data().count;
    };

    // ------------------------------------ FIRESTORE - DATABASE 👆🏻---------------------------------------



    return (
        <FirebaseContext.Provider
            value={{
                signupUserWithEmailAndPassword,
                signupWithGoogle,
                signupWithFacebook,
                signupWithGithub,
                loginUserWithEmailAndPassword,
                loginWithGoogle,
                loginWithFacebook,
                loginWithGithub,
                logoutUser,
                putData,
                getData,
                updateData,
                setFirestoreData,
                addFirestoreData,
                getFirestoreData,
                getAllFirestoreDocs,
                getFirestoreDocCount,
                serverTimestamp,
                initializing,
                isLoggedIn,
                currentUser
            }}>
            {props.children}
        </FirebaseContext.Provider>
    );
}