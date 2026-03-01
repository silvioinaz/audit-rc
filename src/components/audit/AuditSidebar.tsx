import { Phone, MessageSquare, Star, Database, User, BarChart3 } from "lucide-react";
import { pillars, getScoreColor } from "@/lib/auditData";

type Props = {
  activeTab: string;
  onTabChange: (tab: string) => void;
  getPillarScore: (id: string) => number;
};

const tabIcons: Record<string, React.ReactNode> = {
  "voice-ai": <Phone className="w-4 h-4" />,
  "conversational-ai": <MessageSquare className="w-4 h-4" />,
  reputation: <Star className="w-4 h-4" />,
  database: <Database className="w-4 h-4" />,
};

export default function AuditSidebar({ activeTab, onTabChange, getPillarScore }: Props) {
  return (
    <aside className="w-56 min-h-screen bg-sidebar border-r border-sidebar-border flex flex-col shrink-0">
      <div className="p-4 border-b border-sidebar-border">
        <h1 className="text-sm font-bold text-primary tracking-wide">
          RevenueCapture.ai
        </h1>
        <p className="text-xs text-sidebar-foreground mt-0.5">4-Pillar AI Lead Audit</p>
      </div>

      <nav className="flex-1 py-2">
        <SidebarItem
          icon={<User className="w-4 h-4" />}
          label="Prospect Info"
          active={activeTab === "prospect"}
          onClick={() => onTabChange("prospect")}
        />

        {pillars.map((p) => {
          const score = getPillarScore(p.id);
          return (
            <SidebarItem
              key={p.id}
              icon={tabIcons[p.id]}
              label={p.shortTitle}
              active={activeTab === p.id}
              onClick={() => onTabChange(p.id)}
              badge={score}
              badgeColor={getScoreColor(score, p.maxScore)}
            />
          );
        })}

        <SidebarItem
          icon={<BarChart3 className="w-4 h-4" />}
          label="Results"
          active={activeTab === "results"}
          onClick={() => onTabChange("results")}
        />
      </nav>
    </aside>
  );
}

function SidebarItem({
  icon,
  label,
  active,
  onClick,
  badge,
  badgeColor,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
  badge?: number;
  badgeColor?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
        active
          ? "bg-sidebar-accent text-sidebar-accent-foreground border-r-2 border-primary"
          : "text-sidebar-foreground hover:bg-sidebar-accent/50"
      }`}
    >
      {icon}
      <span className="flex-1 text-left">{label}</span>
      {badge !== undefined && (
        <span className={`text-xs font-mono font-medium ${badgeColor}`}>{badge}</span>
      )}
    </button>
  );
}
