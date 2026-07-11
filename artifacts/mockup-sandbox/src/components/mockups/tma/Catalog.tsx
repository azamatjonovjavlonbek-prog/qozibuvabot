import { useState } from "react";
import {
  FileText, MessageCircle, Bot, ChevronRight,
  Briefcase, Home, Baby, Landmark, Wallet, AlertTriangle, MoreHorizontal,
  Clock, Timer, CreditCard, Phone, Sparkles, Zap,
} from "lucide-react";

const tgBlue = "#2AABEE";
const tgDark = "#17212B";
const tgCard = "#232E3C";
const tgMuted = "#8B9EB5";
const tgText = "#F5F5F5";
const tgGreen = "#4CAF84";
const tgPurple = "#A855F7";

const CATEGORIES = [
  { id: "divorce",  icon: AlertTriangle, label: "Nikohdan ajratish arizasi",   color: "#F87171", bg: "rgba(248,113,113,0.12)" },
  { id: "aliment",  icon: Baby,          label: "Aliment to'lash arizasi",     color: tgBlue,   bg: "rgba(42,171,238,0.12)" },
  { id: "property", icon: Home,          label: "Mulkni bo'lish arizasi",      color: tgGreen,  bg: "rgba(76,175,132,0.12)" },
  { id: "custody",  icon: Briefcase,     label: "Farzand vasiyligini aniqlash",color: "#FBB924", bg: "rgba(251,185,36,0.12)" },
  { id: "debt",     icon: Wallet,        label: "Qarz undirish arizasi",       color: tgPurple, bg: "rgba(168,85,247,0.12)" },
  { id: "labor",    icon: Landmark,      label: "Mehnat nizosi arizasi",       color: "#FB923C", bg: "rgba(251,146,60,0.12)" },
  { id: "other",    icon: MoreHorizontal,label: "Boshqa ariza",                color: tgMuted,  bg: "rgba(139,158,181,0.12)" },
];

const TABS = [
  { id: "shablon",      icon: FileText,       label: "Ariza" },
  { id: "consultation", icon: MessageCircle,  label: "Konsultatsiya" },
  { id: "ai",           icon: Bot,            label: "AI" },
] as const;

