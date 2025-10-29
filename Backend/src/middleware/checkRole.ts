import { Request, Response, NextFunction } from "express";
import { pool } from "../config/db.js";

export const checkRole = (roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const uid = (req as any).user.uid;
      const result = await pool.query("SELECT role FROM admin_users WHERE firebase_uid = $1", [uid]);

      if (result.rows.length === 0)
        return res.status(403).json({ message: "User not found" });

      const userRole = result.rows[0].role;
      if (!roles.includes(userRole))
        return res.status(403).json({ message: "Access denied" });

      next();
    } catch (error) {
      console.error("❌ Role check failed:", error);
      res.status(500).json({ message: "Server error" });
    }
  };
};
