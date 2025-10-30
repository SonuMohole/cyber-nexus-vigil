import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Info, CheckCircle2, AlertTriangle } from "lucide-react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase/firebaseConfig";

declare global {
  interface Window {
    grecaptcha: any;
  }
}

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: "info" | "error" | "success"; text: string } | null>(null);
  const navigate = useNavigate();

  const RECAPTCHA_SITE_KEY = "6LeLy_orAAAAAM15A0G5RFcCsZDBY9-vZyYPEsya";
  const BACKEND_URL = "http://localhost:5000";

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
  }, []);

  // Auto-clear transient messages (like info/success)
  useEffect(() => {
    if (status && (status.type === "info" || status.type === "success")) {
      const timer = setTimeout(() => setStatus(null), 2500);
      return () => clearTimeout(timer);
    }
  }, [status]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setStatus({ type: "error", text: "Please enter both email and password." });
      return;
    }

    setLoading(true);
    setStatus(null); // clear previous message while verifying

    try {
      // Step 1: Verify reCAPTCHA
      if (!window.grecaptcha) throw new Error("reCAPTCHA not ready.");
      const recaptchaToken = await window.grecaptcha.execute(RECAPTCHA_SITE_KEY, { action: "login" });

      const captchaRes = await fetch(`${BACKEND_URL}/api/auth/verify-captcha`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: recaptchaToken }),
      });

      const captchaData = await captchaRes.json();
      if (!captchaData.success) {
        setStatus({ type: "error", text: "Security validation failed. Please retry." });
        setLoading(false);
        return;
      }

      // Step 2: Firebase login
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const idToken = await user.getIdToken();

      // Step 3: Backend verification
      const res = await fetch(`${BACKEND_URL}/api/auth/verify-user`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${idToken}`,
          "X-Login-Intent": "true",
        },
      });

      const data = await res.json();
      if (!res.ok) {
        setStatus({ type: "error", text: data.message || "Access denied. Contact administrator." });
        setLoading(false);
        return;
      }

      const role = data.user?.role;
      const is2FAEnabled = data.user?.twofa_enabled;

      // Step 4: Handle 2FA redirection
      if (role === "super_admin") {
        if (is2FAEnabled === false) {
          setStatus({ type: "info", text: "Two-factor setup required. Redirecting..." });
          setTimeout(() => navigate("/2fa-setup"), 1200);
        } else if (is2FAEnabled === true) {
          setStatus({ type: "success", text: "Authentication successful. Redirecting to verification..." });
          setTimeout(() => navigate("/2fa-verify"), 1200);
        } else {
          setStatus({ type: "error", text: "Unexpected 2FA state. Please try again." });
        }
      } else {
        setStatus({ type: "error", text: "Access restricted to Super Admins only." });
      }
    } catch (err: any) {
      console.error("Login Error:", err);
      setStatus({
        type: "error",
        text: "Unable to sign in. Please verify your credentials and network connection.",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderStatusMessage = () => {
    if (!status) return null;

    // ⛔️ Hide info messages while loading (we already show “Verifying...” on button)
    if (loading && status.type === "info") return null;

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
