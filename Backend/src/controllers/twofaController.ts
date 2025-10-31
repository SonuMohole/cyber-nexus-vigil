// 📁 Backend/src/controllers/twofaController.ts
import { Request, Response } from "express";
import admin from "../config/firebase";
import speakeasy from "speakeasy";
import QRCode from "qrcode";

/**
 * ✅ Step 1: Generate 2FA secret and QR code
 */
export const generate2FA = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const firebaseUid = user.uid;
    const db = admin.firestore();
    const userRef = db.collection("users").doc(firebaseUid);
    const snapshot = await userRef.get();

    if (!snapshot.exists) {
      return res.status(404).json({ message: "User not found" });
    }

    const userData = snapshot.data();
    if (userData?.twofa_enabled) {
      return res.status(400).json({ message: "2FA already enabled" });
    }

    // Generate secret
    const secret = speakeasy.generateSecret({
      name: "QStellar Security Admin",
      length: 20,
    });

    // Update Firestore
    await userRef.update({
      twofa_secret: secret.base32,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Generate QR Code (base64)
    const qrCodeDataURL = await QRCode.toDataURL(secret.otpauth_url);

    return res.json({
      success: true,
      message: "Scan QR code to set up 2FA",
      qr: qrCodeDataURL,
      secret: secret.base32,
    });
  } catch (error: any) {
    console.error("💥 [2FA Generation Error]", error.message);
    return res.status(500).json({ message: "Error generating 2FA" });
  }
};

/**
 * ✅ Step 2: Verify 2FA code entered by user
 */
export const verify2FA = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;
    const user = (req as any).user;
    const firebaseUid = user.uid;
    const db = admin.firestore();

    const userRef = db.collection("users").doc(firebaseUid);
    const snapshot = await userRef.get();

    if (!snapshot.exists) {
      return res.status(404).json({ message: "User not found" });
    }

    const data = snapshot.data();
    const secret = data?.twofa_secret;
    const alreadyEnabled = data?.twofa_enabled;

    if (!secret) {
      return res.status(400).json({ message: "2FA secret not found" });
    }

    const verified = speakeasy.totp.verify({
      secret,
      encoding: "base32",
      token,
      window: 1,
    });

    if (!verified) {
      return res.status(401).json({ success: false, message: "Invalid or expired 2FA code" });
    }

    if (!alreadyEnabled) {
      await userRef.update({
        twofa_enabled: true,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      console.log(`✅ 2FA setup completed for UID: ${firebaseUid}`);
      return res.json({ success: true, message: "2FA setup complete ✅" });
    }

    return res.json({ success: true, message: "2FA verified successfully ✅" });
  } catch (error: any) {
    console.error("💥 [2FA Verification Error]", error.message);
    res.status(500).json({ message: "Server error during 2FA verification" });
  }
};
