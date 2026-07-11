import { FileText, MessageCircle, Bot, Scale, Landmark, Calculator, FileSearch, ChevronRight, ClipboardList } from "lucide-react";
import type { Page } from "@/App";
import { tgUser } from "@/lib/tg";

interface Props { onNavigate: (page: Page) => void; }

const SERVICES: { icon: typeof FileText; label: string; sub: string; color: string; bg: string; page: Page }[] = [
  { icon: FileText,     label: "Ariza shablonlari",    sub: "29 000 so'm",    color: "#2AABEE", bg: "rgba(42,171,238,0.14)",   page: "ariza" },
  { icon: MessageCircle,label: "Konsultatsiya",        sub: "99 000 so'm",    color: "#4CAF84", bg: "rgba(76,175,132,0.14)",   page: "consultation" },
  { icon: Bot,          label: "Qozibuva AI",          sub: "50 000 so'm",    color: "#A855F7", bg: "rgba(168,85,247,0.14)",   page: "ai" },
  { icon: Scale,        label: "Professional ariza",   sub: "199 000 so'mdan",color: "#FB923C", bg: "rgba(251,146,60,0.14)",   page: "professional" },
  { icon: Landmark,     label: "Sud manzillari",       sub: "Bepul",          color: "#2AABEE", bg: "rgba(42,171,238,0.10)",   page: "courts" },
  { icon: Calculator,   label: "Aliment kalkulyatori", sub: "Bepul",          color: "#FBB924", bg: "rgba(251,185,36,0.10)",   page: "aliment_calc" },
  { icon: FileSearch,   label: "Hujjat tahlili (AI)",  sub: "AI kredit bilan",color: "#A855F7", bg: "rgba(168,85,247,0.10)",   page: "tahlil" },
];

export function Home({ onNavigate }: Props) {
  const name = tgUser?.first_name ?? "Foydalanuvchi";

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(180deg,#1A3A52,#1E2D40)", padding: "20px 16px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 14, background: "linear-gradient(135deg,#2AABEE,#1A8FD1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Scale size={22} color="#fff" strokeWidth={2} />
            </div>
            <div>
              <div style={{ fontSize: 17, fontWeight: 700 }}>Qozibuva</div>
              <div style={{ fontSize: 12, color: "var(--tg-muted)" }}>Huquqiy xizmatlar platformasi</div>
            </div>
          </div>
          <div
            onClick={() => onNavigate("my_requests")}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, cursor: "pointer", padding: "6px 10px", borderRadius: 12, background: "rgba(251,146,60,0.15)", border: "1px solid rgba(251,146,60,0.25)" }}
          >
            <ClipboardList size={18} color="#FB923C" strokeWidth={1.8} />
            <span style={{ fontSize: 9, fontWeight: 700, color: "#FB923C", lineHeight: 1 }}>Arizalarim</span>
          </div>
        </div>
      </div>

      {/* Welcome banner */}
      <div style={{ margin: "14px 16px 0", background: "linear-gradient(135deg,#2AABEE,#1A8FD1)", borderRadius: 18, padding: "18px 20px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -24, right: -24, width: 110, height: 110, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", marginBottom: 3 }}>Xush kelibsiz,</div>
        <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 6 }}>{name} 👋</div>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.85)" }}>Kerakli xizmatni tanlang</div>
      </div>

      {/* Services */}
      <div style={{ margin: "16px 16px 0" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "var(--tg-muted)", marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.8 }}>Barcha xizmatlar</div>
        {SERVICES.map(({ icon: Icon, label, sub, color, bg, page }) => (
          <div key={label} onClick={() => onNavigate(page)}
            style={{ background: "var(--tg-card)", borderRadius: 14, padding: "13px 14px", marginBottom: 8, display: "flex", alignItems: "center", gap: 13, cursor: "pointer", border: "1px solid var(--tg-border)", transition: "opacity 0.15s" }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Icon size={20} color={color} strokeWidth={1.8} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.3 }}>{label}</div>
              <div style={{ fontSize: 12, color, fontWeight: 600, marginTop: 2 }}>{sub}</div>
            </div>
            <ChevronRight size={18} color="var(--tg-muted)" strokeWidth={1.6} />
          </div>
        ))}
      </div>

      {/* My Requests shortcut */}
      <div style={{ margin: "8px 16px 24px" }}>
        <div
          onClick={() => onNavigate("my_requests")}
          style={{ background: "linear-gradient(135deg,rgba(251,146,60,0.12),rgba(194,65,12,0.08))", borderRadius: 14, padding: "13px 16px", display: "flex", alignItems: "center", gap: 13, cursor: "pointer", border: "1px solid rgba(251,146,60,0.2)" }}
        >
          <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(251,146,60,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <ClipboardList size={20} color="#FB923C" strokeWidth={1.8} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.3 }}>Mening arizalarim</div>
            <div style={{ fontSize: 12, color: "#FB923C", fontWeight: 600, marginTop: 2 }}>Professional arizalar tarixi</div>
          </div>
          <ChevronRight size={18} color="#FB923C" strokeWidth={1.6} />
        </div>
      </div>
    </div>
  );
}
