import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { auth } from "@/firebase/firebaseConfig";

export default function TwoFAVerify() {
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const BACKEND_URL = "http://localhost:5000";

  // 🧠 Redirect to login if user session is invalid
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      toast.error("Session expired. Please log in again.");
      navigate("/");
    }
  }, [navigate]);

  const handleVerify = async () => {
    if (!token.trim()) {
      toast.error("Please enter your 6-digit code.");
      return;
    }

    setLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) {
        toast.error("Session expired. Please log in again.");
        navigate("/");
        return;
      }

      const idToken = await user.getIdToken();

      const res = await fetch(`${BACKEND_URL}/api/2fa/verify`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${idToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("2FA verified successfully ✅");
        navigate("/dashboard");
      } else {
        toast.error(data.message || "Invalid 2FA code");
      }
    } catch (err: any) {
      toast.error(err.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-primary">Verify 2FA</CardTitle>
          <CardDescription>Enter the 6-digit code from your Authenticator app</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 text-center">
          <Input
            placeholder="123456"
            maxLength={6}
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="text-center text-lg tracking-widest"
          />
          <Button onClick={handleVerify} className="w-full" disabled={loading}>
            {loading ? "Verifying..." : "Verify & Continue"}
          </Button>

          {/* 🚪 Back to login button */}
          <div className="pt-4">
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
