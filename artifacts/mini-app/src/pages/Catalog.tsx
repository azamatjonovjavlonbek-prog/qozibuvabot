import { useState } from "react";
import type { Service } from "@/App";
import {
  FileText, MessageCircle, Bot, ChevronRight, ChevronLeft,
  AlertTriangle, Baby, Home as HomeIcon, Briefcase, Wallet, Landmark, MoreHorizontal,
  Phone, CreditCard, Zap, Sparkles, Timer, Clock,
} from "lucide-react";

interface Props {
  onSelect: (svc: Service) => void;
  onBack: () => void;
}

const CATEGORIES = [
  { id: "divorce",  icon: AlertTriangle, label: "Nikohdan ajratish arizasi",    color: "#F87171", bg: "rgba(248,113,113,0.12)" },
  { id: "aliment",  icon: Baby,          label: "Aliment to'lash arizasi",      color: "#2AABEE", bg: "rgba(42,171,238,0.12)" },
  { id: "property", icon: HomeIcon,      label: "Mulkni bo'lish arizasi",       color: "#4CAF84", bg: "rgba(76,175,132,0.12)" },
  { id: "custody",  icon: Briefcase,     label: "Farzand vasiyligini aniqlash", color: "#FBB924", bg: "rgba(251,185,36,0.12)" },
  { id: "debt",     icon: Wallet,        label: "Qarz undirish arizasi",        color: "#A855F7", bg: "rgba(168,85,247,0.12)" },
  { id: "labor",    icon: Landmark,      label: "Mehnat nizosi arizasi",        color: "#FB923C", bg: "rgba(251,146,60,0.12)" },
  { id: "other",    icon: MoreHorizontal,label: "Boshqa ariza",                 color: "#8B9EB5", bg: "rgba(139,158,181,0.12)" },
];

const TABS = [
  { id: "shablon",      icon: FileText,      label: "Ariza" },
  { id: "consultation", icon: MessageCircle, label: "Konsultatsiya" },
  { id: "ai",           icon: Bot,           label: "AI Kredit" },
] as const;

