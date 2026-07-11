import { useState } from "react";

const tgBlue = "#2AABEE";
const tgDark = "#17212B";
const tgCard = "#232E3C";
const tgMuted = "#8B9EB5";
const tgText = "#F5F5F5";
const tgGreen = "#4CAF84";

export function Home() {
  const [active, setActive] = useState("home");

  return (
    <div style={{ background: tgDark, minHeight: "100vh", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", color: tgText, display: "flex", flexDirection: "column", maxWidth: 390, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #1A3A52 0%, #1E2D40 100%)", padding: "20px 20px 16px", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 44, height: 44, borderRadius: "50%", background: `linear-gradient(135deg, ${tgBlue}, #1A8FD1)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>⚖️</div>
          <div>
            <div style={{ fontSize: 17, fontWeight: 700, color: tgText }}>Qozibuva</div>
            <div style={{ fontSize: 12, color: tgMuted }}>Huquqiy xizmatlar platformasi</div>
          </div>
        </div>
      </div>

      {/* Welcome card */}
      <div style={{ margin: "16px 16px 0", background: `linear-gradient(135deg, ${tgBlue} 0%, #1A8FD1 100%)`, borderRadius: 16, padding: "18px 20px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -20, right: -20, width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
        <div style={{ position: "absolute", bottom: -30, right: 20, width: 80, height: 80, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.8)", marginBottom: 4 }}>Xush kelibsiz,</div>
        <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Alisher Ergashev 👋</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <span style={{ background: "rgba(255,255,255,0.2)", borderRadius: 20, padding: "4px 10px", fontSize: 12 }}>🤖 AI: 3 kredit</span>
          <span style={{ background: "rgba(255,255,255,0.2)", borderRadius: 20, padding: "4px 10px", fontSize: 12 }}>✅ A'zo</span>
        </div>
      </div>

      {/* Services grid */}
      <div style={{ margin: "16px 16px 0" }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: tgMuted, marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.5 }}>Xizmatlar</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {[
            { icon: "📄", label: "Ariza shablonlari", sub: "15 000 so'm", color: "#2A6496" },
            { icon: "💬", label: "Konsultatsiya", sub: "99 000 so'm", color: "#1A6644" },
            { icon: "🤖", label: "Qozibuva AI", sub: "50 000 so'm", color: "#6B3FA0" },
            { icon: "⚖️", label: "Professional ariza", sub: "Murojaat", color: "#8B4513" },
          ].map((s) => (
            <div key={s.label} style={{ background: tgCard, borderRadius: 14, padding: "16px 14px", cursor: "pointer", border: "1px solid rgba(255,255,255,0.05)", transition: "all 0.2s" }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>{s.icon}</div>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4, lineHeight: 1.3 }}>{s.label}</div>
              <div style={{ fontSize: 11, color: tgBlue, fontWeight: 500 }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent orders */}
      <div style={{ margin: "16px 16px 0" }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: tgMuted, marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.5 }}>Oxirgi buyurtmalar</div>
        {[
          { icon: "📄", label: "Aliment to'lash arizasi", date: "10.07.2026", status: "Yuborildi", ok: true },
          { icon: "💬", label: "Yuridik konsultatsiya", date: "05.07.2026", status: "Bajarildi", ok: true },
        ].map((o) => (
          <div key={o.label} style={{ background: tgCard, borderRadius: 12, padding: "13px 14px", marginBottom: 8, display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ fontSize: 22 }}>{o.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 500 }}>{o.label}</div>
              <div style={{ fontSize: 11, color: tgMuted }}>{o.date}</div>
            </div>
            <div style={{ fontSize: 11, color: tgGreen, fontWeight: 500 }}>{o.status}</div>
          </div>
        ))}
      </div>

      {/* Bottom nav */}
      <div style={{ marginTop: "auto", padding: "0 0 8px" }}>
        <div style={{ background: "#1A2433", borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", padding: "8px 0 4px" }}>
          {[
            { id: "home", icon: "🏠", label: "Bosh sahifa" },
            { id: "catalog", icon: "📋", label: "Xizmatlar" },
            { id: "orders", icon: "📦", label: "Buyurtmalar" },
            { id: "profile", icon: "👤", label: "Profil" },
          ].map((n) => (
            <div key={n.id} onClick={() => setActive(n.id)} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3, cursor: "pointer", padding: "4px 0" }}>
              <div style={{ fontSize: 20 }}>{n.icon}</div>
              <div style={{ fontSize: 10, color: active === n.id ? tgBlue : tgMuted, fontWeight: active === n.id ? 600 : 400 }}>{n.label}</div>
              {active === n.id && <div style={{ width: 4, height: 4, borderRadius: "50%", background: tgBlue }} />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
