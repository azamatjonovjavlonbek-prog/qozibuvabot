import { useState } from "react";
import {
  FileText, MessageCircle, Bot, Scale, Home, List, Package, User,
  ChevronRight, CheckCircle2, Clock, Sparkles,
} from "lucide-react";

const tgBlue = "#2AABEE";
const tgDark = "#17212B";
const tgCard = "#232E3C";
const tgMuted = "#8B9EB5";
const tgText = "#F5F5F5";
const tgGreen = "#4CAF84";

const SERVICES = [
  { icon: FileText,  label: "Ariza shablonlari", sub: "15 000 so'm",  bg: "rgba(42,171,238,0.15)",  color: tgBlue },
  { icon: MessageCircle, label: "Konsultatsiya",  sub: "99 000 so'm", bg: "rgba(76,175,132,0.15)", color: tgGreen },
  { icon: Bot,       label: "Qozibuva AI",        sub: "50 000 so'm", bg: "rgba(168,85,247,0.15)", color: "#A855F7" },
  { icon: Scale,     label: "Professional ariza", sub: "Murojaat",    bg: "rgba(251,191,36,0.15)", color: "#FBB924" },
];

const NAV = [
  { id: "home",    icon: Home,    label: "Bosh sahifa" },
  { id: "catalog", icon: List,    label: "Xizmatlar" },
  { id: "orders",  icon: Package, label: "Buyurtmalar" },
  { id: "profile", icon: User,    label: "Profil" },
];

export function Home() {
  const [active, setActive] = useState("home");

  return (
    <div style={{ background: tgDark, minHeight: "100vh", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", color: tgText, display: "flex", flexDirection: "column", maxWidth: 390, margin: "0 auto" }}>

      {/* Header */}
      <div style={{ background: "linear-gradient(180deg,#1A3A52 0%,#1E2D40 100%)", padding: "20px 20px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 44, height: 44, borderRadius: 14, background: `linear-gradient(135deg,${tgBlue},#1A8FD1)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Scale size={22} color="#fff" strokeWidth={2} />
          </div>
          <div>
            <div style={{ fontSize: 17, fontWeight: 700 }}>Qozibuva</div>
            <div style={{ fontSize: 12, color: tgMuted }}>Huquqiy xizmatlar platformasi</div>
          </div>
        </div>
      </div>

      {/* Welcome card */}
      <div style={{ margin: "14px 16px 0", background: `linear-gradient(135deg,${tgBlue},#1A8FD1)`, borderRadius: 18, padding: "18px 20px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -24, right: -24, width: 110, height: 110, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
        <div style={{ position: "absolute", bottom: -32, right: 24, width: 80, height: 80, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", marginBottom: 3 }}>Xush kelibsiz,</div>
        <div style={{ fontSize: 19, fontWeight: 700, marginBottom: 10 }}>Alisher Ergashev</div>
        <div style={{ display: "flex", gap: 8 }}>
          <span style={{ background: "rgba(255,255,255,0.22)", borderRadius: 20, padding: "4px 10px", fontSize: 12, display: "flex", alignItems: "center", gap: 5 }}>
            <Sparkles size={11} /> AI: 3 kredit
          </span>
          <span style={{ background: "rgba(255,255,255,0.22)", borderRadius: 20, padding: "4px 10px", fontSize: 12, display: "flex", alignItems: "center", gap: 5 }}>
            <CheckCircle2 size={11} /> A'zo
          </span>
        </div>
      </div>

      {/* Services grid */}
      <div style={{ margin: "16px 16px 0" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: tgMuted, marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.8 }}>Xizmatlar</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {SERVICES.map(({ icon: Icon, label, sub, bg, color }) => (
            <div key={label} style={{ background: tgCard, borderRadius: 16, padding: "16px 14px", cursor: "pointer", border: "1px solid rgba(255,255,255,0.05)" }}>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: bg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10 }}>
                <Icon size={20} color={color} strokeWidth={1.8} />
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4, lineHeight: 1.3 }}>{label}</div>
              <div style={{ fontSize: 11, color, fontWeight: 600 }}>{sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent orders */}
      <div style={{ margin: "16px 16px 0" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: tgMuted, marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.8 }}>Oxirgi buyurtmalar</div>
        {[
          { Icon: FileText, label: "Aliment to'lash arizasi", date: "10.07.2026" },
          { Icon: MessageCircle, label: "Yuridik konsultatsiya", date: "05.07.2026" },
        ].map(({ Icon, label, date }) => (
          <div key={label} style={{ background: tgCard, borderRadius: 13, padding: "13px 14px", marginBottom: 8, display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: "rgba(42,171,238,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Icon size={18} color={tgBlue} strokeWidth={1.8} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 500 }}>{label}</div>
              <div style={{ fontSize: 11, color: tgMuted, marginTop: 2, display: "flex", alignItems: "center", gap: 4 }}><Clock size={10} /> {date}</div>
            </div>
            <CheckCircle2 size={16} color={tgGreen} strokeWidth={2} />
          </div>
        ))}
      </div>

      {/* Bottom nav */}
      <div style={{ marginTop: "auto" }}>
        <div style={{ background: "#1A2433", borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", padding: "10px 0 14px" }}>
          {NAV.map(({ id, icon: Icon, label }) => (
            <div key={id} onClick={() => setActive(id)} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, cursor: "pointer" }}>
              <Icon size={22} color={active === id ? tgBlue : tgMuted} strokeWidth={active === id ? 2.2 : 1.6} />
              <div style={{ fontSize: 10, color: active === id ? tgBlue : tgMuted, fontWeight: active === id ? 700 : 400 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
