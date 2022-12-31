import { createUserWithEmailAndPassword, getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from "firebase/auth";
import React, { createContext, useContext, useEffect, useState } from 'react';
import { app } from "../Configuration/Firebase.config";


export const AuthUser = createContext();
const auth = getAuth(app);
const provaider = new GoogleAuthProvider();

const UserContext = ({ children }) => {
    const [user, setUser] = useState('')
    const [loading, setLoading] = useState(true)
    // console.log(user);

    const GoogleLogin = () => signInWithPopup(auth, provaider);
    const loginEmail = (email, password) => signInWithEmailAndPassword(auth, email, password);
    const CreateUserEP = (email, password) => createUserWithEmailAndPassword(auth, email, password);
    const logout = () => signOut(auth);
    const updateProfilePic = (name, photo) =>
        updateProfile(auth.currentUser,
            { displayName: name, photoURL: photo })

    useEffect(() => {
        const unsuscribe = onAuthStateChanged(auth, currentUser => {
            // console.log(currentUser.displayName);
            setLoading(false)
            setUser(currentUser)
        })
        return () => unsuscribe()
    }, [])
    const authInfo = {
        user, setUser,
        loading, setLoading,
        GoogleLogin, loginEmail,
        logout,
        updateProfilePic, CreateUserEP,
    }
    return (
        <AuthUser.Provider value={authInfo}>
            {children}
        </AuthUser.Provider>
    );
};

export const useFirebaseInfo = () => {
    const context = useContext(AuthUser);
    return context
}

export default UserContext;