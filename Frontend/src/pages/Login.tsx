
// // Login.tsx

// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Shield } from "lucide-react";
// import { toast } from "sonner";
// import { signInWithEmailAndPassword } from "firebase/auth";
// import { auth } from "@/firebase/firebaseConfig";

// declare global {
//   interface Window {
//     grecaptcha: any;
//   }
// }

// export default function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   // 🧩 Ideally move these to .env.local later
//   const RECAPTCHA_SITE_KEY = "6LeLy_orAAAAAM15A0G5RFcCsZDBY9-vZyYPEsya";
//   const BACKEND_URL = "http://localhost:5000";

//   // ✅ Load reCAPTCHA v3 once
//   useEffect(() => {
//     const scriptId = "recaptcha-v3-script";
//     if (!document.getElementById(scriptId)) {
//       const script = document.createElement("script");
//       script.id = scriptId;
//       script.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`;
//       script.async = true;
//       script.defer = true;
//       document.body.appendChild(script);
//       script.onload = () => console.log("✅ reCAPTCHA v3 script loaded");
//       script.onerror = () => console.error("❌ Failed to load reCAPTCHA v3 script");
//     }
//   }, []);

//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!email || !password) {
//       toast.error("Please enter your credentials");
//       return;
//     }

//     setLoading(true);

//     try {
//       // 🧠 Step 1: Get reCAPTCHA token
//       if (!window.grecaptcha) throw new Error("reCAPTCHA not ready yet.");
//       const recaptchaToken = await window.grecaptcha.execute(RECAPTCHA_SITE_KEY, { action: "login" });
//       console.log("✅ reCAPTCHA token:", recaptchaToken.substring(0, 25) + "...");

//       // 🧠 Step 2: Verify reCAPTCHA token via backend
//       const captchaRes = await fetch(`${BACKEND_URL}/api/auth/verify-captcha`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ token: recaptchaToken }),
//       });

//       const captchaData = await captchaRes.json();
//       console.log("🧾 Backend CAPTCHA Response:", captchaData);

//       if (!captchaData.success) {
//         toast.error("Captcha verification failed ❌");
//         setLoading(false);
//         return;
//       }

//       // 🔐 Step 3: Sign in via Firebase
//       const userCredential = await signInWithEmailAndPassword(auth, email, password);
//       const user = userCredential.user;
//       const idToken = await user.getIdToken();

//       // 🧩 Step 4: Verify with backend and check 2FA status
//       const res = await fetch(`${BACKEND_URL}/api/auth/verify-user`, {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${idToken}`,
//           "X-Login-Intent": "true",
//         },
//       });

//       const data = await res.json();
//       console.log("✅ Backend Verify-User Response:", data);

//       if (!res.ok) {
//         toast.error(data.message || "Access denied");
//         return;
//       }

//       // 🧩 Step 5: Role & 2FA handling
//       const role = data.user?.role;
//       const is2FAEnabled = data.user?.twofa_enabled;

//       if (role === "super_admin") {
//         if (!is2FAEnabled) {
//           toast.info("Please complete 2FA setup to continue.");
//           navigate("/2fa-setup");
//         } else {
//           toast.success("Welcome Super Admin 🚀");
//           navigate("/dashboard");
//         }
//       } else {
//         toast.error("Access restricted to Super Admin only.");
//       }

//     } catch (err: any) {
//       console.error("💥 Login Error:", err);
//       toast.error(err.message || "Login failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
//       <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
//       <Card className="w-full max-w-md border-border/50 relative z-10 animate-fade-in">
//         <CardHeader className="text-center">
//           <div className="flex justify-center mb-4">
//             <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center">
//               <Shield className="h-8 w-8 text-primary-foreground" />
//             </div>
//           </div>
//           <CardTitle className="text-3xl font-bold text-gradient-cyber">QStellar</CardTitle>
//           <CardDescription>Secure Enterprise Login</CardDescription>
//         </CardHeader>

//         <CardContent>
//           <form onSubmit={handleLogin} className="space-y-4">
//             <div className="space-y-2">
//               <Label htmlFor="email">Email</Label>
//               <Input
//                 id="email"
//                 type="email"
//                 placeholder="admin@qstellar.com"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 className="bg-background/50"
//               />
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="password">Password</Label>
//               <Input
//                 id="password"
//                 type="password"
//                 placeholder="••••••••"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className="bg-background/50"
//               />
//             </div>

//             <Button type="submit" variant="cyber" className="w-full" disabled={loading}>
//               {loading ? "Verifying..." : "Sign In Securely"}
//             </Button>

//             <p className="text-xs text-center text-muted-foreground">
//               Protected by Google reCAPTCHA v3
//             </p>
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

// Login.tsx
// (unchanged imports)
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";
import { toast } from "sonner";
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter your credentials");
      return;
    }

    setLoading(true);
    try {
      // Step 1: reCAPTCHA
      if (!window.grecaptcha) throw new Error("reCAPTCHA not ready yet.");
      const recaptchaToken = await window.grecaptcha.execute(RECAPTCHA_SITE_KEY, { action: "login" });

      const captchaRes = await fetch(`${BACKEND_URL}/api/auth/verify-captcha`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: recaptchaToken }),
      });

      const captchaData = await captchaRes.json();
      if (!captchaData.success) {
        toast.error("Captcha verification failed ❌");
        return;
      }

      // Step 2: Firebase login
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const idToken = await user.getIdToken();

      // Step 3: Verify user with backend
      const res = await fetch(`${BACKEND_URL}/api/auth/verify-user`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${idToken}`,
          "X-Login-Intent": "true",
        },
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Access denied");
        return;
      }

      const role = data.user?.role;
      const is2FAEnabled = data.user?.twofa_enabled;

     if (role === "super_admin") {
  console.log("🧠 2FA status received from backend:", is2FAEnabled);
  if (is2FAEnabled === false) {
    toast.info("2FA setup required. Redirecting...");
    navigate("/2fa-setup");
  } else if (is2FAEnabled === true) {
    toast.info("2FA verification required. Redirecting...");
    navigate("/2fa-verify");
  } else {
    toast.warning("2FA status unknown. Redirecting to setup for safety.");
    navigate("/2fa-setup");
  }
}

    } catch (err: any) {
      toast.error(err.message || "Login failed");
      console.error("Login Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
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
              <Input id="email" type="email" placeholder="admin@qstellar.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>

            <Button type="submit" variant="cyber" className="w-full" disabled={loading}>
              {loading ? "Verifying..." : "Sign In Securely"}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              Protected by Google reCAPTCHA v3
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
