// 📁 Backend/src/controllers/serverHealthController.ts
import { Request, Response } from "express";
import {
  getCpuUsage,
  getMemoryUsage,
  getServerLatency,

} from "../utils/serverHealthUtils";

export const getServerHealth = async (_req: Request, res: Response) => {
  try {
    const [cpu, memory, latency] = await Promise.all([
      getCpuUsage(),
      getMemoryUsage(),
      getServerLatency(),
  
    ]);

    

    res.status(200).json({
      timestamp: new Date().toISOString(),
      uptime_seconds: process.uptime(),
      metrics: {
        cpu,
        memory,
        latency,
       
      },
    });
  } catch (error: any) {
    console.error("💥 Server Health Error:", error.message);
    res.status(500).json({ status: "DOWN", error: error.message });
  }
};
