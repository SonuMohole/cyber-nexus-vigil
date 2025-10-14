import { Sidebar } from "@/components/Sidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { MetricCard } from "@/components/MetricCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, CreditCard, PieChart as PieChartIcon } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Button } from "@/components/ui/button";

const monthlyRevenue = [
  { month: "Jan", total: 185000, endpoint: 75000, network: 55000, cloud: 35000, identity: 20000 },
  { month: "Feb", total: 198000, endpoint: 78000, network: 60000, cloud: 38000, identity: 22000 },
  { month: "Mar", total: 215000, endpoint: 85000, network: 65000, cloud: 42000, identity: 23000 },
  { month: "Apr", total: 228000, endpoint: 92000, network: 68000, cloud: 45000, identity: 23000 },
  { month: "May", total: 235000, endpoint: 95000, network: 70000, cloud: 47000, identity: 23000 },
  { month: "Jun", total: 242000, endpoint: 98000, network: 72000, cloud: 48000, identity: 24000 },
];

const clientRevenue = [
  { name: "TechCorp Industries", revenue: 45000, growth: 12 },
  { name: "Global Finance Ltd", revenue: 38000, growth: 8 },
  { name: "Healthcare Systems", revenue: 32000, growth: 15 },
  { name: "Retail Chain Co", revenue: 28000, growth: 5 },
  { name: "Manufacturing Inc", revenue: 25000, growth: 18 },
];

export default function Revenue() {
  return (
    <div className="flex min-h-screen w-full">
      <Sidebar />
      
      <main className="flex-1 ml-64">
        <DashboardHeader />
        
        <div className="p-8 space-y-6 animate-fade-in">
          {/* Revenue Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="Total Revenue"
              value="$2.4M"
              icon={DollarSign}
              trend={{ value: 18.7, isPositive: true }}
            />
            <MetricCard
              title="Monthly Growth"
              value="+$42K"
              icon={TrendingUp}
              trend={{ value: 6.5, isPositive: true }}
            />
            <MetricCard
              title="Average Deal Size"
              value="$25.4K"
              icon={CreditCard}
              trend={{ value: 3.2, isPositive: true }}
            />
            <MetricCard
              title="Revenue Per Client"
              value="$25.3K"
              icon={PieChartIcon}
              trend={{ value: 2.1, isPositive: true }}
            />
          </div>

          {/* Revenue Trend Chart */}
          <Card className="glass-panel">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Revenue Trend Analysis</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">Export CSV</Button>
                <Button variant="outline" size="sm">Export PDF</Button>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={monthlyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--card))", 
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px"
                    }} 
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="total" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={3}
                    name="Total Revenue"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="endpoint" 
                    stroke="hsl(var(--accent))" 
                    strokeWidth={2}
                    name="Endpoint"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="network" 
                    stroke="hsl(var(--success))" 
                    strokeWidth={2}
                    name="Network"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Product Revenue Breakdown */}
          <Card className="glass-panel">
            <CardHeader>
              <CardTitle>Product Revenue Segmentation</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--card))", 
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px"
                    }} 
                  />
                  <Legend />
                  <Bar dataKey="endpoint" stackId="a" fill="hsl(var(--primary))" name="Endpoint Protection" />
                  <Bar dataKey="network" stackId="a" fill="hsl(var(--accent))" name="Network Security" />
                  <Bar dataKey="cloud" stackId="a" fill="hsl(var(--success))" name="Cloud Security" />
                  <Bar dataKey="identity" stackId="a" fill="hsl(var(--warning))" name="Identity Mgmt" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Top Clients by Revenue */}
          <Card className="glass-panel">
            <CardHeader>
              <CardTitle>Top Clients by Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {clientRevenue.map((client, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-accent/20 hover:bg-accent/30 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center font-bold text-primary">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-semibold">{client.name}</p>
                        <p className="text-sm text-muted-foreground">Monthly Revenue</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold font-mono">${client.revenue.toLocaleString()}</p>
                      <p className="text-sm text-success">↗ {client.growth}% growth</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
