import { useState, useCallback, useEffect, useRef } from "react";
import { ProspectInfo, pillars } from "@/lib/auditData";
import { supabase } from "@/integrations/supabase/client";

type AuditState = {
  id: string | null;
  prospectInfo: ProspectInfo;
  answers: Record<string, number | null>;
  notes: Record<string, string>;
  activeTab: string;
  saving: boolean;
  lastSaved: Date | null;
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

const defaultState: AuditState = {
  id: null,
  prospectInfo: defaultProspect,
  answers: {},
  notes: {},
  activeTab: "prospect",
  saving: false,
  lastSaved: null,
};

export function useAuditState(auditId?: string) {
  const [state, setState] = useState<AuditState>(defaultState);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isLoaded = useRef(false);

  // Load audit from database if auditId provided
  useEffect(() => {
    if (!auditId) {
      isLoaded.current = true;
      return;
    }
    
    (async () => {
      const { data, error } = await supabase
        .from("audits")
        .select("*")
        .eq("id", auditId)
        .single();

      if (data && !error) {
        setState({
          id: data.id,
          prospectInfo: {
            firstName: data.prospect_first_name || "",
            lastName: data.prospect_last_name || "",
            companyName: data.prospect_company || "",
            phone: data.prospect_phone || "",
            email: data.prospect_email || "",
            website: data.prospect_website || "",
            industry: data.prospect_industry || "",
            auditDate: data.audit_date || "",
            googleRating: data.google_rating || "",
            preCallNotes: data.pre_call_notes || "",
            monthlyRevenue: data.monthly_revenue || "",
            avgJobValue: data.avg_job_value || "",
            customerDbSize: data.customer_db_size || "",
            missedCallsMonth: data.missed_calls_month || "",
            monthlyLeads: data.monthly_leads || "",
            monthlyVisitors: data.monthly_visitors || "",
            conversionRate: data.conversion_rate || "",
          },
          answers: (data.answers as Record<string, number | null>) || {},
          notes: (data.notes as Record<string, string>) || {},
          activeTab: "prospect",
          saving: false,
          lastSaved: new Date(data.updated_at),
        });
      }
      isLoaded.current = true;
    })();
  }, [auditId]);

  // Auto-save to database with debounce
  const saveToDb = useCallback(async (s: AuditState) => {
    const totalScore = pillars.reduce((sum, p) => {
      return sum + p.questions.reduce((qs, q) => qs + ((s.answers[q.id] as number) ?? 0), 0);
    }, 0);

    const row = {
      prospect_first_name: s.prospectInfo.firstName,
      prospect_last_name: s.prospectInfo.lastName,
      prospect_company: s.prospectInfo.companyName,
      prospect_phone: s.prospectInfo.phone,
      prospect_email: s.prospectInfo.email,
      prospect_website: s.prospectInfo.website,
      prospect_industry: s.prospectInfo.industry,
      audit_date: s.prospectInfo.auditDate,
      google_rating: s.prospectInfo.googleRating,
      pre_call_notes: s.prospectInfo.preCallNotes,
      monthly_revenue: s.prospectInfo.monthlyRevenue,
      avg_job_value: s.prospectInfo.avgJobValue,
      customer_db_size: s.prospectInfo.customerDbSize,
      missed_calls_month: s.prospectInfo.missedCallsMonth,
      monthly_leads: s.prospectInfo.monthlyLeads,
      monthly_visitors: s.prospectInfo.monthlyVisitors,
      conversion_rate: s.prospectInfo.conversionRate,
      answers: s.answers,
      notes: s.notes,
      total_score: totalScore,
    };

    setState((prev) => ({ ...prev, saving: true }));

    if (s.id) {
      await supabase.from("audits").update(row).eq("id", s.id);
    } else {
      const { data } = await supabase.from("audits").insert(row).select("id").single();
      if (data) {
        setState((prev) => ({ ...prev, id: data.id }));
      }
    }

    setState((prev) => ({ ...prev, saving: false, lastSaved: new Date() }));
  }, []);

  // Debounced save whenever state changes (after initial load)
  useEffect(() => {
    if (!isLoaded.current) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => saveToDb(state), 1000);
    return () => { if (saveTimer.current) clearTimeout(saveTimer.current); };
  }, [state.prospectInfo, state.answers, state.notes, saveToDb]);

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
    setState((s) => ({ ...s, activeTab: tab }));
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
    setState({ ...defaultState });
    isLoaded.current = true;
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
