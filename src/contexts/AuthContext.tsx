import React, { createContext, useContext, useEffect, useState } from "react";
import {
  signInAnonymously as firebaseSignInAnonymously,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { auth } from "../config/firebase";
import { AuthContextType } from "../types";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<{ uid: string; displayName: string } | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (firebaseUser: User | null) => {
        if (firebaseUser) {
          // Get display name from localStorage
          const displayName =
            localStorage.getItem("displayName") || "Anonymous";
          setUser({
            uid: firebaseUser.uid,
            displayName,
          });
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  const signInAnonymously = async (displayName: string) => {
    try {
      const result = await firebaseSignInAnonymously(auth);
      localStorage.setItem("displayName", displayName);
      setUser({
        uid: result.user.uid,
        displayName,
      });
    } catch (error) {
      console.error("Error signing in anonymously:", error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      localStorage.removeItem("displayName");
      setUser(null);
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    signInAnonymously,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
