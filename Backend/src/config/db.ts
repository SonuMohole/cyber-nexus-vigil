// import pkg from "pg";
// import dotenv from "dotenv";

// dotenv.config();

// const { Pool } = pkg;

// export const pool = new Pool({
//   user: process.env.PGUSER,
//   password: process.env.PGPASSWORD,
//   host: process.env.PGHOST,
//   port: Number(process.env.PGPORT),
//   database: process.env.PGDATABASE,
// });

// pool
//   .connect()
//   .then(() => console.log(`✅ Connected to PostgreSQL DB: ${process.env.PGDATABASE}`))
//   .catch((err) => {
//     console.error("❌ PostgreSQL Connection Error");
//     console.error("Host:", process.env.PGHOST);
//     console.error("User:", process.env.PGUSER);
//     console.error("DB:", process.env.PGDATABASE);
//     console.error("Error Message:", err.message);
//     console.error("Full Error:", err);
//   });

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
  user: process.env.PGUSER ?? "postgres",
  password: process.env.PGPASSWORD ?? "",
  host: process.env.PGHOST ?? "localhost",
  port: Number(process.env.PGPORT ?? 5432),
  database: process.env.PGDATABASE ?? "qstellar_global",
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