export function Catalog({ onSelect, onBack }: Props) {
  const [tab, setTab] = useState<"shablon" | "consultation" | "ai">("shablon");

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ background: "var(--tg-header)", padding: "16px 16px 0", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
          <div onClick={onBack} style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <ChevronLeft size={20} strokeWidth={2} />
          </div>
          <div style={{ fontSize: 17, fontWeight: 700 }}>Xizmatlar</div>
        </div>
        <div style={{ display: "flex", borderBottom: "1px solid var(--tg-border)" }}>
          {TABS.map(({ id, icon: Icon, label }) => (
            <div key={id} onClick={() => setTab(id)} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 5, padding: "9px 4px", fontSize: 12, fontWeight: tab === id ? 700 : 400, color: tab === id ? "var(--tg-blue)" : "var(--tg-muted)", borderBottom: tab === id ? "2px solid var(--tg-blue)" : "2px solid transparent", cursor: "pointer", marginBottom: -1 }}>
              <Icon size={14} strokeWidth={tab === id ? 2.2 : 1.6} />{label}
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: "14px 16px 24px", flex: 1 }}>

        {/* ARIZA */}
        {tab === "shablon" && (
          <>
            <div style={{ background: "rgba(42,171,238,0.08)", border: "1px solid rgba(42,171,238,0.2)", borderRadius: 14, padding: "12px 15px", marginBottom: 14, display: "flex", gap: 12, alignItems: "center" }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(42,171,238,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Zap size={18} color="#2AABEE" strokeWidth={1.8} />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>Ariza shabloni</div>
                <div style={{ fontSize: 12, color: "var(--tg-muted)" }}>Word formatda • Darhol yuboriladi • <b style={{ color: "#2AABEE" }}>15 000 so'm</b></div>
              </div>
            </div>
            {CATEGORIES.map(({ id, icon: Icon, label, color, bg }) => (
              <div key={id} onClick={() => onSelect({ type: "shablon", catId: id, label })} style={{ background: "var(--tg-card)", borderRadius: 14, padding: "14px 15px", marginBottom: 8, display: "flex", alignItems: "center", gap: 13, cursor: "pointer", border: "1px solid var(--tg-border)", active: undefined } as any}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon size={20} color={color} strokeWidth={1.8} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 500, lineHeight: 1.3 }}>{label}</div>
                  <div style={{ fontSize: 11, color: "var(--tg-muted)", marginTop: 2 }}>Word fayl • Darhol yuboriladi</div>
                </div>
                <ChevronRight size={18} color="var(--tg-muted)" strokeWidth={1.6} />
              </div>
            ))}
          </>
        )}

        {/* KONSULTATSIYA */}
        {tab === "consultation" && (
          <div style={{ background: "var(--tg-card)", borderRadius: 18, padding: 20 }}>
            <div style={{ width: 64, height: 64, borderRadius: 18, background: "rgba(76,175,132,0.15)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
              <Phone size={28} color="#4CAF84" strokeWidth={1.6} />
            </div>
            <div style={{ fontSize: 17, fontWeight: 700, textAlign: "center", marginBottom: 8 }}>Yuridik konsultatsiya</div>
            <div style={{ fontSize: 13, color: "var(--tg-muted)", textAlign: "center", lineHeight: 1.6, marginBottom: 18 }}>
              Professional yurist bilan telefon orqali maslahat. To'lovdan keyin telefon raqam yuboriladi.
            </div>
            <div style={{ background: "rgba(76,175,132,0.08)", border: "1px solid rgba(76,175,132,0.18)", borderRadius: 14, padding: 14, marginBottom: 18 }}>
              {[
                { icon: Clock,  label: "Ish vaqti", val: "10:00 – 20:00" },
                { icon: Timer,  label: "Muddati",   val: "30 daqiqa" },
                { icon: CreditCard, label: "Narx",  val: "99 000 so'm" },
              ].map(({ icon: Icon, label, val }) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid var(--tg-border)" }}>
                  <span style={{ fontSize: 13, color: "var(--tg-muted)", display: "flex", alignItems: "center", gap: 7 }}><Icon size={14} strokeWidth={1.7} />{label}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#4CAF84" }}>{val}</span>
                </div>
              ))}
            </div>
            <button onClick={() => onSelect({ type: "consultation" })} style={{ width: "100%", background: "linear-gradient(135deg,#4CAF84,#2E7D52)", color: "#fff", border: "none", borderRadius: 13, padding: "14px 0", fontSize: 15, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <CreditCard size={17} /> Buyurtma berish
            </button>
          </div>
        )}

        {/* AI */}
        {tab === "ai" && (
          <div style={{ background: "linear-gradient(160deg,#2D1B69,#1A1040)", borderRadius: 18, padding: 20, border: "1px solid rgba(147,51,234,0.25)" }}>
            <div style={{ width: 64, height: 64, borderRadius: 18, background: "rgba(168,85,247,0.2)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
              <Bot size={28} color="#A855F7" strokeWidth={1.6} />
            </div>
            <div style={{ fontSize: 17, fontWeight: 700, textAlign: "center", marginBottom: 8 }}>Qozibuva AI</div>
            <div style={{ fontSize: 13, color: "var(--tg-muted)", textAlign: "center", lineHeight: 1.6, marginBottom: 18 }}>
              Sun'iy intellekt yordamida huquqiy savollaringizga javob oling
            </div>
            <div style={{ display: "flex", gap: 10, marginBottom: 18 }}>
              <div style={{ flex: 1, background: "rgba(168,85,247,0.12)", borderRadius: 14, padding: 14, textAlign: "center", border: "1px solid rgba(168,85,247,0.2)" }}>
                <Sparkles size={22} color="#A855F7" style={{ margin: "0 auto 6px" }} />
                <div style={{ fontSize: 11, color: "var(--tg-muted)", marginBottom: 4 }}>+5 kredit</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: "#A855F7" }}>5</div>
              </div>
              <div style={{ flex: 1, background: "rgba(42,171,238,0.08)", borderRadius: 14, padding: 14, textAlign: "center", border: "1px solid rgba(42,171,238,0.15)" }}>
                <Zap size={22} color="#2AABEE" style={{ margin: "0 auto 6px" }} />
                <div style={{ fontSize: 11, color: "var(--tg-muted)", marginBottom: 2 }}>Narx</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: "#2AABEE" }}>50 000</div>
                <div style={{ fontSize: 10, color: "var(--tg-muted)" }}>so'm</div>
              </div>
            </div>
            <button onClick={() => onSelect({ type: "ai_credits" })} style={{ width: "100%", background: "linear-gradient(135deg,#7C3AED,#A855F7)", color: "#fff", border: "none", borderRadius: 13, padding: "14px 0", fontSize: 15, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <CreditCard size={17} /> Kredit sotib olish
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
