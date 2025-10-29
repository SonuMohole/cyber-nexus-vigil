import express from "express";
import { getAllAdmins } from "../controllers/adminController.js";
import { verifyFirebaseToken } from "../middleware/verifyFirebaseToken.js";
import { checkRole } from "../middleware/checkRole.js";

const router = express.Router();

router.get("/all", verifyFirebaseToken, checkRole(["super_admin"]), getAllAdmins);

export default router;
