import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus, FileText, Trash2, RefreshCw, BarChart3 } from "lucide-react";
import { pillars, getScoreColor, getScoreLabel } from "@/lib/auditData";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

type AuditRow = {
  id: string;
  prospect_first_name: string;
  prospect_last_name: string;
  prospect_company: string;
  prospect_industry: string;
  audit_date: string;
  total_score: number;
  sent_to_ghl: boolean;
  created_at: string;
  updated_at: string;
};

export default function Dashboard() {
  const [audits, setAudits] = useState<AuditRow[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchAudits = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("audits")
      .select("id, prospect_first_name, prospect_last_name, prospect_company, prospect_industry, audit_date, total_score, sent_to_ghl, created_at, updated_at")
      .order("updated_at", { ascending: false });
    setAudits((data as AuditRow[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchAudits();
  }, []);

  const handleDelete = async (id: string) => {
    await supabase.from("audits").delete().eq("id", id);
    toast.success("Audit deleted");
    fetchAudits();
  };

  const maxTotal = pillars.reduce((s, p) => s + p.maxScore, 0);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-primary tracking-wide">RevenueCapture.ai</h1>
            <p className="text-xs text-muted-foreground">4-Pillar AI Lead Audit Dashboard</p>
          </div>
          <Button onClick={() => navigate("/audit")} className="gap-2">
            <Plus className="w-4 h-4" />
            New Audit
          </Button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {loading ? (
          <div className="text-center py-20 text-muted-foreground">Loading audits...</div>
        ) : audits.length === 0 ? (
          <div className="text-center py-20 space-y-4">
            <BarChart3 className="w-12 h-12 mx-auto text-muted-foreground" />
            <h2 className="text-xl font-semibold text-foreground">No audits yet</h2>
            <p className="text-muted-foreground">Create your first audit to get started.</p>
            <Button onClick={() => navigate("/audit")} className="gap-2">
              <Plus className="w-4 h-4" />
              Create First Audit
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                {audits.length} Audit{audits.length !== 1 ? "s" : ""}
              </h2>
              <Button variant="ghost" size="sm" onClick={fetchAudits} className="gap-1.5">
                <RefreshCw className="w-3.5 h-3.5" />
                Refresh
              </Button>
            </div>

            {audits.map((audit) => {
              const name = [audit.prospect_first_name, audit.prospect_last_name].filter(Boolean).join(" ") || "Unnamed";
              return (
                <div
                  key={audit.id}
                  className="bg-card border border-border rounded-lg p-4 flex items-center gap-4 hover:border-primary/30 transition-colors cursor-pointer group"
                  onClick={() => navigate(`/audit/${audit.id}`)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-foreground truncate">{name}</span>
                      {audit.prospect_company && (
                        <span className="text-xs text-muted-foreground">— {audit.prospect_company}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                      {audit.prospect_industry && <span>{audit.prospect_industry.split("(")[0].trim()}</span>}
                      {audit.audit_date && <span>{audit.audit_date}</span>}
                      {audit.sent_to_ghl && (
                        <span className="text-success">✓ Sent to GHL</span>
                      )}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className={`text-2xl font-bold font-mono ${getScoreColor(audit.total_score, maxTotal)}`}>
                      {audit.total_score}
                    </span>
                    <span className="text-xs text-muted-foreground">/{maxTotal}</span>
                    <p className={`text-xs font-medium ${getScoreColor(audit.total_score, maxTotal)}`}>
                      {getScoreLabel(audit.total_score, maxTotal)}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/audit/${audit.id}`);
                      }}
                    >
                      <FileText className="w-4 h-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => e.stopPropagation()}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete this audit?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete the audit for {name}. This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(audit.id)}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
