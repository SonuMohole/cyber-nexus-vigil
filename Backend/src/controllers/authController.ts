// 📁 Backend/src/controllers/authController.ts
import { Request, Response } from "express";
import { pool } from "../config/db";

/**
 * 🔐 Verify Firebase User + PostgreSQL Role + 2FA Status
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

    const firebaseUid = user.uid;

    const result = await pool.query(
      `SELECT email, role, status, full_name, twofa_enabled 
       FROM admin_users 
       WHERE firebase_uid = $1`,
      [firebaseUid]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "User not found in database" });
    }

    const adminData = result.rows[0];
    const twofaEnabled = Boolean(adminData.twofa_enabled);

    if (adminData.status !== "active") {
      return res.status(403).json({ message: "Account suspended" });
    }

    if (adminData.role !== "super_admin") {
      return res.status(403).json({ message: "Access restricted to super_admin only" });
    }

    // ✅ Success Log (no sensitive info)
    console.log("✅ Super Admin verified successfully!");

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
    return res.status(500).json({ message: "Internal server error" });
  }
};
