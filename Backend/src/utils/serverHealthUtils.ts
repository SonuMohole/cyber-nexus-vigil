import os from "os";
import fs from "fs";
import path from "path";
import { performance } from "perf_hooks";
import checkDiskSpace from "check-disk-space";

/* -------------------------------------------------------------------------- */
/* ⚙️ CONFIGURATION SETTINGS                                                  */
/* -------------------------------------------------------------------------- */
const LOG_DIR = path.join(process.cwd(), "logs");
const LOG_FILE = path.join(LOG_DIR, "server_health.log");

if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR, { recursive: true });

const THRESHOLDS = {
  CPU: 90,
  RAM: 90,
  DISK: 90,
  NET_LATENCY: 200, // in ms
};

/* -------------------------------------------------------------------------- */
/* 🌈 COLORS FOR CONSOLE                                                     */
/* -------------------------------------------------------------------------- */
const COLORS = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  green: "\x1b[32m",
  cyan: "\x1b[36m",
};

/* -------------------------------------------------------------------------- */
/* 📜 LOGGING FUNCTION                                                        */
/* -------------------------------------------------------------------------- */
const logAlert = (type: string, message: string) => {
  const time = new Date().toISOString();
  const logMsg = `[${time}] [${type}] ${message}\n`;
  fs.appendFileSync(LOG_FILE, logMsg);
};

/* -------------------------------------------------------------------------- */
/* 🧠 CPU USAGE                                                               */
/* -------------------------------------------------------------------------- */
export const getCpuUsage = async (): Promise<{ ok: boolean; percent: number }> => {
  const start = getCpuTimes();
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const end = getCpuTimes();

  const idleDiff = end.idle - start.idle;
  const totalDiff = end.total - start.total;
  const usagePercent = ((1 - idleDiff / totalDiff) * 100).toFixed(2);
  const percent = +usagePercent;

  if (percent > THRESHOLDS.CPU) {
    logAlert("CPU", `High CPU usage detected: ${percent}%`);
  }

  return { ok: percent < THRESHOLDS.CPU, percent };
};

const getCpuTimes = () => {
  const cpus = os.cpus();
  let idle = 0,
    total = 0;
  for (const cpu of cpus) {
    const { user, nice, sys, idle: i, irq } = cpu.times;
    idle += i;
    total += user + nice + sys + i + irq;
  }
  return { idle, total };
};

/* -------------------------------------------------------------------------- */
/* 💾 MEMORY USAGE                                                            */
/* -------------------------------------------------------------------------- */
export const getMemoryUsage = () => {
  const total = os.totalmem();
  const free = os.freemem();
  const used = total - free;
  const percent = ((used / total) * 100).toFixed(2);
  const usage = +percent;

  if (usage > THRESHOLDS.RAM) {
    logAlert("RAM", `High memory usage detected: ${usage}%`);
  }

  return {
    ok: usage < THRESHOLDS.RAM,
    used_mb: +(used / 1024 / 1024).toFixed(2),
    total_mb: +(total / 1024 / 1024).toFixed(2),
    percent_used: usage,
  };
};

/* -------------------------------------------------------------------------- */
/* 💽 DISK USAGE                                                              */
/* -------------------------------------------------------------------------- */
export const getDiskUsage = async (path = process.platform === "win32" ? "C:/" : "/") => {
  try {
    const diskSpace = await checkDiskSpace(path);
    const totalGB = (diskSpace.size / 1024 / 1024 / 1024).toFixed(2);
    const freeGB = (diskSpace.free / 1024 / 1024 / 1024).toFixed(2);
    const usedGB = (+totalGB - +freeGB).toFixed(2);
    const percentUsed = ((+usedGB / +totalGB) * 100).toFixed(2);
    const usage = +percentUsed;

    if (usage > THRESHOLDS.DISK) {
      logAlert("DISK", `Disk usage critical: ${usage}%`);
    }

    return {
      ok: usage < THRESHOLDS.DISK,
      used_gb: +usedGB,
      total_gb: +totalGB,
      percent_used: usage,
    };
  } catch (err: any) {
    logAlert("DISK", `Disk check failed: ${err.message}`);
    return { ok: false, error: err.message };
  }
};

