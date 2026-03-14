import jsPDF from "jspdf";
import { pillars, getScoreLabel, ProspectInfo } from "@/lib/auditData";

type ReportData = {
  prospectInfo: ProspectInfo;
  answers: Record<string, number | null>;
  notes: Record<string, string>;
  getPillarScore: (id: string) => number;
  getTotalScore: () => number;
};

export async function generateAuditPDF(data: ReportData) {
  const { prospectInfo, answers, notes, getPillarScore, getTotalScore } = data;
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const W = doc.internal.pageSize.getWidth();
  const margin = 16;
  const contentW = W - margin * 2;
  let y = 16;

  const addPage = () => { doc.addPage(); y = 16; };
  const checkPage = (need: number) => { if (y + need > 275) addPage(); };

  // Header
  doc.setFillColor(23, 30, 46);
  doc.rect(0, 0, W, 38, "F");
  doc.setTextColor(234, 179, 48);
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("RevenueCapture.ai", margin, 18);
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text("4-Pillar AI Lead Audit Report", margin, 26);
  doc.setFontSize(9);
  doc.setTextColor(160, 170, 190);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, margin, 33);
  y = 46;

  // Prospect Info
  doc.setTextColor(234, 179, 48);
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text("Prospect Information", margin, y);
  y += 8;

  doc.setTextColor(60, 60, 70);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");

  const infoRows = [
    ["Company", prospectInfo.companyName],
    ["Contact", `${prospectInfo.firstName} ${prospectInfo.lastName}`.trim()],
    ["Phone", prospectInfo.phone],
    ["Email", prospectInfo.email],
    ["Website", prospectInfo.website],
    ["Industry", prospectInfo.industry],
    ["Audit Date", prospectInfo.auditDate],
    ["Google Rating", prospectInfo.googleRating],
    ["Monthly Revenue", prospectInfo.monthlyRevenue ? `$${prospectInfo.monthlyRevenue}` : "—"],
    ["Avg Job Value", prospectInfo.avgJobValue ? `$${prospectInfo.avgJobValue}` : "—"],
    ["Missed Calls/Mo", prospectInfo.missedCallsMonth || "—"],
    ["Customer DB Size", prospectInfo.customerDbSize || "—"],
  ].filter(([, v]) => v && v !== "—");

  infoRows.forEach(([label, value]) => {
    doc.setFont("helvetica", "bold");
    doc.setTextColor(100, 100, 110);
    doc.text(`${label}:`, margin, y);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(40, 40, 50);
    doc.text(value || "—", margin + 38, y);
    y += 5;
  });

  y += 6;

  // Overall Score
  const totalScore = getTotalScore();
  const maxTotal = pillars.reduce((s, p) => s + p.maxScore, 0);

  checkPage(30);
  doc.setFillColor(240, 243, 248);
  doc.roundedRect(margin, y, contentW, 24, 3, 3, "F");
  doc.setTextColor(234, 179, 48);
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text("Overall Score", margin + 6, y + 10);
  doc.setFontSize(22);
  doc.text(`${totalScore} / ${maxTotal}`, margin + 6, y + 20);
  doc.setFontSize(11);
  doc.setTextColor(100, 100, 110);
  doc.text(getScoreLabel(totalScore, maxTotal), margin + 70, y + 20);
  y += 32;

  // Pillar Breakdown
  pillars.forEach((pillar) => {
    const score = getPillarScore(pillar.id);
    const pct = (score / pillar.maxScore) * 100;

    checkPage(50);

    doc.setTextColor(234, 179, 48);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(`${pillar.title}`, margin, y);
    doc.setTextColor(100, 100, 110);
    doc.setFontSize(10);
    doc.text(`${score}/${pillar.maxScore} — ${getScoreLabel(score, pillar.maxScore)}`, margin + contentW - 40, y, { align: "right" });
    y += 5;

    // Score bar
    doc.setFillColor(220, 225, 235);
    doc.roundedRect(margin, y, contentW, 3, 1.5, 1.5, "F");
    const barColor = pct >= 80 ? [14, 165, 233] : pct >= 60 ? [34, 197, 94] : pct >= 40 ? [245, 158, 11] : [239, 68, 68];
    doc.setFillColor(barColor[0], barColor[1], barColor[2]);
    if (pct > 0) doc.roundedRect(margin, y, contentW * (pct / 100), 3, 1.5, 1.5, "F");
    y += 7;

    // Question answers
    doc.setFontSize(8);
    pillar.questions.forEach((q, qi) => {
      checkPage(12);
      const selectedPoints = answers[q.id];
      const selectedOpt = q.options.find((o) => o.points === selectedPoints);

      doc.setFont("helvetica", "bold");
      doc.setTextColor(60, 60, 70);
      doc.text(`Q${qi + 1}. ${q.text}`, margin + 2, y);
      y += 4;

      doc.setFont("helvetica", "normal");
      doc.setTextColor(100, 100, 110);
      const ansText = selectedOpt ? `${selectedOpt.label} (${selectedOpt.points} pts)` : "Not answered";
      const lines = doc.splitTextToSize(ansText, contentW - 10);
      doc.text(lines, margin + 6, y);
      y += lines.length * 3.5 + 2;
    });

    // Notes
    const note = notes[pillar.id];
    if (note) {
      checkPage(12);
      doc.setFont("helvetica", "italic");
      doc.setTextColor(130, 130, 140);
      doc.text("Notes:", margin + 2, y);
      y += 4;
      const noteLines = doc.splitTextToSize(note, contentW - 10);
      doc.text(noteLines, margin + 6, y);
      y += noteLines.length * 3.5;
    }

    y += 8;
  });

  // Revenue Gap
  checkPage(60);
  doc.setTextColor(234, 179, 48);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Estimated Annual Revenue Gap", margin, y);
  y += 7;

  const parseNum = (v: string) => parseFloat(v.replace(/[^0-9.\-]/g, "")) || 0;
  const revenue = parseNum(prospectInfo.monthlyRevenue);
  const avgJob = parseNum(prospectInfo.avgJobValue);
  const missedCalls = parseNum(prospectInfo.missedCallsMonth);
  const dbSize = parseNum(prospectInfo.customerDbSize);

  const gaps: Record<string, number> = {
    "voice-ai": missedCalls * avgJob * 12 * 0.3,
    "conversational-ai": revenue * 12 * 0.15,
    reputation: revenue * 12 * 0.07,
    database: dbSize * avgJob * 0.2 * 0.25,
  };
  const totalGap = Object.values(gaps).reduce((s, v) => s + v, 0);

  doc.setFontSize(9);
  pillars.forEach((p) => {
    doc.setFont("helvetica", "normal");
    doc.setTextColor(60, 60, 70);
    doc.text(p.title, margin + 2, y);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(234, 179, 48);
    doc.text(`$${Math.round(gaps[p.id]).toLocaleString()}`, margin + contentW - 4, y, { align: "right" });
    y += 5;
  });

  doc.setDrawColor(200, 200, 210);
  doc.line(margin, y, margin + contentW, y);
  y += 5;
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(40, 40, 50);
  doc.text("Total Estimated Gap", margin + 2, y);
  doc.setTextColor(234, 179, 48);
  doc.text(`$${Math.round(totalGap).toLocaleString()}`, margin + contentW - 4, y, { align: "right" });

  // CTA / Next Steps
  y += 10;
  checkPage(40);
  doc.setFillColor(23, 30, 46);
  doc.roundedRect(margin, y, contentW, 32, 3, 3, "F");
  doc.setTextColor(234, 179, 48);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Ready to Close the Revenue Gap?", margin + 6, y + 9);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(220, 225, 235);
  doc.text("Book a free strategy call to see how AI can recover your lost revenue.", margin + 6, y + 16);
  doc.setTextColor(200, 210, 225);
  doc.setFontSize(8);
  doc.text("Phone: 480-448-0792  |  Email: Silvio@RevenueCapture.ai", margin + 6, y + 22);
  doc.setTextColor(130, 180, 255);
  doc.text("Book Online: https://api.leadconnectorhq.com/widget/booking/vnj6NoD40AAkqQSZPae5", margin + 6, y + 27);
  y += 38;

  // Footer on every page
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(7);
    doc.setTextColor(160, 160, 170);
    doc.text(`RevenueCapture.ai  |  480-448-0792  |  Silvio@RevenueCapture.ai`, margin, 290);
    doc.text(`Page ${i} of ${pageCount}`, W - margin, 290, { align: "right" });
  }

  const filename = prospectInfo.companyName
    ? `RevenueCapture_Audit_${prospectInfo.companyName.replace(/\s+/g, "_")}.pdf`
    : "RevenueCapture_Audit_Report.pdf";

  doc.save(filename);
}
