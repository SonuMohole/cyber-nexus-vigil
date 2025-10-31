import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Info, CheckCircle2, AlertTriangle } from "lucide-react";
import { signInWithEmailAndPassword, User } from "firebase/auth";
import { auth } from "@/firebase/firebaseConfig";

interface StatusMessage {
  type: "info" | "error" | "success";
  text: string;
}

declare global {
  interface Window {
    grecaptcha?: {
      execute: (key: string, opts: { action: string }) => Promise<string>;
    };
  }
}

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<StatusMessage | null>(null);
  const navigate = useNavigate();

  const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY as string;
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL as string;

  // 🧠 Load reCAPTCHA script once
  useEffect(() => {
    const scriptId = "recaptcha-v3-script";
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`;
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }
  }, [RECAPTCHA_SITE_KEY]);

  // ✨ Auto-clear transient messages
  useEffect(() => {
    if (status && (status.type === "info" || status.type === "success")) {
      const timer = setTimeout(() => setStatus(null), 2200);
      return () => clearTimeout(timer);
    }
  }, [status]);

  // 🔐 Handle Login Securely
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !password) {
      setStatus({ type: "error", text: "Please enter both email and password." });
      return;
    }

    setLoading(true);
    setStatus({ type: "info", text: "Verifying credentials..." });

    try {
      // Step 1️⃣: reCAPTCHA
      if (!window.grecaptcha) throw new Error("reCAPTCHA not initialized");
      const recaptchaToken = await window.grecaptcha.execute(RECAPTCHA_SITE_KEY, { action: "login" });

      const captchaRes = await fetch(`${BACKEND_URL}/api/auth/verify-captcha`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: recaptchaToken }),
      });

      const captchaData: { success: boolean } = await captchaRes.json();
      if (!captchaData.success) {
        setStatus({ type: "error", text: "Security validation failed. Please retry." });
        return;
      }

      // Step 2️⃣: Firebase login
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user: User = userCredential.user;
      const idToken = await user.getIdToken();

      // Step 3️⃣: Backend verification
      const verifyRes = await fetch(`${BACKEND_URL}/api/auth/verify-user`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${idToken}`,
          "X-Login-Intent": "true",
        },
      });

      const verifyData = await verifyRes.json();
      if (!verifyRes.ok) {
        setStatus({ type: "error", text: verifyData.message || "Access denied. Contact administrator." });
        return;
      }

      const { role, twofa_enabled } = verifyData.user || {};

      // Step 4️⃣: Update login timestamp (non-blocking)
      fetch(`${BACKEND_URL}/api/auth/update-login-time`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${idToken}`,
          "Content-Type": "application/json",
        },
      }).catch(() => console.warn("⚠️ Failed to update login timestamp"));

      // Step 5️⃣: Redirect flow
      if (role === "super_admin") {
        if (!twofa_enabled) {
          setStatus({ type: "info", text: "Two-factor setup required. Redirecting..." });
          setTimeout(() => navigate("/2fa-setup"), 1000);
        } else {
          setStatus({ type: "success", text: "Verified. Redirecting to 2FA..." });
          setTimeout(() => navigate("/2fa-verify"), 1000);
        }
      } else {
        setStatus({ type: "error", text: "Access restricted to Super Admins only." });
      }
    } catch (err) {
      console.error("💥 Login Error:", err);
      setStatus({
        type: "error",
        text: "Login failed. Check credentials or try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  // 🎨 Status message display
  const renderStatusMessage = () => {
    if (!status) return null;

    const icon =
      status.type === "error" ? (
        <AlertTriangle className="h-4 w-4 text-red-600" />
      ) : status.type === "success" ? (
        <CheckCircle2 className="h-4 w-4 text-green-600" />
      ) : (
        <Info className="h-4 w-4 text-blue-600" />
      );

    const classes =
      status.type === "error"
        ? "border-red-300 bg-red-50/80 text-red-700"
        : status.type === "success"
        ? "border-green-300 bg-green-50/80 text-green-700"
        : "border-blue-300 bg-blue-50/80 text-blue-700";

    return (
      <div
        className={`flex items-center justify-center gap-2 mt-3 px-4 py-2 text-sm font-medium rounded-md border ${classes} transition-all duration-300`}
      >
        {icon}
        <span>{status.text}</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
      <Card className="w-full max-w-md border-border/50 relative z-10 shadow-xl animate-fade-in backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center shadow-md">
              <Shield className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-gradient-cyber tracking-tight">QStellar</CardTitle>
          <CardDescription className="text-muted-foreground text-sm mt-1">
            Secure Enterprise Access
          </CardDescription>
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
                className="bg-background/50 focus:ring-2 focus:ring-primary/30 transition-all"
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
                className="bg-background/50 focus:ring-2 focus:ring-primary/30 transition-all"
              />
            </div>
            <Button type="submit" variant="cyber" className="w-full mt-2" disabled={loading}>
              {loading ? "Verifying..." : "Sign In Securely"}
            </Button>
            {renderStatusMessage()}
            <p className="text-xs text-center text-muted-foreground pt-2">
              Protected by Google reCAPTCHA v3
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
