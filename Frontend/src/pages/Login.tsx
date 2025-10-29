import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Lock } from "lucide-react";
import { toast } from "sonner";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase/firebaseConfig";  // ✅ Firebase instance

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [captchaChecked, setCaptchaChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!captchaChecked) {
      toast.error("Please verify you're not a robot");
      return;
    }

    if (!email || !password) {
      toast.error("Please enter your credentials");
      return;
    }

    try {
      setLoading(true);

      // 1️⃣ Firebase authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2️⃣ Get Firebase ID token (the correct one)
      const idToken = await user.getIdToken();

      // 3️⃣ Send token to backend for verification + role check
      const res = await fetch("http://localhost:5000/api/auth/verify-user", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${idToken}`,
        },
      });

      if (!res.ok) {
        throw new Error("Verification failed with backend");
      }


      // 4️⃣ Check user role (e.g., only super_admin allowed)
     const data = await res.json();
console.log("✅ Backend Response:", data); // <-- Add this line for debugging

// ✅ Fix: check the nested user.role
if (data.user?.role === "super_admin") {
  toast.success("Welcome Super Admin 🚀");
  navigate("/dashboard");
} else {
  toast.error("Access denied: insufficient privileges");
}

    } catch (error: any) {
      console.error("Login Error:", error);
      toast.error(error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
      <Card className="w-full max-w-md border-border/50 relative z-10 animate-fade-in">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center">
              <Shield className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-gradient-cyber">QStellar</CardTitle>
          <CardDescription>Secure Enterprise Login</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@qstellar.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-background/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-background/50"
              />
            </div>

            {/* CAPTCHA placeholder */}
            <div className="flex items-center gap-3 p-4 rounded-lg border border-border/50 bg-background/30">
              <input
                type="checkbox"
                id="captcha"
                checked={captchaChecked}
                onChange={(e) => setCaptchaChecked(e.target.checked)}
                className="h-5 w-5 rounded border-border"
              />
              <label htmlFor="captcha" className="text-sm flex items-center gap-2">
                <Lock className="h-4 w-4 text-muted-foreground" />
                I'm not a robot
              </label>
            </div>

            <Button type="submit" variant="cyber" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign In Securely"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
