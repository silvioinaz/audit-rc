import { useState } from "react";
import { Pillar, getScoreColor, getScoreBgColor } from "@/lib/auditData";
import { Textarea } from "@/components/ui/textarea";
import { ChevronDown, ChevronRight, Zap } from "lucide-react";

type Props = {
  pillar: Pillar;
  answers: Record<string, number | null>;
  onAnswer: (questionId: string, points: number) => void;
  note: string;
  onNoteChange: (note: string) => void;
  score: number;
};

export default function PillarTab({ pillar, answers, onAnswer, note, onNoteChange, score }: Props) {
  const [statsOpen, setStatsOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-primary">{pillar.title}</h2>
          <p className="text-sm text-muted-foreground mt-1">{pillar.description}</p>
        </div>
        <div className="text-right shrink-0 ml-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Pillar Score</p>
          <p className={`text-3xl font-bold font-mono ${getScoreColor(score, pillar.maxScore)}`}>
            {score}
            <span className="text-sm text-muted-foreground">/{pillar.maxScore}</span>
          </p>
        </div>
      </div>

      {/* Stats & Ammo */}
      <button
        onClick={() => setStatsOpen(!statsOpen)}
        className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
      >
        {statsOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        <Zap className="w-4 h-4" />
        Stats & Ammo for This Pillar
      </button>

      {statsOpen && (
        <div className="bg-card border border-border rounded-lg p-5 space-y-4">
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Primary Stat</p>
            <p className="text-sm font-medium text-foreground">{pillar.stats.primaryStat}</p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Key Stats</p>
            <ul className="space-y-1">
              {pillar.stats.keyStats.map((s, i) => (
                <li key={i} className="text-sm text-secondary-foreground flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  {s}
                </li>
              ))}
            </ul>
          </div>

          {pillar.stats.annualImpact && (
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Annual Impact</p>
              <p className="text-sm font-medium text-primary">{pillar.stats.annualImpact}</p>
            </div>
          )}

          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Reality Check</p>
            <ul className="space-y-1">
              {pillar.stats.realityCheck.map((s, i) => (
                <li key={i} className="text-sm text-secondary-foreground flex items-start gap-2">
                  <span className="text-destructive mt-0.5">•</span>
                  {s}
                </li>
              ))}
            </ul>
          </div>

          <p className="text-xs text-muted-foreground italic">Source: {pillar.stats.source}</p>
        </div>
      )}

      {/* Questions */}
      <div className="space-y-6">
        {pillar.questions.map((q, qi) => (
          <div key={q.id} className="space-y-3">
            <p className="text-sm font-medium text-foreground">
              <span className="text-primary mr-1">Q{qi + 1}.</span> {q.text}
            </p>
            <div className="space-y-2 ml-1">
              {q.options.map((opt) => {
                const selected = answers[q.id] === opt.points;
                return (
                  <button
                    key={opt.label}
                    onClick={() => onAnswer(q.id, opt.points)}
                    className={`w-full text-left px-4 py-2.5 rounded-md text-sm transition-all border ${
                      selected
                        ? "border-primary bg-primary/10 text-foreground"
                        : "border-border bg-secondary/30 text-secondary-foreground hover:border-muted-foreground/40"
                    }`}
                  >
                    <span className="flex items-center justify-between">
                      <span>{opt.label}</span>
                      <span className={`text-xs font-mono ml-2 shrink-0 ${selected ? "text-primary" : "text-muted-foreground"}`}>
                        {opt.points} pts
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Score bar */}
      <div className="mt-4">
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
          <span>Progress</span>
          <span>{score}/{pillar.maxScore}</span>
        </div>
        <div className="h-2 bg-secondary rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${getScoreBgColor(score, pillar.maxScore)}`}
            style={{ width: `${(score / pillar.maxScore) * 100}%` }}
          />
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          General Notes — {pillar.title}
        </p>
        <Textarea
          placeholder={`Notes about ${pillar.title.toLowerCase()}...`}
          value={note}
          onChange={(e) => onNoteChange(e.target.value)}
          className="min-h-[80px]"
        />
      </div>
    </div>
  );
}
