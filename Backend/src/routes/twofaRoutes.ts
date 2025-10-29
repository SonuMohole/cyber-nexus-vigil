// 📁 D:\QCT All\ui_Qstellar\QstellarGL\cyber-nexus-vigil\Backend\src\routes\twofaRoutes.ts

import express from "express";
import { verifyFirebaseToken } from "../middleware/verifyFirebaseToken";
import { generate2FA, verify2FA } from "../controllers/twofaController";

const router = express.Router();

/**
 * 🔐 Generate 2FA QR code (requires valid Firebase token)
 */
router.post("/generate", verifyFirebaseToken, generate2FA);

/**
 * ✅ Verify 2FA code after scanning QR
 */
router.post("/verify", verifyFirebaseToken, verify2FA);

export default router;
