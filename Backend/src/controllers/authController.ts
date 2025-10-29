import { Request, Response } from "express";
import { pool } from "../config/db";

export const verifyUser = async (req: Request, res: Response) => {
  console.log("\n===========================");
  console.log("🔐 VERIFY USER FLOW STARTED");
  console.log("===========================");

  try {
    // ✅ 1. Check if Firebase middleware attached user info
    const user = (req as any).user;
    console.log("🔥 [STEP 1] Firebase Decoded Token:");
    console.log(user);

    if (!user || !user.uid) {
      console.log("❌ [ERROR] Missing Firebase user data from token.");
      return res.status(401).json({ message: "Unauthorized" });
    }

    const firebaseUid = user.uid;
    console.log("🧩 [STEP 2] Firebase UID Received:", firebaseUid);

    // ✅ 2. Check if user exists in the PostgreSQL database
    console.log("📡 [STEP 3] Querying PostgreSQL for user...");
    const result = await pool.query(
      "SELECT email, role, status, full_name FROM admin_users WHERE firebase_uid = $1",
      [firebaseUid]
    );

    console.log("🧾 [STEP 4] Database Query Result:");
    console.table(result.rows);

    // ✅ 3. If no user found
    if (result.rowCount === 0) {
      console.log("🚫 [RESULT] User not found in database.");
      return res.status(403).json({ message: "User not found in database" });
    }

    const adminData = result.rows[0];

    console.log("👤 [STEP 5] Admin Data Fetched:");
    console.log(adminData);

    // ✅ 4. Check if account is active
    if (adminData.status !== "active") {
      console.log("⚠️ [STATUS] Account is not active:", adminData.status);
      return res.status(403).json({ message: "Account suspended" });
    }

    // ✅ 5. Check role-based access
    console.log("🎭 [STEP 6] Checking Role:", adminData.role);

    if (adminData.role === "super_admin") {
      console.log("✅ [RESULT] Super Admin verified successfully!");
      return res.status(200).json({
        status: "success",
        message: "Super Admin verified ✅",
        user: adminData,
      });
    }

    console.log("🚫 [RESULT] Access restricted. Role:", adminData.role);
    return res.status(403).json({
      message: "Access restricted. Only super_admin allowed at this stage.",
    });
  } catch (error: any) {
    console.error("💥 [SERVER ERROR]", error.message);
    res.status(500).json({ message: "Server error during verification" });
  }

  console.log("===========================");
  console.log("🔚 VERIFY USER FLOW ENDED");
  console.log("===========================\n");
};