/* -------------------------------------------------------------------------- */
/* 🌍 NETWORK LATENCY                                                         */
/* -------------------------------------------------------------------------- */
export const getNetworkLatency = async () => {
  const start = performance.now();
  try {
    await fetch("https://dns.google", { method: "HEAD", cache: "no-store" });
    const latency = performance.now() - start;
    if (latency > THRESHOLDS.NET_LATENCY) {
      logAlert("NETWORK", `High network latency detected: ${latency.toFixed(2)} ms`);
    }
    return { ok: latency < THRESHOLDS.NET_LATENCY, latency_ms: +latency.toFixed(2) };
  } catch {
    logAlert("NETWORK", `Network check failed`);
    return { ok: false, latency_ms: 0 };
  }
};

/* -------------------------------------------------------------------------- */
/* ⚡ EVENT LOOP LATENCY                                                      */
/* -------------------------------------------------------------------------- */
export const getServerLatency = async () => {
  const start = performance.now();
  await new Promise((resolve) => setImmediate(resolve));
  const latency = performance.now() - start;
  return { ok: true, latency_ms: +latency.toFixed(2) };
};

/* -------------------------------------------------------------------------- */
/* 🧭 SYSTEM INFO                                                             */
/* -------------------------------------------------------------------------- */
export const getSystemInfo = () => ({
  platform: os.platform(),
  arch: os.arch(),
  release: os.release(),
  hostname: os.hostname(),
  uptime_seconds: os.uptime(),
});

/* -------------------------------------------------------------------------- */
/* 🩺 REAL-TIME SERVER MONITOR                                                */
/* -------------------------------------------------------------------------- */
export const startSystemMonitor = async (intervalMs = 3000) => {
  console.log("\n🧠 Real-Time QStellar Server Monitor Started\n");

  setInterval(async () => {
    const [cpu, memory, disk, net, latency, info] = await Promise.all([
      getCpuUsage(),
      getMemoryUsage(),
      getDiskUsage(),
      getNetworkLatency(),
      getServerLatency(),
      getSystemInfo(),
    ]);

    const color = (ok: boolean) => (ok ? COLORS.green : COLORS.red);

    console.clear();
    console.log(`${COLORS.cyan}🖥️  QStellar Server Health Dashboard${COLORS.reset}`);
    console.log("────────────────────────────────────────────");
    console.log(`📅 Time: ${new Date().toLocaleString()}`);
    console.log(`🧩 Platform: ${info.platform} | Arch: ${info.arch}`);
    console.log(`💡 Hostname: ${info.hostname}`);
    console.log(`⚙️  OS Version: ${info.release}`);
    console.log(`⏱️  Uptime: ${(info.uptime_seconds / 3600).toFixed(2)} hrs`);
    console.log("────────────────────────────────────────────");
    console.log(`🧠 CPU Usage: ${color(cpu.ok)}${cpu.percent}%${COLORS.reset}`);
    console.log(
      `💾 RAM Usage: ${color(memory.ok)}${memory.used_mb} / ${memory.total_mb} MB (${memory.percent_used}%)${COLORS.reset}`
    );
    console.log(
      `💽 Disk Usage: ${color(disk.ok)}${disk.used_gb} / ${disk.total_gb} GB (${disk.percent_used}%)${COLORS.reset}`
    );
    console.log(
      `🌍 Network Latency: ${color(net.ok)}${net.latency_ms} ms${COLORS.reset}`
    );
    console.log(`⚡ Event Loop Latency: ${latency.latency_ms} ms`);
    console.log("────────────────────────────────────────────\n");
  }, intervalMs);
};