export function Catalog() {
  const [tab, setTab] = useState<"shablon" | "consultation" | "ai">("shablon");

  return (
    <div style={{ background: tgDark, minHeight: "100vh", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", color: tgText, maxWidth: 390, margin: "0 auto" }}>

      {/* Header */}
      <div style={{ background: "#1A2433", padding: "18px 16px 0", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 14 }}>Xizmatlar</div>
        <div style={{ display: "flex", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          {TABS.map(({ id, icon: Icon, label }) => (
            <div key={id} onClick={() => setTab(id)} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "9px 4px", fontSize: 13, fontWeight: tab === id ? 700 : 400, color: tab === id ? tgBlue : tgMuted, borderBottom: tab === id ? `2px solid ${tgBlue}` : "2px solid transparent", cursor: "pointer", marginBottom: -1 }}>
              <Icon size={15} strokeWidth={tab === id ? 2.2 : 1.6} />
              {label}
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: "14px 16px 90px" }}>

        {/* ── SHABLON TAB ── */}
        {tab === "shablon" && (
          <>
            <div style={{ background: "rgba(42,171,238,0.08)", border: "1px solid rgba(42,171,238,0.2)", borderRadius: 14, padding: "13px 15px", marginBottom: 14, display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(42,171,238,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Zap size={18} color={tgBlue} strokeWidth={1.8} />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>Ariza shabloni</div>
                <div style={{ fontSize: 12, color: tgMuted }}>Word formatda • Darhol yuboriladi • <span style={{ color: tgBlue, fontWeight: 600 }}>15 000 so'm</span></div>
              </div>
            </div>
            {CATEGORIES.map(({ id, icon: Icon, label, color, bg }) => (
              <div key={id} style={{ background: tgCard, borderRadius: 14, padding: "14px 15px", marginBottom: 8, display: "flex", alignItems: "center", gap: 13, cursor: "pointer", border: "1px solid rgba(255,255,255,0.04)" }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon size={20} color={color} strokeWidth={1.8} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 500, lineHeight: 1.3 }}>{label}</div>
                  <div style={{ fontSize: 11, color: tgMuted, marginTop: 2 }}>Word fayl • Darhol yuboriladi</div>
                </div>
                <ChevronRight size={18} color={tgMuted} strokeWidth={1.6} />
              </div>
            ))}
          </>
        )}

        {/* ── CONSULTATION TAB ── */}
        {tab === "consultation" && (
          <div style={{ background: tgCard, borderRadius: 18, padding: 20 }}>
            <div style={{ width: 64, height: 64, borderRadius: 18, background: "rgba(76,175,132,0.15)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
              <Phone size={28} color={tgGreen} strokeWidth={1.6} />
            </div>
            <div style={{ fontSize: 17, fontWeight: 700, textAlign: "center", marginBottom: 8 }}>Yuridik konsultatsiya</div>
            <div style={{ fontSize: 13, color: tgMuted, textAlign: "center", lineHeight: 1.6, marginBottom: 18 }}>Professional yurist bilan telefon orqali maslahat. To'lovdan keyin telefon raqam yuboriladi.</div>
            <div style={{ background: "rgba(76,175,132,0.08)", border: "1px solid rgba(76,175,132,0.18)", borderRadius: 14, padding: 14, marginBottom: 18 }}>
              {[
                { icon: Clock,  label: "Ish vaqti", val: "10:00 – 20:00" },
                { icon: Timer,  label: "Muddati",   val: "30 daqiqa" },
                { icon: CreditCard, label: "Narx",  val: "99 000 so'm" },
              ].map(({ icon: Icon, label, val }) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  <span style={{ fontSize: 13, color: tgMuted, display: "flex", alignItems: "center", gap: 7 }}><Icon size={14} strokeWidth={1.7} />{label}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: tgGreen }}>{val}</span>
                </div>
              ))}
            </div>
            <button style={{ width: "100%", background: `linear-gradient(135deg,${tgGreen},#2E7D52)`, color: "#fff", border: "none", borderRadius: 13, padding: "14px 0", fontSize: 15, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <CreditCard size={17} /> To'lov qilish
            </button>
          </div>
        )}

        {/* ── AI TAB ── */}
        {tab === "ai" && (
          <div style={{ background: "linear-gradient(160deg,#2D1B69,#1A1040)", borderRadius: 18, padding: 20, border: "1px solid rgba(147,51,234,0.25)" }}>
            <div style={{ width: 64, height: 64, borderRadius: 18, background: "rgba(168,85,247,0.2)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
              <Bot size={28} color={tgPurple} strokeWidth={1.6} />
            </div>
            <div style={{ fontSize: 17, fontWeight: 700, textAlign: "center", marginBottom: 8 }}>Qozibuva AI</div>
            <div style={{ fontSize: 13, color: tgMuted, textAlign: "center", lineHeight: 1.6, marginBottom: 18 }}>Sun'iy intellekt yordamida huquqiy savollaringizga javob oling</div>
            <div style={{ display: "flex", gap: 10, marginBottom: 18 }}>
              <div style={{ flex: 1, background: "rgba(168,85,247,0.12)", borderRadius: 14, padding: 14, textAlign: "center", border: "1px solid rgba(168,85,247,0.2)" }}>
                <Sparkles size={22} color={tgPurple} style={{ margin: "0 auto 6px" }} />
                <div style={{ fontSize: 11, color: tgMuted, marginBottom: 4 }}>Joriy kredit</div>
                <div style={{ fontSize: 24, fontWeight: 800, color: tgPurple }}>3</div>
              </div>
              <div style={{ flex: 1, background: "rgba(42,171,238,0.08)", borderRadius: 14, padding: 14, textAlign: "center", border: "1px solid rgba(42,171,238,0.15)" }}>
                <Zap size={22} color={tgBlue} style={{ margin: "0 auto 6px" }} />
                <div style={{ fontSize: 11, color: tgMuted, marginBottom: 2 }}>+5 kredit</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: tgBlue }}>50 000</div>
                <div style={{ fontSize: 10, color: tgMuted }}>so'm</div>
              </div>
            </div>
            <button style={{ width: "100%", background: "linear-gradient(135deg,#7C3AED,#A855F7)", color: "#fff", border: "none", borderRadius: 13, padding: "14px 0", fontSize: 15, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <CreditCard size={17} /> Kredit sotib olish
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
