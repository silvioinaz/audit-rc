import { useState, useCallback, useEffect } from "react";
import { ProspectInfo, pillars } from "@/lib/auditData";

const STORAGE_KEY = "rc-audit-data";

type AuditState = {
  prospectInfo: ProspectInfo;
  answers: Record<string, number | null>;
  notes: Record<string, string>;
  activeTab: string;
};

const defaultProspect: ProspectInfo = {
  firstName: "",
  lastName: "",
  companyName: "",
  phone: "",
  email: "",
  website: "",
  industry: "",
  auditDate: new Date().toISOString().split("T")[0],
  googleRating: "",
  preCallNotes: "",
  monthlyRevenue: "",
  avgJobValue: "",
  customerDbSize: "",
  missedCallsMonth: "",
  monthlyLeads: "",
  monthlyVisitors: "",
  conversionRate: "",
};

function loadState(): AuditState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {
    prospectInfo: defaultProspect,
    answers: {},
    notes: {},
    activeTab: "prospect",
  };
}

export function useAuditState() {
  const [state, setState] = useState<AuditState>(loadState);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const setProspectInfo = useCallback((info: Partial<ProspectInfo>) => {
    setState((s) => ({ ...s, prospectInfo: { ...s.prospectInfo, ...info } }));
  }, []);

  const setAnswer = useCallback((questionId: string, points: number) => {
    setState((s) => ({ ...s, answers: { ...s.answers, [questionId]: points } }));
  }, []);

  const setNote = useCallback((pillarId: string, note: string) => {
    setState((s) => ({ ...s, notes: { ...s.notes, [pillarId]: note } }));
  }, []);

  const setActiveTab = useCallback((tab: string) => {
    setState((s) => ({ ...s, tab, activeTab: tab }));
  }, []);

  const getPillarScore = useCallback(
    (pillarId: string) => {
      const pillar = pillars.find((p) => p.id === pillarId);
      if (!pillar) return 0;
      return pillar.questions.reduce((sum, q) => sum + (state.answers[q.id] ?? 0), 0);
    },
    [state.answers]
  );

  const getTotalScore = useCallback(() => {
    return pillars.reduce((sum, p) => sum + getPillarScore(p.id), 0);
  }, [getPillarScore]);

  const resetAudit = useCallback(() => {
    setState({
      prospectInfo: defaultProspect,
      answers: {},
      notes: {},
      activeTab: "prospect",
    });
  }, []);

  return {
    ...state,
    setProspectInfo,
    setAnswer,
    setNote,
    setActiveTab,
    getPillarScore,
    getTotalScore,
    resetAudit,
  };
}
