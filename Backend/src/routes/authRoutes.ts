
// D:\QCT All\ui_Qstellar\QstellarGL\cyber-nexus-vigil\Backend\src\routes\authRoutes.ts
// import express from "express";
// import { verifyUser } from "../controllers/authController";
// import { verifyFirebaseToken } from "../middleware/verifyFirebaseToken";

// const router = express.Router();

// router.get("/verify-user", verifyFirebaseToken, verifyUser);

// export default router;


// 📁 D:\QCT All\ui_Qstellar\QstellarGL\cyber-nexus-vigil\Backend\src\routes\authRoutes.ts
import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import { verifyUser } from "../controllers/authController";
import { verifyFirebaseToken } from "../middleware/verifyFirebaseToken";

dotenv.config();
const router = express.Router();

/**
 * ✅ reCAPTCHA v3 Verification Route
 * This validates the frontend token with Google's API.
 */
router.post("/verify-captcha", async (req, res) => {
  console.log("\n===========================");
  console.log("🧠 CAPTCHA VERIFICATION FLOW STARTED");
  console.log("===========================");

  const { token } = req.body;

  if (!token) {
    console.log("❌ [ERROR] Missing CAPTCHA token from request.");
    return res.status(400).json({ success: false, message: "No CAPTCHA token provided" });
  }

  try {
    // ✅ Send token to Google for verification
    const response = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`
    );

    const result = response.data;
    console.log("🌐 [STEP] Google reCAPTCHA Response:", result);

    // ✅ Check response validity
    if (result.success) {
      const score = result.score ?? "N/A";
      const action = result.action ?? "unknown";
      console.log(`✅ CAPTCHA verified | Score: ${score} | Action: ${action}`);

      // Optional: Check low score threshold
      if (score < 0.4) {
        console.log("⚠️ Low reCAPTCHA score detected:", score);
        return res.status(403).json({
          success: false,
          message: "Low trust score, possible bot behavior",
          score,
        });
      }

      return res.json({
        success: true,
        score,
        action,
      });
    } else {
      console.log("🚫 CAPTCHA verification failed:", result["error-codes"]);
      return res.status(400).json({
        success: false,
        message: "Captcha failed",
        details: result,
      });
    }
  } catch (error: any) {
    console.error("💥 [SERVER ERROR] During CAPTCHA verification:", error.message);
    return res.status(500).json({ success: false, message: "Server error verifying CAPTCHA" });
  }
});

/**
 * 🔐 Verify Firebase user + PostgreSQL role check
 */
router.get("/verify-user", verifyFirebaseToken, verifyUser);

export default router;
