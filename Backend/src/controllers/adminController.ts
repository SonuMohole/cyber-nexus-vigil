import { Request, Response } from "express";
import { pool } from "../config/db.js";

export const getAllAdmins = async (req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT * FROM admin_users ORDER BY id ASC");
    res.json(result.rows);
  } catch (error) {
    console.error("❌ Error fetching admins:", error);
    res.status(500).json({ message: "Server error" });
  }
};
