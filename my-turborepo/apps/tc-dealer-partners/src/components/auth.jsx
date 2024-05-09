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
                await fetch(`/api/auth`, { method: "DELETE" });
                return;
            }

            const token = await user.getIdToken();
            await fetch(`/api/auth`, { method: "POST", body: JSON.stringify({ token }) });
            setUser(user);
        });
    }, []);
    return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
}
/**
 * @returns {import("firebase/auth").User | null}
 */
export const useAuth = () => useContext(AuthContext);
