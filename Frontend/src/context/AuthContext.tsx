// src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  User,
  signOut,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { auth } from "@/firebase/firebaseConfig";

// 🧩 Define the TypeScript interface for context values
interface AuthContextType {
  user: User | null;
  loading: boolean;
  role: string | null; // 👑 Add backend role (super_admin, admin, etc.)
  verifyUserRole: () => Promise<void>; // Method to verify role
  logout: () => Promise<void>;
}

// 🧠 Create the context with default empty values
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  role: null,
  verifyUserRole: async () => {},
  logout: async () => {},
});

// 🧱 AuthProvider wraps your entire app (see App.tsx)
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<string | null>(localStorage.getItem("role"));

  // 🔐 Persist session even after refresh
  useEffect(() => {
    setPersistence(auth, browserLocalPersistence)
      .then(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
          setUser(firebaseUser);
          setLoading(false);
          if (firebaseUser) {
            verifyUserRole(); // 🔄 Fetch role on login
          }
        });
        return unsubscribe;
      })
      .catch((error) => {
        console.error("Firebase persistence setup failed:", error);
        setLoading(false);
      });
  }, []);

  // 🧠 Verify role with backend (via token)
  const verifyUserRole = async () => {
    if (!auth.currentUser) return;
    try {
      const idToken = await auth.currentUser.getIdToken();
      const res = await fetch("http://localhost:5000/api/auth/verify-user", {
        method: "GET",
        headers: { Authorization: `Bearer ${idToken}` },
      });

      const data = await res.json();
      if (data.user?.role) {
        console.log("✅ Backend verified role:", data.user.role);
        setRole(data.user.role);
        localStorage.setItem("role", data.user.role);
      } else {
        console.warn("⚠️ No role returned from backend.");
      }
    } catch (error) {
      console.error("❌ Role verification failed:", error);
    }
  };

  // 🚪 Logout function
  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setRole(null);
      localStorage.removeItem("role");
      console.log("User logged out successfully");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, role, verifyUserRole, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 🧩 Custom hook for easy access to auth values
export const useAuth = () => useContext(AuthContext);
