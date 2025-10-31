import { Request, Response } from "express";
import admin from "../config/firebase";
import speakeasy from "speakeasy";
import QRCode from "qrcode";
import { encrypt, decrypt } from "../utils/encryption";

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

    // 🔐 Generate new 2FA secret
    const secret = speakeasy.generateSecret({
      name: "QStellar Security Admin",
      length: 20,
    });

    // 🔒 Encrypt before storing
    const encryptedSecret = encrypt(secret.base32);

    // ✅ Update Firestore with encrypted secret
    await userRef.update({
      twofa_secret: encryptedSecret,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // 🧠 TypeScript fix: ensure otpauth_url is always a string
    const otpUrl = secret.otpauth_url ?? "";

    // 🖼 Generate base64 QR code image for frontend display
    const qrCodeDataURL = await QRCode.toDataURL(otpUrl as string);

    return res.json({
      success: true,
      message: "Scan QR code to set up 2FA",
      qr: qrCodeDataURL,
      secret: secret.base32, // ⚠️ Sent once only for setup
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
    const encryptedSecret = data?.twofa_secret;
    const alreadyEnabled = data?.twofa_enabled;

    if (!encryptedSecret) {
      return res.status(400).json({ message: "2FA secret not found" });
    }

    // 🔓 Decrypt the stored secret securely
    const secret = decrypt(encryptedSecret);

    // 🔍 Verify TOTP
    const verified = speakeasy.totp.verify({
      secret,
      encoding: "base32",
      token,
      window: 1,
    });

    if (!verified) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired 2FA code",
      });
    }

    // ✅ If this is the first-time setup, mark as enabled
    if (!alreadyEnabled) {
      await userRef.update({
        twofa_enabled: true,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      console.log(`✅ 2FA setup completed for UID: ${firebaseUid}`);
      return res.json({ success: true, message: "2FA setup complete ✅" });
    }

    // 🧩 Otherwise, verification succeeded during login
    console.log(`🔑 2FA verified successfully for UID: ${firebaseUid}`);
    return res.json({ success: true, message: "2FA verified successfully ✅" });
  } catch (error: any) {
    console.error("💥 [2FA Verification Error]", error.message);
    res.status(500).json({ message: "Server error during 2FA verification" });
  }
};
