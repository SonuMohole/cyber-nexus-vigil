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
        <Card className="glass-panel border border-border/40 shadow-lg hover:shadow-xl transition-all duration-300">
  <CardHeader className="flex flex-row items-center justify-between">
    <div>
      <CardTitle className="text-lg font-semibold flex items-center gap-2">
        📊 Revenue Trend Analysis
      </CardTitle>
      <p className="text-sm text-muted-foreground mt-1">
        Monthly performance comparison across all products
      </p>
    </div>

    <div className="flex gap-2">
      <Button 
        variant="outline" 
        size="sm" 
        className="hover:bg-primary/10 hover:text-primary transition-all"
      >
        Export CSV
      </Button>
      <Button 
        variant="outline" 
        size="sm" 
        className="hover:bg-primary/10 hover:text-primary transition-all"
      >
        Export PDF
      </Button>
    </div>
  </CardHeader>

  <CardContent>
    <div className="h-[420px] w-full bg-gradient-to-br from-card/30 via-card/20 to-card/10 rounded-xl p-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart 
          data={monthlyRevenue} 
          margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
        >
          <defs>
            {/* subtle line gradients for each category */}
            <linearGradient id="totalGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.9} />
              <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="endpointGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity={0.9} />
              <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="networkGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(var(--success))" stopOpacity={0.9} />
              <stop offset="100%" stopColor="hsl(var(--success))" stopOpacity={0.1} />
            </linearGradient>
          </defs>

          <CartesianGrid 
            strokeDasharray="4 4" 
            stroke="hsl(var(--border))" 
            opacity={0.4}
          />
          <XAxis 
            dataKey="month" 
            stroke="hsl(var(--muted-foreground))" 
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            stroke="hsl(var(--muted-foreground))" 
            tickLine={false}
            axisLine={false}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: "hsl(var(--popover))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
            }}
            labelStyle={{ color: "hsl(var(--foreground))", fontWeight: 500 }}
          />
          <Legend 
            wrapperStyle={{ paddingTop: "10px" }}
            iconType="circle"
          />

          {/* Total Revenue Line */}
          <Line 
            type="monotone" 
            dataKey="total" 
            stroke="url(#totalGradient)"
            strokeWidth={3}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
            name="Total Revenue"
          />

          {/* Endpoint Line */}
          <Line 
            type="monotone" 
            dataKey="endpoint" 
            stroke="url(#endpointGradient)"
            strokeWidth={2.5}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
            name="Endpoint"
          />

          {/* Network Line */}
          <Line 
            type="monotone" 
            dataKey="network" 
            stroke="url(#networkGradient)"
            strokeWidth={2.5}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
            name="Network"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </CardContent>
</Card>


          {/* Product Revenue Breakdown */}
      

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
