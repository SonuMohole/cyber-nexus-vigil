import { Request, Response } from "express";
import { pool } from "../config/db";

export const verifyUser = async (req: Request, res: Response) => {
  const isManualLogin = req.headers["x-login-intent"] === "true";

  // 🚫 Reject auto-verifications before manual login
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
    // ✅ 1. Check if Firebase middleware attached user info
    const user = (req as any).user;
    if (!user || !user.uid) {
      console.log("❌ [ERROR] Missing Firebase user data.");
      return res.status(401).json({ message: "Unauthorized" });
    }

    const firebaseUid = user.uid;
    console.log("🧩 Firebase UID:", firebaseUid);

    // ✅ 2. Query PostgreSQL for user
    const result = await pool.query(
      "SELECT email, role, status, full_name FROM admin_users WHERE firebase_uid = $1",
      [firebaseUid]
    );

    if (result.rowCount === 0) {
      console.log("🚫 User not found in database.");
      return res.status(404).json({ message: "User not found in database" });
    }

    const adminData = result.rows[0];

    // ✅ 3. Check account status
    if (adminData.status !== "active") {
      console.log("⚠️ Account not active:", adminData.status);
      return res.status(403).json({ message: "Account suspended" });
    }

    // ✅ 4. Check role
    console.log("🎭 Checking Role:", adminData.role);

    if (adminData.role === "super_admin") {
      console.log("✅ Super Admin verified successfully!");
      return res.status(200).json({
        status: "success",
        message: "Super Admin verified ✅",
        user: adminData,
      });
    }

    console.log("🚫 Access restricted. Role:", adminData.role);
    return res.status(403).json({ message: "Access restricted to super_admin only" });
  } catch (error: any) {
    console.error("💥 [SERVER ERROR]", error.message);
    return res.status(500).json({ message: "Internal server error" });
  } finally {
    console.log("===========================");
    console.log("🔚 VERIFY USER FLOW ENDED");
    console.log("===========================\n");
  }
};
