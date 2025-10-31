

// 📁 D:\QCT All\ui_Qstellar\QstellarGL\cyber-nexus-vigil\Backend\src\routes\authRoutes.ts
import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import { verifyUser, updateLoginTime } from "../controllers/authController";
import { verifyFirebaseToken } from "../middleware/verifyFirebaseToken";

dotenv.config();
const router = express.Router();

router.post("/verify-captcha", async (req, res) => {
  const { token } = req.body;

  if (!token) return res.status(400).json({ success: false, message: "No CAPTCHA token provided" });

  try {
    const response = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`
    );

    const result = response.data;
    if (result.success && result.score >= 0.4) {
      return res.json({ success: true, score: result.score });
    } else {
      return res.status(403).json({ success: false, message: "Captcha verification failed" });
    }
  } catch {
    res.status(500).json({ success: false, message: "Server error verifying CAPTCHA" });
  }
});

router.get("/verify-user", verifyFirebaseToken, verifyUser);
router.post("/update-login-time", verifyFirebaseToken, updateLoginTime);

export default router;
