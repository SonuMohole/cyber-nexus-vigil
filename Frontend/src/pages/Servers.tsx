import { useEffect, useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, HardDrive, Server, Zap } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

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

  // Fetch real-time data
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
        setHistory((prev) => [...prev.slice(-14), newData]); // store last 15 readings
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

  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar />
      <main className="flex-1 ml-64">
        <DashboardHeader />

        <div className="p-8 space-y-6 animate-fade-in">
          {/* 🌡️ Minimal Metric Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* CPU */}
            <Card className="border border-border/40 shadow-sm hover:shadow-md transition-all duration-300">
              <CardHeader className="flex justify-between items-center">
                <CardTitle className="text-sm font-semibold text-muted-foreground">CPU Usage</CardTitle>
                <Activity className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <p className={`text-3xl font-bold ${getColor(health?.cpu.percent ?? 0)}`}>
                  {health ? `${health.cpu.percent.toFixed(1)}%` : "--"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Processor load</p>
              </CardContent>
            </Card>

            {/* Memory */}
            <Card className="border border-border/40 shadow-sm hover:shadow-md transition-all duration-300">
              <CardHeader className="flex justify-between items-center">
                <CardTitle className="text-sm font-semibold text-muted-foreground">Memory Usage</CardTitle>
                <HardDrive className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <p className={`text-3xl font-bold ${getColor(health?.memory.percent_used ?? 0)}`}>
                  {health ? `${health.memory.percent_used.toFixed(1)}%` : "--"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">RAM consumption</p>
              </CardContent>
            </Card>

            {/* Disk */}
            <Card className="border border-border/40 shadow-sm hover:shadow-md transition-all duration-300">
              <CardHeader className="flex justify-between items-center">
                <CardTitle className="text-sm font-semibold text-muted-foreground">Disk Usage</CardTitle>
                <Server className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <p className={`text-3xl font-bold ${getColor(health?.disk.percent_used ?? 0)}`}>
                  {health ? `${health.disk.percent_used.toFixed(1)}%` : "--"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Storage usage</p>
              </CardContent>
            </Card>

            {/* Network */}
            <Card className="border border-border/40 shadow-sm hover:shadow-md transition-all duration-300">
              <CardHeader className="flex justify-between items-center">
                <CardTitle className="text-sm font-semibold text-muted-foreground">Network Latency</CardTitle>
                <Zap className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <p
                  className={`text-3xl font-bold ${
                    health && health.network.latency_ms > 200
                      ? "text-red-500"
                      : health && health.network.latency_ms > 100
                      ? "text-yellow-500"
                      : "text-green-500"
                  }`}
                >
                  {health ? `${health.network.latency_ms.toFixed(1)} ms` : "--"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Ping response</p>
              </CardContent>
            </Card>
          </div>

          {/* 📈 Live Trend Chart */}
          <Card className="border border-border/40 shadow-sm glass-panel mt-6">
            <CardHeader>
              <CardTitle className="text-base font-semibold text-muted-foreground">
                Real-Time Server Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={history}>
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
                  <Line
                    type="monotone"
                    dataKey="cpu.percent"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    name="CPU %"
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="memory.percent_used"
                    stroke="hsl(var(--accent))"
                    strokeWidth={2}
                    name="Memory %"
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="network.latency_ms"
                    stroke="hsl(var(--success))"
                    strokeWidth={2}
                    name="Latency (ms)"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
