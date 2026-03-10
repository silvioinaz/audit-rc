import { pillars, getScoreLabel, getScoreColor, getScoreBgColor } from "@/lib/auditData";
import { ProspectInfo } from "@/lib/auditData";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Send } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";

type Props = {
  getPillarScore: (id: string) => number;
  getTotalScore: () => number;
  prospectInfo: ProspectInfo;
  answers: Record<string, number | null>;
  notes: Record<string, string>;
};

const GHL_WEBHOOK_URL = "https://services.leadconnectorhq.com/hooks/ERB3QwqNBa5JjalEmjoc/webhook-trigger/f57ebc0e-4edb-423d-83ff-1c89533e56cf";

export default function ResultsTab({ getPillarScore, getTotalScore, prospectInfo, answers, notes }: Props) {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const prevDataRef = useRef(JSON.stringify({ prospectInfo, answers, notes }));

  useEffect(() => {
    const current = JSON.stringify({ prospectInfo, answers, notes });
    if (sent && current !== prevDataRef.current) {
      setSent(false);
    }
    prevDataRef.current = current;
  }, [prospectInfo, answers, notes, sent]);
  const totalScore = getTotalScore();
  const maxTotal = pillars.reduce((s, p) => s + p.maxScore, 0);
  const avgScore = pillars.length > 0 ? Math.round(totalScore / pillars.length) : 0;

  const revenue = parseFloat(prospectInfo.monthlyRevenue) || 0;
  const avgJob = parseFloat(prospectInfo.avgJobValue) || 0;
  const missedCalls = parseFloat(prospectInfo.missedCallsMonth) || 0;
  const dbSize = parseFloat(prospectInfo.customerDbSize) || 0;
  const visitors = parseFloat(prospectInfo.monthlyVisitors) || 0;
  const convRate = parseFloat(prospectInfo.conversionRate) || 2.8;

  // Revenue gap calculations
  const voiceGap = missedCalls * avgJob * 12 * 0.3; // 30% close rate on missed calls
  const convAiGap = revenue * 12 * 0.15; // 15% improvement potential
  const reputationGap = revenue * 12 * 0.07; // 7% from 1-star improvement
  const dbGap = dbSize * avgJob * 0.2 * 0.25; // 20% reactivation, 25% repurchase

  const gaps: Record<string, number> = {
    "voice-ai": voiceGap,
    "conversational-ai": convAiGap,
    reputation: reputationGap,
    database: dbGap,
  };

  const totalGap = Object.values(gaps).reduce((s, v) => s + v, 0);

  const sorted = [...pillars].sort((a, b) => getPillarScore(a.id) - getPillarScore(b.id));

  const handleSendToGHL = async () => {
    setSending(true);
    try {
      const pillarScores: Record<string, number> = {};
      const pillarTags: string[] = [];
      pillars.forEach((p) => {
        const score = getPillarScore(p.id);
        pillarScores[p.id] = score;
        const pct = (score / p.maxScore) * 100;
        const tier = pct <= 25 ? "critical" : pct <= 50 ? "poor" : pct <= 75 ? "fair" : "good";
        pillarTags.push(`${p.id}-${tier}`);
      });

      const overallPct = (totalScore / maxTotal) * 100;
      const overallTier = overallPct <= 25 ? "critical" : overallPct <= 50 ? "poor" : overallPct <= 75 ? "fair" : "good";

      const payload = {
        first_name: prospectInfo.firstName,
        last_name: prospectInfo.lastName,
        company_name: prospectInfo.companyName,
        phone: prospectInfo.phone,
        email: prospectInfo.email,
        website: prospectInfo.website,
        industry: prospectInfo.industry,
        audit_date: prospectInfo.auditDate,
        google_rating: prospectInfo.googleRating,
        pre_call_notes: prospectInfo.preCallNotes,
        monthly_revenue: prospectInfo.monthlyRevenue,
        avg_job_value: prospectInfo.avgJobValue,
        customer_db_size: prospectInfo.customerDbSize,
        missed_calls_month: prospectInfo.missedCallsMonth,
        monthly_leads: prospectInfo.monthlyLeads,
        monthly_visitors: prospectInfo.monthlyVisitors,
        conversion_rate: prospectInfo.conversionRate,
        total_score: totalScore,
        max_total: maxTotal,
        avg_score: avgScore,
        overall_tier: `audit-${overallTier}`,
        pillar_tags: pillarTags,
        total_revenue_gap: Math.round(totalGap),
        pillar_scores: pillarScores,
        gaps: Object.fromEntries(Object.entries(gaps).map(([k, v]) => [k, Math.round(v)])),
        answers,
        notes,
      };

      const res = await fetch(GHL_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Webhook failed");
      setSent(true);
      toast.success("Prospect data sent to GHL successfully!");
    } catch (err) {
      toast.error("Failed to send data to GHL. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-primary">Audit Results Dashboard</h2>
      <p className="text-sm text-muted-foreground">Complete all pillars to see full results</p>

      {/* Overall scores */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-lg p-6 text-center">
          <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Overall Score</p>
          <p className={`text-5xl font-bold font-mono ${getScoreColor(totalScore, maxTotal)}`}>
            {totalScore}
          </p>
          <p className="text-sm text-muted-foreground mt-1">out of {maxTotal}</p>
          <p className={`text-sm font-semibold mt-2 ${getScoreColor(totalScore, maxTotal)}`}>
            {getScoreLabel(totalScore, maxTotal)}
          </p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6 text-center">
          <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Average Per Pillar</p>
          <p className={`text-5xl font-bold font-mono ${getScoreColor(avgScore, 100)}`}>
            {avgScore}
          </p>
          <p className="text-sm text-muted-foreground mt-1">out of 100</p>
          <p className={`text-sm font-semibold mt-2 ${getScoreColor(avgScore, 100)}`}>
            {getScoreLabel(avgScore, 100)}
          </p>
        </div>
      </div>

      {/* Pillar Breakdown */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
          Pillar Breakdown
        </h3>
        <div className="space-y-4">
          {pillars.map((p) => {
            const score = getPillarScore(p.id);
            return (
              <div key={p.id}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-foreground">{p.title}</span>
                  <span className={`font-mono font-semibold ${getScoreColor(score, p.maxScore)}`}>
                    {score}
                  </span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${getScoreBgColor(score, p.maxScore)}`}
                    style={{ width: `${(score / p.maxScore) * 100}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Revenue Gap Table */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
          Estimated Annual Revenue Gap
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 text-muted-foreground font-medium">Pillar</th>
                <th className="text-right py-2 text-muted-foreground font-medium">Est. Annual Gap</th>
              </tr>
            </thead>
            <tbody>
              {pillars.map((p) => (
                <tr key={p.id} className="border-b border-border/50">
                  <td className="py-2.5 text-foreground">{p.title}</td>
                  <td className="py-2.5 text-right font-mono text-primary">
                    ${Math.round(gaps[p.id]).toLocaleString()}
                  </td>
                </tr>
              ))}
              <tr className="font-semibold">
                <td className="py-3 text-foreground">Total Estimated Annual Revenue Gap</td>
                <td className="py-3 text-right font-mono text-primary text-lg">
                  ${Math.round(totalGap).toLocaleString()}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Priority Matrix */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
          Priority Matrix (Lowest Scores First)
        </h3>
        <div className="space-y-3">
          {sorted.map((p, i) => {
            const score = getPillarScore(p.id);
            return (
              <div key={p.id} className="flex items-center gap-3">
                <span className="text-xs font-mono text-muted-foreground w-5">{i + 1}.</span>
                <span className="text-sm text-foreground flex-1">{p.title}</span>
                <span className={`text-sm font-mono font-semibold ${getScoreColor(score, p.maxScore)}`}>
                  {score}/{p.maxScore}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded ${
                  score <= 25 ? "bg-destructive/20 text-destructive" :
                  score <= 50 ? "bg-warning/20 text-warning" :
                  score <= 75 ? "bg-success/20 text-success" :
                  "bg-info/20 text-info"
                }`}>
                  {getScoreLabel(score, p.maxScore)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Send to GHL */}
      <div className="bg-card border border-border rounded-lg p-6 text-center space-y-3">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Sync to CRM
        </h3>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button disabled={sending || sent} className="gap-2">
              <Send className="w-4 h-4" />
              {sent ? "Sent to GHL ✓" : sending ? "Sending..." : "Send to GHL"}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Send audit data to GHL?</AlertDialogTitle>
              <AlertDialogDescription>
                This will send {prospectInfo.firstName} {prospectInfo.lastName}'s audit scores, revenue gap analysis, and all notes to your GHL CRM via webhook.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleSendToGHL}>Send to GHL</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* CTA - Book a Call */}
      <div className="bg-sidebar border border-primary/30 rounded-lg p-6 text-center space-y-3">
        <h3 className="text-lg font-bold text-primary">Ready to Close the Revenue Gap?</h3>
        <p className="text-sm text-muted-foreground">
          Book a free strategy call to see how AI can recover your lost revenue.
        </p>
        <div className="w-full mt-4 rounded-md overflow-hidden border border-border">
          <iframe
            src="https://api.leadconnectorhq.com/widget/booking/vnj6NoD40AAkqQSZPae5"
            style={{ width: "100%", height: "600px", border: "none" }}
            title="Book a Strategy Call"
            loading="lazy"
          />
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-xs text-muted-foreground pt-1">
          <a href="tel:4804480792" className="hover:text-primary transition-colors">📞 480-448-0792</a>
          <a href="mailto:Silvio@RevenueCapture.ai" className="hover:text-primary transition-colors">✉️ Silvio@RevenueCapture.ai</a>
        </div>
      </div>
    </div>
  );
}
