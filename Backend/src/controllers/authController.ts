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

  console.log("\n===========================");
  console.log("🔐 VERIFY USER FLOW STARTED (Manual Login)");
  console.log("===========================");

  try {
    const user = (req as any).user;
    if (!user || !user.uid) {
      console.log("❌ [ERROR] Missing Firebase user data.");
      return res.status(401).json({ message: "Unauthorized" });
    }

    const firebaseUid = user.uid;
    console.log("🧩 Firebase UID:", firebaseUid);

    // ✅ Fetch admin info including 2FA fields
    const result = await pool.query(
      `SELECT email, role, status, full_name, twofa_enabled 
       FROM admin_users 
       WHERE firebase_uid = $1`,
      [firebaseUid]
    );

    if (result.rowCount === 0) {
      console.log("🚫 User not found in database.");
      return res.status(404).json({ message: "User not found in database" });
    }

    const adminData = result.rows[0];

    // Convert value to boolean in case it's text or null
    const twofaEnabled = Boolean(adminData.twofa_enabled);

    console.log(`🧠 DB -> twofa_enabled: ${adminData.twofa_enabled} (interpreted as ${twofaEnabled})`);

    // ✅ Check account status
    if (adminData.status !== "active") {
      return res.status(403).json({ message: "Account suspended" });
    }

    // ✅ Role validation
    if (adminData.role !== "super_admin") {
      return res.status(403).json({ message: "Access restricted to super_admin only" });
    }

    console.log("✅ Super Admin verified successfully!");
    console.log("📡 Returning response with 2FA state:", twofaEnabled);

    return res.status(200).json({
      status: "success",
      message: "Super Admin verified ✅",
      user: {
        email: adminData.email,
        full_name: adminData.full_name,
        role: adminData.role,
        twofa_enabled: twofaEnabled, // <— Ensured boolean
      },
    });
  } catch (error: any) {
    console.error("💥 [SERVER ERROR]", error.message);
    return res.status(500).json({ message: "Internal server error" });
  } finally {
    console.log("===========================");
    console.log("🔚 VERIFY USER FLOW ENDED");
    console.log("===========================\n");
  }
};
