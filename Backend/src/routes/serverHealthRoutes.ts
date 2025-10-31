// Backend/src/routes/serverHealthRoutes.ts
import express from "express";
import { getCpuUsage, getMemoryUsage, getDiskUsage, getNetworkLatency, getServerLatency } from "../utils/serverHealthUtils";
const router = express.Router();

router.get("/realtime", async (_req, res) => {
  const [cpu, memory, disk, net, latency] = await Promise.all([
    getCpuUsage(),
    getMemoryUsage(),
    getDiskUsage(),
    getNetworkLatency(),
    getServerLatency(),
  ]);
  res.json({ cpu, memory, disk, net, latency, time: new Date() });
});

export default router;