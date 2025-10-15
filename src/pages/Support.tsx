import { Sidebar } from "@/components/Sidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { MetricCard } from "@/components/MetricCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Clock, CheckCircle2, AlertCircle, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const tickets = [
  { id: "TK-1045", client: "TechCorp Industries", priority: "high", status: "open", subject: "Network intrusion detected", time: "2h ago" },
  { id: "TK-1044", client: "Global Finance Ltd", priority: "medium", status: "in-progress", subject: "License renewal inquiry", time: "4h ago" },
  { id: "TK-1043", client: "Healthcare Systems", priority: "low", status: "closed", subject: "Training materials request", time: "6h ago" },
  { id: "TK-1042", client: "Retail Chain Co", priority: "high", status: "in-progress", subject: "API integration issue", time: "8h ago" },
  { id: "TK-1041", client: "Manufacturing Inc", priority: "medium", status: "open", subject: "User access permissions", time: "1d ago" },
];

const feedback = [
  { id: 1, client: "TechCorp Industries", rating: 5, comment: "Excellent support response time!", date: "2025-01-08" },
  { id: 2, client: "Global Finance Ltd", rating: 4, comment: "Good service, minor delays during peak hours", date: "2025-01-07" },
  { id: 3, client: "Healthcare Systems", rating: 5, comment: "Very professional team", date: "2025-01-06" },
  { id: 4, client: "Retail Chain Co", rating: 3, comment: "Could improve documentation", date: "2025-01-05" },
];

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "high": return "bg-destructive/10 text-destructive border-destructive/20";
    case "medium": return "bg-warning/10 text-warning border-warning/20";
    case "low": return "bg-success/10 text-success border-success/20";
    default: return "bg-muted/10 text-muted-foreground";
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "open": return "bg-accent/10 text-accent border-accent/20";
    case "in-progress": return "bg-warning/10 text-warning border-warning/20";
    case "closed": return "bg-success/10 text-success border-success/20";
    default: return "bg-muted/10 text-muted-foreground";
  }
};

export default function Support() {
  return (
    <div className="flex min-h-screen w-full">
      <Sidebar />

      <main className="flex-1 ml-64">
        <DashboardHeader />

        <div className="p-8 space-y-8 animate-fade-in">
          {/* Top Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="Open Tickets"
              value="23"
              icon={MessageSquare}
              trend={{ value: 5.2, isPositive: false }}
            />
            <MetricCard
              title="Avg Response Time"
              value="2.4h"
              icon={Clock}
              trend={{ value: 12.3, isPositive: true }}
            />
            <MetricCard
              title="Resolution Rate"
              value="94%"
              icon={CheckCircle2}
              trend={{ value: 3.1, isPositive: true }}
            />
            <MetricCard
              title="Avg Rating"
              value="4.6"
              icon={Star}
              trend={{ value: 2.5, isPositive: true }}
            />
          </div>

          {/* Tabs Section */}
          <Tabs defaultValue="tickets" className="space-y-8">
            <TabsList className="glass-panel border border-border/40 p-1 rounded-xl">
              <TabsTrigger value="tickets" className="w-1/2 rounded-lg data-[state=active]:bg-primary/10">
                Support Tickets
              </TabsTrigger>
              <TabsTrigger value="feedback" className="w-1/2 rounded-lg data-[state=active]:bg-primary/10">
                Client Feedback
              </TabsTrigger>
            </TabsList>

            {/* Support Tickets */}
            <TabsContent value="tickets">
              <Card className="glass-panel border border-border/40">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Active Support Tickets</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {tickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      className="p-4 rounded-xl border border-border/40 bg-gradient-to-r from-card/40 to-card/20 hover:from-primary/5 hover:to-card/30 transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-primary font-semibold">{ticket.id}</span>
                          <Badge className={getPriorityColor(ticket.priority)} variant="outline">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            {ticket.priority}
                          </Badge>
                          <Badge className={getStatusColor(ticket.status)} variant="outline">
                            {ticket.status}
                          </Badge>
                        </div>
                        <span className="text-sm text-muted-foreground">{ticket.time}</span>
                      </div>
                      <h4 className="font-semibold text-lg">{ticket.subject}</h4>
                      <p className="text-sm text-muted-foreground">{ticket.client}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Client Feedback */}
            <TabsContent value="feedback">
              <Card className="glass-panel border border-border/40">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Recent Client Feedback</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {feedback.map((item) => (
                      <div
                        key={item.id}
                        className="p-5 rounded-xl border border-border/40 bg-gradient-to-br from-card/40 to-card/20 hover:from-primary/5 hover:to-card/30 transition-all duration-300 shadow-sm hover:shadow-md"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <p className="font-semibold">{item.client}</p>
                            <p className="text-xs text-muted-foreground">{item.date}</p>
                          </div>
                          <div className="flex gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < item.rating ? "fill-warning text-warning" : "text-muted"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">{item.comment}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
