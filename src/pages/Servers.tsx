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
            <MetricCard
              title="Active Regions"
              value="4"
              icon={Globe}
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="glass-panel">
              <CardHeader>
                <CardTitle>Global Server Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {servers.map((server) => (
                    <div key={server.id} className="p-4 rounded-lg border border-border/50 bg-card/30 hover:bg-card/50 transition-all">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Server className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-semibold">{server.name}</p>
                            <p className="text-sm text-muted-foreground">{server.location}</p>
                          </div>
                        </div>
                        <Badge className={getStatusColor(server.status)} variant="outline">
                          {server.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Uptime</p>
                          <p className="font-mono font-semibold">{server.uptime}%</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Load</p>
                          <p className="font-mono font-semibold">{server.load}%</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Latency</p>
                          <p className="font-mono font-semibold">{server.latency}ms</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="glass-panel">
              <CardHeader>
                <CardTitle>API Plugin Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {apiPlugins.map((plugin, index) => (
                    <div key={index} className="p-4 rounded-lg border border-border/50 bg-card/30">
                      <div className="flex items-center justify-between mb-3">
                        <p className="font-semibold">{plugin.name}</p>
                        <Badge className={plugin.status === "active" ? "bg-success/10 text-success" : "bg-muted/10 text-muted-foreground"} variant="outline">
                          {plugin.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Requests</p>
                          <p className="font-mono font-semibold">{plugin.requests}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Avg Time</p>
                          <p className="font-mono font-semibold">{plugin.avgTime}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
