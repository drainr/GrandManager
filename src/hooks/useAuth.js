import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "../firebase/firebase.js";
import {
  loginWithGoogle,
  loginWithEmail,
  registerWithEmail,
  resetPasswordWithEmail,
} from "../firebase/auth.js";

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => loginWithEmail(email, password);
  const loginGoogle = async () => loginWithGoogle();
  const register = async (email, password) => registerWithEmail(email, password);
  const resetPassword = async (email) => resetPasswordWithEmail(email);

  return {
    user,
    loading,
    login,
    loginGoogle,
    register,
    resetPassword,
  };
};