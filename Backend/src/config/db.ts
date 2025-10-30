// Backend\src\config\db.ts

import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;

interface DBConfig {
  user: string;
  password: string;
  host: string;
  port: number;
  database: string;
}

const config: DBConfig = {
  user: process.env.PGUSER ?? "",
  password: process.env.PGPASSWORD ?? "",
  host: process.env.PGHOST ?? "localhost",
  port: Number(process.env.PGPORT ?? 5432),
  database: process.env.PGDATABASE ?? "",
};

export const pool = new Pool(config);

(async () => {
  try {
    const client = await pool.connect();
    console.log(`✅ Connected to PostgreSQL DB: ${config.database}`);
    client.release();
  } catch (err: any) {
    console.error("❌ PostgreSQL Connection Error");
    console.error("Message:", err.message);
  }
})();
