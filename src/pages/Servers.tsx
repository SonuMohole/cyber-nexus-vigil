import { Sidebar } from "@/components/Sidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { MetricCard } from "@/components/MetricCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Server, Activity, Zap, Globe } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Badge } from "@/components/ui/badge";

const performanceData = [
  { time: "00:00", cpu: 45, memory: 62, latency: 28 },
  { time: "04:00", cpu: 38, memory: 58, latency: 25 },
  { time: "08:00", cpu: 72, memory: 75, latency: 42 },
  { time: "12:00", cpu: 85, memory: 82, latency: 58 },
  { time: "16:00", cpu: 78, memory: 79, latency: 48 },
  { time: "20:00", cpu: 52, memory: 65, latency: 32 },
];

const servers = [
  { id: 1, name: "US-East-1", location: "Virginia", status: "healthy", uptime: 99.98, load: 45, latency: 28 },
  { id: 2, name: "EU-West-1", location: "Ireland", status: "healthy", uptime: 99.95, load: 52, latency: 35 },
  { id: 3, name: "AP-South-1", location: "Mumbai", status: "warning", uptime: 99.82, load: 78, latency: 62 },
  { id: 4, name: "US-West-2", location: "Oregon", status: "healthy", uptime: 99.99, load: 38, latency: 22 },
];

const apiPlugins = [
  { name: "Authentication API", status: "active", requests: "1.2M", avgTime: "45ms" },
  { name: "Data Sync API", status: "active", requests: "850K", avgTime: "62ms" },
  { name: "Threat Detection API", status: "active", requests: "2.1M", avgTime: "38ms" },
  { name: "Backup Service", status: "inactive", requests: "0", avgTime: "-" },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "healthy": return "bg-success/10 text-success border-success/20";
    case "warning": return "bg-warning/10 text-warning border-warning/20";
    case "critical": return "bg-destructive/10 text-destructive border-destructive/20";
    default: return "bg-muted/10 text-muted-foreground";
  }
};

export default function Servers() {
  return (
    <div className="flex min-h-screen w-full">
      <Sidebar />
      
      <main className="flex-1 ml-64">
        <DashboardHeader />
        
        <div className="p-8 space-y-6 animate-fade-in">
          {/* Server Metrics */}
          {/* Server Metrics */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  <MetricCard
    title="System Uptime"
    value="99.97%"
    icon={Server}
    trend={{ value: 0.02, isPositive: true }}
  />
  <MetricCard
    title="Avg Server Load"
    value="53%"
    icon={Activity}
    trend={{ value: 5.2, isPositive: false }}
  />
  <MetricCard
    title="Avg Latency"
    value="38ms"
    icon={Zap}
    trend={{ value: 12.5, isPositive: true }}
  />
  {/* Replaced Card */}
  <MetricCard
    title="API Health Score"
    value="92%"
    icon={Globe}
    trend={{ value: 3.4, isPositive: true }}
  />
</div>


          {/* Performance Chart */}
          <Card className="glass-panel">
            <CardHeader>
              <CardTitle>System Performance Monitoring</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--card))", 
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px"
                    }} 
                  />
                  <Line type="monotone" dataKey="cpu" stroke="hsl(var(--primary))" strokeWidth={2} name="CPU %" />
                  <Line type="monotone" dataKey="memory" stroke="hsl(var(--accent))" strokeWidth={2} name="Memory %" />
                  <Line type="monotone" dataKey="latency" stroke="hsl(var(--success))" strokeWidth={2} name="Latency (ms)" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Server Status Grid */}
         <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6">
  {/* Global Server Distribution */}
  <Card className="glass-panel border border-border/40 hover:shadow-md transition-all duration-300">
    <CardHeader>
      <CardTitle className="flex items-center gap-2 text-lg font-semibold">
        <Server className="h-5 w-5 text-primary" />
        Global Server Distribution
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      {servers.map((server) => (
        <div
          key={server.id}
          className="flex items-center justify-between p-4 rounded-xl border border-border/40 bg-gradient-to-r from-card/40 to-card/20 hover:from-primary/5 hover:to-card/30 transition-all duration-300"
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-primary/10">
              <Server className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-foreground">{server.name}</p>
              <p className="text-xs text-muted-foreground">{server.location}</p>
            </div>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <div className="text-right">
              <p className="text-muted-foreground">Load</p>
              <p className="font-mono font-semibold">{server.load}%</p>
            </div>
            <div className="text-right">
              <p className="text-muted-foreground">Latency</p>
              <p className="font-mono font-semibold">{server.latency}ms</p>
            </div>
            <Badge className={getStatusColor(server.status)} variant="outline">
              {server.status}
            </Badge>
          </div>
        </div>
      ))}
    </CardContent>
  </Card>

  {/* API Plugin Status */}
  <Card className="glass-panel border border-border/40 hover:shadow-md transition-all duration-300">
    <CardHeader>
      <CardTitle className="flex items-center gap-2 text-lg font-semibold">
        <Globe className="h-5 w-5 text-primary" />
        API Plugin Status
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      {apiPlugins.map((plugin, index) => (
        <div
          key={index}
          className="flex items-center justify-between p-4 rounded-xl border border-border/40 bg-gradient-to-r from-card/40 to-card/20 hover:from-success/5 hover:to-card/30 transition-all duration-300"
        >
          <div>
            <p className="font-semibold">{plugin.name}</p>
            <p className="text-xs text-muted-foreground">
              Requests: <span className="font-mono font-semibold">{plugin.requests}</span>
            </p>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-muted-foreground text-xs">Avg Time</p>
              <p className="font-mono font-semibold text-sm">{plugin.avgTime}</p>
            </div>
            <Badge
              className={
                plugin.status === "active"
                  ? "bg-success/10 text-success border-success/20"
                  : "bg-destructive/10 text-destructive border-destructive/20"
              }
              variant="outline"
            >
              {plugin.status}
            </Badge>
          </div>
        </div>
      ))}
    </CardContent>
  </Card>
</div>

        </div>
      </main>
    </div>
  );
}
