import { Sidebar } from "@/components/Sidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { MetricCard } from "@/components/MetricCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Package, CheckCircle, TrendingUp, AlertCircle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const clientData = [
  { name: "Jan", clients: 45 },
  { name: "Feb", clients: 52 },
  { name: "Mar", clients: 61 },
  { name: "Apr", clients: 75 },
  { name: "May", clients: 88 },
  { name: "Jun", clients: 95 },
];

const productData = [
  { name: "Endpoint Protection", value: 35, color: "hsl(var(--primary))" },
  { name: "Network Security", value: 28, color: "hsl(var(--accent))" },
  { name: "Cloud Security", value: 22, color: "hsl(var(--success))" },
  { name: "Identity Management", value: 15, color: "hsl(var(--warning))" },
];

const recentClients = [
  { id: 1, name: "TechCorp Industries", product: "Endpoint Protection", users: 1250, status: "active", renewal: "2025-06-15" },
  { id: 2, name: "Global Finance Ltd", product: "Network Security", users: 850, status: "active", renewal: "2025-08-22" },
  { id: 3, name: "Healthcare Systems", product: "Cloud Security", users: 620, status: "expiring", renewal: "2025-01-10" },
  { id: 4, name: "Retail Chain Co", product: "Identity Management", users: 430, status: "active", renewal: "2025-09-30" },
];

export default function Dashboard() {
  return (
    <div className="flex min-h-screen w-full">
      <Sidebar />
      
      <main className="flex-1 ml-64">
        <DashboardHeader />
        
        <div className="p-8 space-y-6 animate-fade-in">
          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="Total Clients"
              value="95"
              icon={Users}
              trend={{ value: 12.5, isPositive: true }}
            />
            <MetricCard
              title="Active Products"
              value="248"
              icon={Package}
              trend={{ value: 8.3, isPositive: true }}
            />
            <MetricCard
              title="Active Users"
              value="12.4K"
              icon={CheckCircle}
              trend={{ value: 15.2, isPositive: true }}
            />
            <MetricCard
              title="Revenue (MRR)"
              value="$2.4M"
              icon={TrendingUp}
              trend={{ value: 18.7, isPositive: true }}
            />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="glass-panel">
              <CardHeader>
                <CardTitle>Client Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={clientData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "hsl(var(--card))", 
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px"
                      }} 
                    />
                    <Bar dataKey="clients" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="glass-panel">
              <CardHeader>
                <CardTitle>Product Distribution</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-center">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={productData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {productData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "hsl(var(--card))", 
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px"
                      }} 
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Recent Clients Table */}
          <Card className="glass-panel">
            <CardHeader>
              <CardTitle>Client Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border/50">
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Client</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Product</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Active Users</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Renewal Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentClients.map((client) => (
                      <tr key={client.id} className="border-b border-border/30 hover:bg-accent/50 transition-colors">
                        <td className="py-3 px-4 font-medium">{client.name}</td>
                        <td className="py-3 px-4 text-muted-foreground">{client.product}</td>
                        <td className="py-3 px-4 font-mono">{client.users.toLocaleString()}</td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                            client.status === "active" 
                              ? "bg-success/10 text-success" 
                              : "bg-warning/10 text-warning"
                          }`}>
                            {client.status === "active" ? (
                              <CheckCircle className="h-3 w-3" />
                            ) : (
                              <AlertCircle className="h-3 w-3" />
                            )}
                            {client.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono text-sm">{client.renewal}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
