// AuthProvider.jsx
import  { createContext, useEffect, useState } from "react";
import app from "../Firebase/Firebase.config";
import {GoogleAuthProvider, getAuth, createUserWithEmailAndPassword, onAuthStateChanged, signInWithPopup ,signInWithEmailAndPassword} from "firebase/auth";
import {  signOut } from "firebase/auth";


export const AuthContext = createContext();
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  }
  
  const loginwithGoogle=()=>{
    setLoading(true);
    return signInWithPopup(auth, googleProvider)
  }
const login= (email, password)=>{
  setLoading(true);
  return signInWithEmailAndPassword(auth, email, password);
}
   
const logOut=()=>{
return signOut(auth);
}
  useEffect(()=>{
    const unsubsribe=onAuthStateChanged(auth, currentUser=>{
      console.log(currentUser)
      setUser(currentUser)
      setLoading(false)
    })
    return ()=>{
      return unsubsribe();
    }
  })

  const authInfo = {
    user,
    createUser,
    loginwithGoogle,
    loading,
    login,
    logOut
  };

  return (
    <AuthContext.Provider value={authInfo}> {/* Make sure to provide the value prop */}
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
