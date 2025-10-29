import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function Setup2FA() {
  const [qr, setQr] = useState("");
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch QR code from backend
    fetch("http://localhost:5000/api/auth/generate-2fa", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("idToken")}`,
      },
    })
      .then(res => res.json())
      .then(data => setQr(data.qr))
      .catch(() => toast.error("Failed to generate QR code"));
  }, []);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/verify-2fa", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("idToken")}`,
        },
        body: JSON.stringify({ token }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success("2FA setup complete 🎉");
      } else {
        toast.error(data.message || "Invalid code");
      }
    } catch {
      toast.error("Failed to verify code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-6">
      <h2 className="text-2xl font-bold">Setup 2FA</h2>
      {qr ? <img src={qr} alt="QR Code" className="border rounded-lg p-2" /> : "Loading QR code..."}
      <form onSubmit={handleVerify} className="space-y-3">
        <Input
          type="text"
          placeholder="Enter 6-digit code"
          value={token}
          onChange={(e) => setToken(e.target.value)}
        />
        <Button type="submit" disabled={loading}>
          {loading ? "Verifying..." : "Verify & Activate"}
        </Button>
      </form>
    </div>
  );
}
