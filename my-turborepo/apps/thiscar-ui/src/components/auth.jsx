"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { clientAuth } from "../services/firebase";

const AuthContext = createContext({ user: null });

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    return onAuthStateChanged(clientAuth, async (user) => {
      if (!user) {
        setUser(null);
        return;
      }

      setUser(user);
    });
  }, []);

  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
}
/**
 * @returns {import("firebase/auth").User | null}
 */
export const useAuth = () => useContext(AuthContext);
