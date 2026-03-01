import { pillars, getScoreLabel, getScoreColor, getScoreBgColor } from "@/lib/auditData";
import { ProspectInfo } from "@/lib/auditData";

type Props = {
  getPillarScore: (id: string) => number;
  getTotalScore: () => number;
  prospectInfo: ProspectInfo;
};

export default function ResultsTab({ getPillarScore, getTotalScore, prospectInfo }: Props) {
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
    </div>
  );
}
