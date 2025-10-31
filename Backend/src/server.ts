// 📁 Backend/src/server.ts
import express, { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import twofaRoutes from "./routes/twofaRoutes";
import serverHealthRoutes from "./routes/serverHealthRoutes";
import { startSystemMonitor } from "./utils/serverHealthUtils"; // 🧠 Import monitor utility

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

// 🌐 Routes
app.use("/api/auth", authRoutes);
app.use("/api/2fa", twofaRoutes);
app.use("/api/server-health", serverHealthRoutes);

// 💓 Basic health ping
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", time: new Date().toISOString() });
});

// 🚀 Server start
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  
  // 🧠 Start real-time system monitor (every 5 seconds)
  startSystemMonitor(1000);
});
