import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { auth } from "@/firebase/firebaseConfig";

export default function TwoFASetup() {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const BACKEND_URL = "http://localhost:5000";

  // 🧠 Step 1: Fetch QR code and secret from backend
  useEffect(() => {
    const fetchQRCode = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          toast.error("Session expired. Please log in again.");
          navigate("/");
          return;
        }

        const idToken = await user.getIdToken();
        const res = await fetch(`${BACKEND_URL}/api/2fa/generate`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${idToken}`,
            "Content-Type": "application/json",
          },
        });

        const data = await res.json();
        if (res.ok) {
          setQrCode(data.qr);
          toast.success("Scan the QR code with Google Authenticator.");
        } else {
          toast.error(data.message || "Failed to generate QR code.");
        }
      } catch (err: any) {
        console.error("QR Fetch Error:", err);
        toast.error(err.message || "Failed to load 2FA setup.");
      }
    };

    fetchQRCode();
  }, []);

  // 🧩 Step 2: Verify the 6-digit code entered by user
  const handleVerify = async () => {
    if (!token.trim()) {
      toast.error("Enter your 6-digit authentication code.");
      return;
    }

    setLoading(true);
    try {
      const user = auth.currentUser;
      const idToken = await user?.getIdToken();

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
        toast.success("2FA setup complete ✅");
        navigate("/dashboard");
      } else {
        toast.error(data.message || "Invalid code, please try again.");
      }
    } catch (err: any) {
      toast.error(err.message || "Verification failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-primary">Set Up 2FA</CardTitle>
          <CardDescription>Secure your account with Google Authenticator</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 text-center">
          {qrCode ? (
            <div className="flex flex-col items-center">
              <img src={qrCode} alt="2FA QR Code" className="w-48 h-48 mb-4" />
              <p className="text-sm text-muted-foreground">
                Scan this QR code with your Authenticator app.
              </p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Generating QR code...</p>
          )}

          <div className="space-y-2">
            <Input
              placeholder="Enter 6-digit code"
              maxLength={6}
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="text-center text-lg tracking-widest"
            />
            <Button onClick={handleVerify} className="w-full" disabled={loading}>
              {loading ? "Verifying..." : "Verify & Enable 2FA"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
