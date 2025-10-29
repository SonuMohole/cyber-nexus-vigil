import { Request, Response, NextFunction } from "express";
import admin from "../config/firebase";


export const verifyFirebaseToken = async (req: Request, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = header.split("Bearer ")[1];

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    (req as any).user = decoded;
    next();
  } catch (error) {
    console.error("Firebase token verification failed:", error);
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};
