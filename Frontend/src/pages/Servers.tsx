import { useEffect, useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, HardDrive, Server, Zap, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL as string;

interface HealthData {
  cpu: { percent: number };
  memory: { percent_used: number };
  disk: { percent_used: number };
  network: { latency_ms: number };
  timestamp: string;
}

export default function Servers() {
  const [health, setHealth] = useState<HealthData | null>(null);
  const [history, setHistory] = useState<HealthData[]>([]);

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/server-health/realtime`);
        const data = await res.json();
        const newData = {
          cpu: data.cpu,
          memory: data.memory,
          disk: data.disk,
          network: data.net,
          timestamp: new Date().toLocaleTimeString(),
        };
        setHealth(newData);
        setHistory((prev) => [...prev.slice(-24), newData]);
      } catch (err) {
        console.error("⚠️ Failed to fetch health data:", err);
      }
    };

    fetchHealth();
    const interval = setInterval(fetchHealth, 4000);
    return () => clearInterval(interval);
  }, []);

  const getColor = (percent: number) => {
    if (percent < 70) return "text-green-500";
    if (percent < 90) return "text-yellow-500";
    return "text-red-500";
  };

  const getStatus = (percent: number) => {
    if (percent < 70) return { label: "Healthy", color: "bg-green-100 text-green-700" };
    if (percent < 90) return { label: "Warning", color: "bg-yellow-100 text-yellow-700" };
    return { label: "Critical", color: "bg-red-100 text-red-700" };
  };

  const prev = history.length > 1 ? history[history.length - 2] : null;
  const getTrend = (curr: number, prev?: number) => {
    if (!prev) return null;
    return curr >= prev ? <ArrowUpRight className="w-3 h-3 text-red-500" /> : <ArrowDownRight className="w-3 h-3 text-green-500" />;
  };

  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar />
      <main className="flex-1 ml-64">
        <DashboardHeader />

        <div className="p-8 space-y-6 animate-fade-in">

          {/* 🌍 Summary Header */}
          <Card className="p-4 shadow-sm border border-border/40 glass-panel">
            <div className="grid grid-cols-2 md:grid-cols-4 text-sm text-muted-foreground">
              <p>🧩 Platform: <span className="text-foreground font-semibold">Windows x64</span></p>
              <p>💡 Hostname: <span className="text-foreground font-semibold">JG-VICTUS</span></p>
              <p>⏱️ Uptime: <span className="text-foreground font-semibold">~7.8 hrs</span></p>
              <p>📅 Time: <span className="text-foreground font-semibold">{new Date().toLocaleTimeString()}</span></p>
            </div>
          </Card>

          {/* 🌡 Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {health && (
              <>
                {/* CPU */}
                <MetricCard
                  title="CPU Usage"
                  icon={Activity}
                  value={health.cpu.percent}
                  label="Processor Load"
                  colorFn={getColor}
                  status={getStatus(health.cpu.percent)}
                  trend={getTrend(health.cpu.percent, prev?.cpu.percent)}
                />
                {/* Memory */}
                <MetricCard
                  title="Memory Usage"
                  icon={HardDrive}
                  value={health.memory.percent_used}
                  label="RAM Consumption"
                  colorFn={getColor}
                  status={getStatus(health.memory.percent_used)}
                  trend={getTrend(health.memory.percent_used, prev?.memory.percent_used)}
                />
                {/* Disk */}
                <MetricCard
                  title="Disk Usage"
                  icon={Server}
                  value={health.disk.percent_used}
                  label="Storage Usage"
                  colorFn={getColor}
                  status={getStatus(health.disk.percent_used)}
                  trend={getTrend(health.disk.percent_used, prev?.disk.percent_used)}
                />
                {/* Network */}
                <MetricCard
                  title="Network Latency"
                  icon={Zap}
                  value={health.network.latency_ms}
                  suffix="ms"
                  label="Ping Response"
                  colorFn={(v) => (v < 100 ? "text-green-500" : v < 200 ? "text-yellow-500" : "text-red-500")}
                  status={getStatus(health.network.latency_ms / 2)}
                  trend={getTrend(health.network.latency_ms, prev?.network.latency_ms)}
                />
              </>
            )}
          </div>

          {/* 📊 Improved Chart */}
          <Card className="border border-border/40 shadow-sm glass-panel mt-6">
            <CardHeader>
              <CardTitle className="text-base font-semibold text-muted-foreground">
                Real-Time Server Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={history}>
                  <defs>
                    <linearGradient id="cpuGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="memoryGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="#f59e0b" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="latencyGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#22c55e" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="timestamp" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Area type="monotone" dataKey="cpu.percent" stroke="#3b82f6" fill="url(#cpuGradient)" name="CPU %" />
                  <Area type="monotone" dataKey="memory.percent_used" stroke="#f59e0b" fill="url(#memoryGradient)" name="Memory %" />
                  <Area type="monotone" dataKey="network.latency_ms" stroke="#22c55e" fill="url(#latencyGradient)" name="Latency (ms)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

function MetricCard({ title, icon: Icon, value, suffix = "%", label, colorFn, status, trend }: any) {
  return (
    <Card className="border border-border/40 shadow-sm p-4 transition-all duration-300 hover:shadow-md">
      <CardHeader className="flex justify-between items-center pb-2">
        <CardTitle className="text-sm text-muted-foreground flex items-center gap-1">
          {title}
          {trend}
        </CardTitle>
        <Icon className="h-4 w-4 text-primary" />
      </CardHeader>
      <CardContent>
        <p className={`text-3xl font-bold ${colorFn(value ?? 0)}`}>
          {value ? `${value.toFixed(1)}${suffix}` : "--"}
        </p>
        <p className="text-xs text-muted-foreground mt-1">{label}</p>
        <div className={`inline-block px-2 py-0.5 mt-2 text-xs rounded-md ${status.color}`}>
          {status.label}
        </div>
      </CardContent>
    </Card>
  );
}
