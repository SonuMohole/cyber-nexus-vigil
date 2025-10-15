import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { MetricCard } from "@/components/MetricCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Building, Key, CheckCircle, Trash2, Eye, Briefcase, Mail } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

interface Client {
  id: number;
  name: string;
  product: string;
  users: number;
  status: "active" | "expiring" | "expired";
  renewal: string;
  licenseKey: string;
  email: string;
  industry: string;
}

const initialClients: Client[] = [
  { id: 1, name: "TechCorp Industries", product: "Endpoint Protection", users: 1250, status: "active", renewal: "2025-06-15", licenseKey: "QSTL-EP-2024-1A3F-8B9C-D4E5", email: "admin@techcorp.com", industry: "Technology" },
  { id: 2, name: "Global Finance Ltd", product: "Network Security", users: 850, status: "active", renewal: "2025-08-22", licenseKey: "QSTL-NS-2024-2B4G-9C0D-E5F6", email: "it@globalfinance.com", industry: "Finance" },
  { id: 3, name: "Healthcare Systems", product: "Cloud Security", users: 620, status: "expiring", renewal: "2025-01-10", licenseKey: "QSTL-CS-2024-3C5H-0D1E-F6G7", email: "security@healthsys.com", industry: "Healthcare" },
  { id: 4, name: "Retail Chain Co", product: "Identity Management", users: 430, status: "active", renewal: "2025-09-30", licenseKey: "QSTL-IM-2024-4D6I-1E2F-G7H8", email: "ops@retailchain.com", industry: "Retail" },
  { id: 5, name: "Manufacturing Inc", product: "Endpoint Protection", users: 380, status: "active", renewal: "2025-07-18", licenseKey: "QSTL-EP-2024-5E7J-2F3G-H8I9", email: "it@manufacturing.com", industry: "Manufacturing" },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "active": return "bg-success/10 text-success border-success/20";
    case "expiring": return "bg-warning/10 text-warning border-warning/20";
    case "expired": return "bg-destructive/10 text-destructive border-destructive/20";
    default: return "bg-muted/10 text-muted-foreground";
  }
};

export default function Clients() {
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const handleRemoveClient = (clientId: number) => {
    const client = clients.find(c => c.id === clientId);
    if (client) {
      setClients(clients.filter(c => c.id !== clientId));
      toast.success(`${client.name} removed successfully`);
      setIsDetailsOpen(false);
    }
  };

  const handleViewDetails = (client: Client) => {
    setSelectedClient(client);
    setIsDetailsOpen(true);
  };

  const activeClients = clients.filter(c => c.status === "active").length;
  const totalUsers = clients.reduce((sum, c) => sum + c.users, 0);

  return (
    <div className="flex min-h-screen w-full">
      <Sidebar />

      <main className="flex-1 ml-64">
        <DashboardHeader />

        <div className="p-8 space-y-8 animate-fade-in">
          {/* Top Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard title="Total Clients" value={clients.length} icon={Users} />
            <MetricCard title="Active Clients" value={activeClients} icon={CheckCircle} trend={{ value: 12.5, isPositive: true }} />
            <MetricCard title="Total Users" value={totalUsers.toLocaleString()} icon={Building} />
            <MetricCard title="Active Licenses" value={clients.length} icon={Key} />
          </div>

          {/* Client Table */}
          <Card className="glass-panel border border-border/40 hover:shadow-md transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-primary" />
                Client Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto rounded-lg border border-border/30">
                <table className="w-full border-collapse text-sm">
                  <thead className="bg-muted/20">
                    <tr className="text-left">
                      <th className="py-3 px-4 font-medium text-muted-foreground">Client</th>
                      <th className="py-3 px-4 font-medium text-muted-foreground">Product</th>
                      <th className="py-3 px-4 font-medium text-muted-foreground">Users</th>
                      <th className="py-3 px-4 font-medium text-muted-foreground">License Key</th>
                      <th className="py-3 px-4 font-medium text-muted-foreground">Status</th>
                      <th className="py-3 px-4 font-medium text-muted-foreground">Renewal</th>
                      <th className="py-3 px-4 font-medium text-muted-foreground text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clients.map((client) => (
                      <tr
                        key={client.id}
                        className="border-b border-border/30 hover:bg-primary/5 transition-colors"
                      >
                        <td className="py-3 px-4 font-medium">{client.name}</td>
                        <td className="py-3 px-4 text-muted-foreground">{client.product}</td>
                        <td className="py-3 px-4 font-mono">{client.users.toLocaleString()}</td>
                        <td className="py-3 px-4">
                          <code className="text-xs bg-muted/50 px-2 py-1 rounded font-mono">
                            {client.licenseKey}
                          </code>
                        </td>
                        <td className="py-3 px-4">
                          <Badge className={getStatusColor(client.status)} variant="outline">
                            {client.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 font-mono text-sm">{client.renewal}</td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleViewDetails(client)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveClient(client.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Client Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="glass-panel max-w-2xl border border-border/40 backdrop-blur-xl shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold flex items-center gap-2">
              <Eye className="h-5 w-5 text-primary" />
              Client Details
            </DialogTitle>
            <DialogDescription>
              Complete information for <span className="font-semibold text-primary">{selectedClient?.name}</span>
            </DialogDescription>
          </DialogHeader>

          {selectedClient && (
            <div className="space-y-6">
              {/* Overview Section */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Company</p>
                  <p className="font-semibold">{selectedClient.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Industry</p>
                  <p className="font-semibold">{selectedClient.industry}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-muted-foreground">Email</p>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-primary" />
                    <p className="font-semibold">{selectedClient.email}</p>
                  </div>
                </div>
              </div>

              {/* License Key */}
              <div className="p-4 rounded-lg bg-card/40 border border-border/40">
                <p className="text-sm text-muted-foreground mb-1">License Key</p>
                <code className="text-base font-mono font-bold text-primary block">
                  {selectedClient.licenseKey}
                </code>
              </div>

              {/* Product & Status */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Product</p>
                  <p className="font-semibold">{selectedClient.product}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge className={getStatusColor(selectedClient.status)} variant="outline">
                    {selectedClient.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Renewal Date</p>
                  <p className="font-semibold font-mono">{selectedClient.renewal}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active Users</p>
                  <p className="font-semibold font-mono">{selectedClient.users.toLocaleString()}</p>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button variant="outline" className="flex-1" onClick={() => setIsDetailsOpen(false)}>
                  Close
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={() => handleRemoveClient(selectedClient.id)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Remove Client
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
