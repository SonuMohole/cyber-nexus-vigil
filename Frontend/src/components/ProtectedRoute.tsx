// src/components/ProtectedRoute.tsx

import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface ProtectedRouteProps {
  children: JSX.Element;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  // 🕒 While Firebase is checking the user
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground text-lg animate-pulse">
          Checking authentication...
        </p>
      </div>
    );
  }

  // 🚫 If not logged in — redirect to login page
  if (!user) {
    console.warn("🚫 No authenticated user, redirecting to login");
    return <Navigate to="/" replace />;
  }

  // ✅ If logged in — allow access
  console.log("✅ Authenticated user:", user.email);
  return children;
}
