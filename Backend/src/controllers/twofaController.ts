// 📁 D:\QCT All\ui_Qstellar\QstellarGL\cyber-nexus-vigil\Backend\src\controllers\twofaController.ts

import { Request, Response } from "express";
import { pool } from "../config/db";
import speakeasy from "speakeasy";
import QRCode from "qrcode";

/**
 * ✅ Step 1: Generate 2FA secret and QR code
 */
export const generate2FA = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const firebaseUid = user.uid;

    // Check if already enabled
    const existing = await pool.query(
      "SELECT twofa_enabled FROM admin_users WHERE firebase_uid = $1",
      [firebaseUid]
    );

    if (existing.rows[0]?.twofa_enabled) {
      return res.status(400).json({ message: "2FA already enabled" });
    }

    // Generate secret
    const secret = speakeasy.generateSecret({
      name: "QStellar Security Admin",
      length: 20,
    });

    // Store secret temporarily in DB
    await pool.query(
      "UPDATE admin_users SET twofa_secret = $1 WHERE firebase_uid = $2",
      [secret.base32, firebaseUid]
    );

    // Generate QR code (Base64 image)
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

    const result = await pool.query(
      "SELECT twofa_secret, twofa_enabled FROM admin_users WHERE firebase_uid = $1",
      [firebaseUid]
    );

    const record = result.rows[0];
    const secret = record?.twofa_secret;
    const alreadyEnabled = record?.twofa_enabled;

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

    // ✅ If this is first-time setup, mark as enabled
    if (!alreadyEnabled) {
      await pool.query(
        "UPDATE admin_users SET twofa_enabled = true WHERE firebase_uid = $1",
        [firebaseUid]
      );
      console.log(`✅ 2FA setup completed for UID: ${firebaseUid}`);
      return res.json({ success: true, message: "2FA setup complete ✅" });
    }

    // ✅ If already enabled, just verify for login
    // console.log(`✅ 2FA verified for login UID: ${firebaseUid}`);
    return res.json({ success: true, message: "2FA verified successfully ✅" });
  } catch (error: any) {
    console.error("💥 [2FA Verification Error]", error.message);
    res.status(500).json({ message: "Server error during 2FA verification" });
  }
};

