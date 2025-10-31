// 📁 Backend/src/controllers/authController.ts
import { Request, Response } from "express";
import admin from "../config/firebase";

/**
 * 🔐 Verify Firebase User + Firestore Role + 2FA Status
 */
export const verifyUser = async (req: Request, res: Response) => {
  const isManualLogin = req.headers["x-login-intent"] === "true";

  if (!isManualLogin) {
    return res.status(403).json({
      status: "error",
      message: "Access denied: direct verification not allowed before login",
    });
  }

  try {
    const user = (req as any).user;
    if (!user || !user.uid) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const db = admin.firestore();
    const userDoc = await db.collection("users").doc(user.uid).get();

    if (!userDoc.exists) {
      return res.status(404).json({ message: "User not found in Firestore" });
    }

    const adminData = userDoc.data();
    const twofaEnabled = !!adminData?.twofa_enabled;

    if (adminData?.status !== "active") {
      return res.status(403).json({ message: "Account suspended" });
    }

    if (adminData?.role !== "super_admin") {
      return res.status(403).json({ message: "Access restricted to super_admin only" });
    }

    console.log(`✅ Super Admin verified successfully for UID: ${user.uid}`);

    return res.status(200).json({
      status: "success",
      message: "Super Admin verified ✅",
      user: {
        email: adminData.email,
        full_name: adminData.full_name,
        role: adminData.role,
        twofa_enabled: twofaEnabled,
      },
    });
  } catch (error: any) {
    console.error("🔥 Firestore verifyUser error:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * 🕒 Update last login timestamp securely
 */
export const updateLoginTime = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const db = admin.firestore();
    const userRef = db.collection("users").doc(user.uid);

    await userRef.update({
      last_login: admin.firestore.FieldValue.serverTimestamp(),
    });

    console.log(`🕒 Updated last_login for UID: ${user.uid}`);
    return res.json({ success: true, message: "Login timestamp updated" });
  } catch (error: any) {
    console.error("🔥 Error updating login timestamp:", error.message);
    return res.status(500).json({ message: "Error updating login timestamp" });
  }
};
