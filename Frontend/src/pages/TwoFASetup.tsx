import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { auth } from "@/firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";
import {
  Loader2,
  ShieldCheck,
  QrCode,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

export default function TwoFASetup() {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const BACKEND_URL = "http://localhost:5000";

  // 🧭 Auto-clear error after 3 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // 🧠 Fetch QR Code
  useEffect(() => {
    const fetchQRCode = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          setError("Session expired. Please log in again.");
          setTimeout(() => navigate("/"), 2000);
          return;
        }

        const idToken = await user.getIdToken();
        const res = await fetch(`${BACKEND_URL}/api/2fa/generate`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${idToken}`,
            "Content-Type": "application/json",
          },
        });

        const data = await res.json();
        if (res.ok && data.qr) {
          setQrCode(data.qr);
        } else {
          setError(data.message || "Failed to generate QR code.");
        }
      } catch {
        setError("Unable to load setup. Please refresh and try again.");
      }
    };

    fetchQRCode();
  }, [navigate]);

  // 🔐 Handle Verify
  const handleVerify = async () => {
    if (!token.trim()) {
      setError("Please enter your 6-digit verification code.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const user = auth.currentUser;
      if (!user) {
        setError("Session expired. Redirecting...");
        setTimeout(() => navigate("/"), 1500);
        return;
      }

      const idToken = await user.getIdToken();
      const res = await fetch(`${BACKEND_URL}/api/2fa/verify`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${idToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      const data = await res.json();

      if (res.ok) {
        // ✅ Success animation before redirect
        setSuccess(true);
        setLoading(false);
        setTimeout(() => navigate("/dashboard"), 1200);
      } else {
        setError(data.message || "Invalid or expired 2FA code.");
      }
    } catch {
      setError("Verification failed. Please try again shortly.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />

      <Card className="w-full max-w-md border-border/50 relative z-10 animate-fade-in shadow-xl">
        <CardHeader className="text-center space-y-1">
          <div className="flex justify-center mb-3">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center shadow-sm">
              <ShieldCheck className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-gradient-cyber">
            Set Up Two-Factor Authentication
          </CardTitle>
          <CardDescription className="text-muted-foreground text-sm mt-1 mb-1">
            Use <span className="font-medium text-foreground">Microsoft Authenticator</span> or{" "}
            <span className="font-medium text-foreground">Google Authenticator</span> to secure your account.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 text-center">
          {/* QR Code Section */}
          <div className="border rounded-xl p-6 bg-background/50 border-border/40 shadow-sm">
            {qrCode ? (
              <div className="flex flex-col items-center">
                <img
                  src={qrCode}
                  alt="2FA QR Code"
                  className="w-44 h-44 mb-4 rounded-md border border-border/30 shadow-sm transition-all"
                />
                <p className="text-xs text-muted-foreground flex items-center gap-1 justify-center">
                  <QrCode className="h-4 w-4 text-muted-foreground" />
                  Scan this QR code and enter the 6-digit code below.
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">Generating QR Code...</p>
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div
              className="flex items-center justify-center gap-2 mt-2 px-4 py-2 rounded-md 
                         text-sm text-red-700 bg-red-50 border border-red-200 shadow-sm 
                         transition-all animate-fade-in"
            >
              <AlertCircle className="h-4 w-4 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Input + Verify Button */}
          <div className="space-y-3">
            <Input
              placeholder="Enter 6-digit code"
              maxLength={6}
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="text-center text-lg tracking-widest font-semibold bg-white/95"
            />

            {/* ✅ Button with animation states */}
            <Button
              onClick={handleVerify}
              className={`w-full flex items-center justify-center gap-2 transition-all duration-300 font-medium ${
                success
                  ? "bg-green-600 hover:bg-green-600 text-white scale-105 shadow-md"
                  : loading
                  ? "bg-primary/80 cursor-not-allowed scale-[0.99] shadow-inner"
                  : ""
              }`}
              variant="cyber"
              disabled={loading || success}
            >
              {success ? (
                <>
                  <CheckCircle2 className="h-5 w-5 animate-appear" />
                  <span>Success!</span>
                </>
              ) : loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                "Verify & Enable 2FA"
              )}
            </Button>
          </div>

          {/* Back to Login */}
          <div className="pt-2">
            <Button
              variant="outline"
              onClick={() => navigate("/")}
              className="w-full text-sm font-medium"
            >
              ← Back to Login
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
