import { Sidebar } from "@/components/Sidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { MetricCard } from "@/components/MetricCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, CheckCircle, AlertTriangle, FileText, Download, Upload, ClipboardList } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const complianceStandards = [
  { name: "ISO 27001", status: "certified", validUntil: "2025-12-31", progress: 100 },
  { name: "SOC 2 Type II", status: "certified", validUntil: "2025-09-15", progress: 100 },
  { name: "GDPR", status: "compliant", validUntil: "Ongoing", progress: 95 },
  { name: "NIST CSF", status: "in-progress", validUntil: "2025-03-30", progress: 78 },
  { name: "HIPAA", status: "review", validUntil: "2025-06-20", progress: 65 },
];

const documents = [
  { name: "ISO 27001 Certificate", type: "PDF", size: "2.4 MB", date: "2024-12-15" },
  { name: "SOC 2 Report", type: "PDF", size: "5.8 MB", date: "2024-11-30" },
  { name: "GDPR Compliance Policy", type: "PDF", size: "1.2 MB", date: "2024-10-22" },
  { name: "Security Whitepaper", type: "PDF", size: "3.6 MB", date: "2024-09-18" },
];

const auditLog = [
  { id: 1, action: "ISO 27001 Annual Review Completed", user: "Admin", date: "2025-01-08 14:23" },
  { id: 2, action: "GDPR Policy Document Updated", user: "Compliance Team", date: "2025-01-05 10:15" },
  { id: 3, action: "SOC 2 Audit Initiated", user: "External Auditor", date: "2024-12-28 09:30" },
  { id: 4, action: "NIST Framework Assessment Started", user: "Security Team", date: "2024-12-20 16:45" },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "certified":
    case "compliant":
      return "bg-success/10 text-success border-success/20";
    case "in-progress":
      return "bg-warning/10 text-warning border-warning/20";
    case "review":
      return "bg-accent/10 text-accent border-accent/20";
    default:
      return "bg-muted/10 text-muted-foreground";
  }
};

export default function Compliance() {
  return (
    <div className="flex min-h-screen w-full">
      <Sidebar />

      <main className="flex-1 ml-64">
        <DashboardHeader />

        <div className="p-8 space-y-8 animate-fade-in">
          {/* Top Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard title="Certifications" value="3" icon={Shield} />
            <MetricCard title="Compliance Score" value="92%" icon={CheckCircle} trend={{ value: 5.2, isPositive: true }} />
            <MetricCard title="Pending Audits" value="2" icon={AlertTriangle} />
            <MetricCard title="Documents" value="24" icon={FileText} />
          </div>

          {/* Compliance Standards */}
          <Card className="glass-panel">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                <ClipboardList className="h-5 w-5 text-primary" />
                Compliance Standards Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {complianceStandards.map((standard, index) => (
                <div
                  key={index}
                  className="p-4 rounded-xl border border-border/40 bg-gradient-to-r from-card/40 to-card/20 hover:from-primary/5 hover:to-card/30 transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Shield className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold">{standard.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Valid until: {standard.validUntil}
                        </p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(standard.status)} variant="outline">
                      {standard.status}
                    </Badge>
                  </div>
                  <Progress value={standard.progress} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Two-column Section */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Documents */}
            <Card className="glass-panel border border-border/40 hover:shadow-md transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <FileText className="h-5 w-5 text-primary" />
                  Policy Documents
                </CardTitle>
                <Button variant="outline" size="sm" className="gap-2">
                  <Upload className="h-4 w-4" />
                  Upload
                </Button>
              </CardHeader>
              <CardContent className="space-y-3">
                {documents.map((doc, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 rounded-lg border border-border/40 bg-gradient-to-r from-card/40 to-card/20 hover:from-accent/5 hover:to-card/30 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">{doc.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {doc.type} · {doc.size} · {doc.date}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Audit Log */}
            <Card className="glass-panel border border-border/40 hover:shadow-md transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <Shield className="h-5 w-5 text-primary" />
                  Audit Activity Log
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {auditLog.map((log) => (
                  <div
                    key={log.id}
                    className="p-3 rounded-lg border border-border/40 bg-card/30 hover:bg-primary/5 transition-all"
                  >
                    <p className="font-medium text-sm mb-1">{log.action}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{log.user}</span>
                      <span>{log.date}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Alerts */}
          <Card className="glass-panel border-warning/20 hover:shadow-md transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg font-semibold text-warning">
                <AlertTriangle className="h-5 w-5 text-warning" />
                Upcoming Compliance Deadlines
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 rounded-lg bg-warning/10 border border-warning/20">
                <p className="font-medium text-sm">NIST CSF Assessment due in 45 days</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Complete remaining 22% of framework controls
                </p>
              </div>
              <div className="p-3 rounded-lg bg-accent/10 border border-accent/20">
                <p className="font-medium text-sm">HIPAA Compliance Review scheduled</p>
                <p className="text-xs text-muted-foreground mt-1">
                  External audit begins in 60 days
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
