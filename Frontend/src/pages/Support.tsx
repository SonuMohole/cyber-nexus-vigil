"use client";

import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { MetricCard } from "@/components/MetricCard";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  Star,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

interface Ticket {
  id: string;
  client: string;
  priority: string;
  status: string;
  subject: string;
  time: string;
  assignee: string;
  notes: string;
}

interface Feedback {
  id: number;
  client: string;
  rating: number;
  comment: string;
  date: string;
}

const initialTickets: Ticket[] = [
  {
    id: "TK-1045",
    client: "TechCorp Industries",
    priority: "high",
    status: "open",
    subject: "Network intrusion detected",
    time: "2h ago",
    assignee: "Alex",
    notes: "Investigating traffic anomalies",
  },
  {
    id: "TK-1044",
    client: "Global Finance Ltd",
    priority: "medium",
    status: "in-progress",
    subject: "License renewal inquiry",
    time: "4h ago",
    assignee: "Nina",
    notes: "Waiting for vendor confirmation",
  },
  {
    id: "TK-1043",
    client: "Healthcare Systems",
    priority: "low",
    status: "closed",
    subject: "Training materials request",
    time: "6h ago",
    assignee: "Vikram",
    notes: "Delivered via client portal",
  },
  {
    id: "TK-1042",
    client: "Retail Chain Co",
    priority: "high",
    status: "in-progress",
    subject: "API integration issue",
    time: "8h ago",
    assignee: "Riya",
    notes: "Debugging webhook delay",
  },
];

const feedback: Feedback[] = [
  {
    id: 1,
    client: "TechCorp Industries",
    rating: 5,
    comment: "Excellent support response time!",
    date: "2025-01-08",
  },
  {
    id: 2,
    client: "Global Finance Ltd",
    rating: 4,
    comment: "Good service, minor delays during peak hours",
    date: "2025-01-07",
  },
  {
    id: 3,
    client: "Healthcare Systems",
    rating: 5,
    comment: "Very professional team",
    date: "2025-01-06",
  },
  {
    id: 4,
    client: "Retail Chain Co",
    rating: 3,
    comment: "Could improve documentation",
    date: "2025-01-05",
  },
];

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "high":
      return "bg-destructive/10 text-destructive border-destructive/20";
    case "medium":
      return "bg-warning/10 text-warning border-warning/20";
    case "low":
      return "bg-success/10 text-success border-success/20";
    default:
      return "bg-muted/10 text-muted-foreground";
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "open":
      return "bg-accent/10 text-accent border-accent/20";
    case "in-progress":
      return "bg-warning/10 text-warning border-warning/20";
    case "closed":
      return "bg-success/10 text-success border-success/20";
    default:
      return "bg-muted/10 text-muted-foreground";
  }
};

