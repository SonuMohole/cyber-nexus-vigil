

import express from "express";
import { verifyUser } from "../controllers/authController";
import { verifyFirebaseToken } from "../middleware/verifyFirebaseToken";

const router = express.Router();

router.get("/verify-user", verifyFirebaseToken, verifyUser);

export default router;
