import { useAuditState } from "@/hooks/useAuditState";
import AuditSidebar from "@/components/audit/AuditSidebar";
import ProspectInfoTab from "@/components/audit/ProspectInfoTab";
import PillarTab from "@/components/audit/PillarTab";
import ResultsTab from "@/components/audit/ResultsTab";
import { pillars } from "@/lib/auditData";
import { generateAuditPDF } from "@/lib/generateReport";
import { Button } from "@/components/ui/button";
import { FileText, RotateCcw } from "lucide-react";
import { useState } from "react";

const Index = () => {
  const {
    prospectInfo,
    answers,
    notes,
    activeTab,
    setProspectInfo,
    setAnswer,
    setNote,
    setActiveTab,
    getPillarScore,
    getTotalScore,
    resetAudit,
  } = useAuditState();

  const activePillar = pillars.find((p) => p.id === activeTab);
  const [generating, setGenerating] = useState(false);

  const handleGenerateReport = async () => {
    setGenerating(true);
    try {
      await generateAuditPDF({ prospectInfo, answers, notes, getPillarScore, getTotalScore });
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <AuditSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        getPillarScore={getPillarScore}
      />

      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <header className="h-12 border-b border-border flex items-center justify-between px-6 bg-card shrink-0">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="inline-block w-2 h-2 rounded-full bg-success" />
            Saved
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleGenerateReport}
              disabled={generating}
              className="gap-1.5"
            >
              <FileText className="w-3.5 h-3.5" />
              {generating ? "Generating..." : "Generate Report"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={resetAudit}
              className="gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              New Audit
            </Button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 max-w-4xl">
          {activeTab === "prospect" && (
            <ProspectInfoTab info={prospectInfo} onChange={setProspectInfo} />
          )}

          {activePillar && (
            <PillarTab
              pillar={activePillar}
              answers={answers}
              onAnswer={setAnswer}
              note={notes[activePillar.id] || ""}
              onNoteChange={(n) => setNote(activePillar.id, n)}
              score={getPillarScore(activePillar.id)}
            />
          )}

          {activeTab === "results" && (
            <ResultsTab
              getPillarScore={getPillarScore}
              getTotalScore={getTotalScore}
              prospectInfo={prospectInfo}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default Index;
