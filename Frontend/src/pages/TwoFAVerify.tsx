import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@/firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";
import { AlertCircle, Loader2 } from "lucide-react";

export default function TwoFAVerify() {
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shake, setShake] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();
   const BACKEND_URL = import.meta.env.VITE_BACKEND_URL as string;

  // 🧭 Redirect if session invalid
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      setError("Your session has ended. Please sign in again.");
      setTimeout(() => navigate("/"), 2000);
    }
  }, [navigate]);

  // Handle OTP input
  const handleChange = (value: string, index: number) => {
    if (/^[0-9]?$/.test(value)) {
      const updated = [...otp];
      updated[index] = value;
      setOtp(updated);
      setError(null);
      if (value && index < 5) inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const token = otp.join("");
    if (token.length < 6) {
      setError("Please enter your 6-digit verification code.");
      return;
    }

    setLoading(true);
    setShake(false);
    setError(null);

    try {
      const user = auth.currentUser;
      if (!user) {
        setError("Your session has ended. Redirecting...");
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
        // 🕓 Add slight delay for animation smoothness
        await new Promise((resolve) => setTimeout(resolve, 1200));
        navigate("/dashboard");
      } else {
        setError("The verification code is incorrect. Please try again.");
        setShake(true);
      }
    } catch {
      setError("Something went wrong. Please try again shortly.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />

      <Card className="w-full max-w-md border-border/50 relative z-10 animate-fade-in shadow-xl">
        <CardHeader className="text-center space-y-1">
          <CardTitle className="text-3xl font-bold text-gradient-cyber">
            Verify Access
          </CardTitle>
          <CardDescription>
            Enter the 6-digit code from your Authenticator app to confirm your identity.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 text-center">
          <div
            className={`border rounded-xl p-6 bg-background/50 border-border/40 shadow-sm transition-all ${
              shake ? "animate-shake" : ""
            }`}
          >
            <h3 className="text-sm font-medium text-muted-foreground mb-3 tracking-wide">
              Authenticator Code
            </h3>

            {/* OTP Fields */}
            <div className="flex justify-center space-x-3 mb-4">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(e.target.value, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  ref={(el) => (inputRefs.current[index] = el)}
                  className="w-12 h-12 text-center text-lg font-semibold border rounded-md 
                             focus:ring-2 focus:ring-primary focus:border-primary outline-none 
                             transition-all bg-white/95 shadow-sm"
                />
              ))}
            </div>

            {/* Professional Error */}
            {error && (
              <div
                className="flex items-center justify-center gap-2 mt-3 px-4 py-2 rounded-md 
                           text-sm text-red-700 bg-red-50 border border-red-200 shadow-sm 
                           transition-all animate-fade-in"
              >
                <AlertCircle className="h-4 w-4 text-red-600" />
                <span>{error}</span>
              </div>
            )}

            {/* Verify Button with smooth loader motion */}
            <Button
              onClick={handleVerify}
              className={`w-full mt-5 flex items-center justify-center gap-2 transition-all duration-500 ease-in-out ${
                loading
                  ? "bg-primary/80 cursor-not-allowed scale-[0.99] shadow-inner opacity-90"
                  : "hover:scale-[1.02] shadow-md"
              }`}
              variant="cyber"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="tracking-wide font-medium">Verifying...</span>
                </>
              ) : (
                "Verify & Continue"
              )}
            </Button>
          </div>

          {/* Back to login */}
          <Button
            variant="outline"
            onClick={() => navigate("/")}
            className="w-full text-sm font-medium mt-2"
          >
            ← Back to Login
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