export default function Support() {
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets);
  const [expandedTicket, setExpandedTicket] = useState<string | null>(null);

  const handleChange = (id: string, field: keyof Ticket, value: string) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === id ? { ...t, [field]: value } : t))
    );
  };

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
              <TabsTrigger
                value="tickets"
                className="w-1/2 rounded-lg data-[state=active]:bg-primary/10"
              >
                Support Tickets
              </TabsTrigger>
              <TabsTrigger
                value="feedback"
                className="w-1/2 rounded-lg data-[state=active]:bg-primary/10"
              >
                Client Feedback
              </TabsTrigger>
            </TabsList>

            {/* Editable Support Tickets */}
            <TabsContent value="tickets">
              <Card className="glass-panel border border-border/40">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">
                    Active Support Tickets
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {tickets.map((ticket) => {
                    const isOpen = expandedTicket === ticket.id;
                    return (
                      <div
                        key={ticket.id}
                        className={`p-4 rounded-xl border border-border/40 bg-gradient-to-r from-card/40 to-card/20 
                          hover:from-primary/5 hover:to-card/30 transition-all duration-300 shadow-sm cursor-pointer 
                          ${isOpen ? "ring-2 ring-primary/30 bg-card/50" : ""}`}
                        onClick={() =>
                          setExpandedTicket(isOpen ? null : ticket.id)
                        }
                      >
                        {/* Header */}
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-mono text-primary font-semibold">
                              {ticket.id}
                            </span>
                            <Badge
                              className={getPriorityColor(ticket.priority)}
                              variant="outline"
                            >
                              <AlertCircle className="h-3 w-3 mr-1" />
                              {ticket.priority}
                            </Badge>
                            <Badge
                              className={getStatusColor(ticket.status)}
                              variant="outline"
                            >
                              {ticket.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            {ticket.time}
                            {isOpen ? (
                              <ChevronUp className="h-4 w-4 text-primary" />
                            ) : (
                              <ChevronDown className="h-4 w-4 text-primary" />
                            )}
                          </div>
                        </div>

                        {/* Summary */}
                        <h4 className="font-semibold text-[15px] text-foreground mb-1">
                          {ticket.subject}
                        </h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          {ticket.client}
                        </p>

                        {/* Editable Section */}
                        {isOpen && (
                          <div
                            className="mt-4 p-4 rounded-lg border border-border/30 bg-gradient-to-br 
                              from-gray-50/50 to-gray-100/40 dark:from-[#121212]/60 dark:to-[#181818]/50"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {/* Priority */}
                              <div>
                                <label className="text-xs text-muted-foreground font-medium">
                                  Priority
                                </label>
                                <select
                                  value={ticket.priority}
                                  onChange={(e) =>
                                    handleChange(
                                      ticket.id,
                                      "priority",
                                      e.target.value
                                    )
                                  }
                                  className="w-full mt-1 text-sm p-2 rounded-md border border-gray-300/40 
                                    dark:border-gray-700/40 bg-card"
                                >
                                  <option value="low">low</option>
                                  <option value="medium">medium</option>
                                  <option value="high">high</option>
                                </select>
                              </div>

                              {/* Status */}
                              <div>
                                <label className="text-xs text-muted-foreground font-medium">
                                  Status
                                </label>
                                <select
                                  value={ticket.status}
                                  onChange={(e) =>
                                    handleChange(
                                      ticket.id,
                                      "status",
                                      e.target.value
                                    )
                                  }
                                  className="w-full mt-1 text-sm p-2 rounded-md border border-gray-300/40 
                                    dark:border-gray-700/40 bg-card"
                                >
                                  <option value="open">open</option>
                                  <option value="in-progress">
                                    in-progress
                                  </option>
                                  <option value="closed">closed</option>
                                </select>
                              </div>

                              {/* Assignee */}
                              <div className="sm:col-span-2">
                                <label className="text-xs text-muted-foreground font-medium">
                                  Assignee
                                </label>
                                <input
                                  type="text"
                                  value={ticket.assignee}
                                  onChange={(e) =>
                                    handleChange(
                                      ticket.id,
                                      "assignee",
                                      e.target.value
                                    )
                                  }
                                  className="w-full mt-1 text-sm p-2 rounded-md border border-gray-300/40 
                                    dark:border-gray-700/40 bg-card"
                                />
                              </div>

                              {/* Notes */}
                              <div className="sm:col-span-2">
                                <label className="text-xs text-muted-foreground font-medium">
                                  Notes
                                </label>
                                <textarea
                                  value={ticket.notes}
                                  onChange={(e) =>
                                    handleChange(
                                      ticket.id,
                                      "notes",
                                      e.target.value
                                    )
                                  }
                                  rows={2}
                                  className="w-full mt-1 text-sm p-2 rounded-md border border-gray-300/40 
                                    dark:border-gray-700/40 bg-card"
                                />
                              </div>
                            </div>

                            <div className="flex justify-end mt-4">
                              <Button
                                variant="default"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  console.log("Saved:", ticket.id, ticket);
                                }}
                                className="shadow-sm hover:shadow-md transition-all duration-300"
                              >
                                💾 Save Changes
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Client Feedback */}
            <TabsContent value="feedback">
              <Card className="glass-panel border border-border/40">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">
                    Recent Client Feedback
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {feedback.map((item) => (
                      <div
                        key={item.id}
                        className="p-5 rounded-xl border border-border/40 bg-gradient-to-br from-card/40 to-card/20 
                        hover:from-primary/5 hover:to-card/30 transition-all duration-300 shadow-sm hover:shadow-md"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <p className="font-semibold">{item.client}</p>
                            <p className="text-xs text-muted-foreground">
                              {item.date}
                            </p>
                          </div>
                          <div className="flex gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < item.rating
                                    ? "fill-warning text-warning"
                                    : "text-muted"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {item.comment}
                        </p>
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
