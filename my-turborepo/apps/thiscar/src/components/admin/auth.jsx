"use client";
import { useContext, createContext, useState, useEffect } from "react";
import {
  OAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  User,
} from "firebase/auth";
import { auth } from "@/services/firebase";
import { useRouter, usePathname, redirect } from "next/navigation";
import { error } from "console";

const AuthContext = createContext<User | null>(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState<User | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    return onAuthStateChanged(auth, (user) => {
      if (!user) {
        setUser(null);
      }
      setUser(user);
    });
  }, []);

  if (!user && pathname.includes("/dashboard")) {
    redirect("/");
  }

  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
}

const provider = new OAuthProvider("microsoft.com");
provider.setCustomParameters({
  login_hint: "jdoe@thiscar.com",
  tenant: "07b5d794-fcf9-4181-b426-7c055c7de0f8",
});
provider.addScope("user.read");

export const signInWithMicrosoft = () => signInWithPopup(auth, provider).then(res =>{
  console.log('res',res)
}).catch( (error)=>{
  console.log(error.message)
});
export const useAuth = () => useContext(AuthContext);