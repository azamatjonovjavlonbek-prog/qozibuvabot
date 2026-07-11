import { useState } from "react";

const tgBlue = "#2AABEE";
const tgDark = "#17212B";
const tgCard = "#232E3C";
const tgMuted = "#8B9EB5";
const tgText = "#F5F5F5";

const CATEGORIES = [
  { id: "divorce", label: "Nikohdan ajratish arizasi", icon: "💔" },
  { id: "aliment", label: "Aliment to'lash arizasi", icon: "👶" },
  { id: "property", label: "Mulkni bo'lish arizasi", icon: "🏠" },
  { id: "custody", label: "Farzand vasiyligini aniqlash", icon: "👨‍👧" },
  { id: "debt", label: "Qarz undirish arizasi", icon: "💰" },
  { id: "labor", label: "Mehnat nizosi arizasi", icon: "👔" },
  { id: "other", label: "Boshqa ariza", icon: "📄" },
];

export function Catalog() {
  const [tab, setTab] = useState<"shablon" | "consultation" | "ai">("shablon");

  return (
    <div style={{ background: tgDark, minHeight: "100vh", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", color: tgText, maxWidth: 390, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ background: "#1A2433", padding: "18px 16px 0", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 14 }}>Xizmatlar</div>
        {/* Tabs */}
        <div style={{ display: "flex", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          {([
            { id: "shablon", label: "📄 Ariza" },
            { id: "consultation", label: "💬 Konsultatsiya" },
            { id: "ai", label: "🤖 AI" },
          ] as const).map((t) => (
            <div key={t.id} onClick={() => setTab(t.id)} style={{ flex: 1, textAlign: "center", padding: "8px 4px", fontSize: 12, fontWeight: tab === t.id ? 600 : 400, color: tab === t.id ? tgBlue : tgMuted, borderBottom: tab === t.id ? `2px solid ${tgBlue}` : "2px solid transparent", cursor: "pointer", marginBottom: -1 }}>
              {t.label}
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "12px 16px 90px" }}>
        {tab === "shablon" && (
          <>
            {/* Price badge */}
            <div style={{ background: "rgba(42,171,238,0.12)", border: "1px solid rgba(42,171,238,0.3)", borderRadius: 12, padding: "12px 16px", marginBottom: 14, display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ fontSize: 24 }}>💡</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>Ariza shabloni</div>
                <div style={{ fontSize: 12, color: tgMuted }}>Word formatda tayyor ariza — <b style={{ color: tgBlue }}>15 000 so'm</b></div>
              </div>
            </div>
            {CATEGORIES.map((cat) => (
              <div key={cat.id} style={{ background: tgCard, borderRadius: 14, padding: "15px 16px", marginBottom: 8, display: "flex", alignItems: "center", gap: 14, cursor: "pointer", border: "1px solid rgba(255,255,255,0.04)" }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(42,171,238,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{cat.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 500, lineHeight: 1.3 }}>{cat.label}</div>
                  <div style={{ fontSize: 12, color: tgMuted, marginTop: 2 }}>Word fayl • Darhol yuboriladi</div>
                </div>
                <div style={{ fontSize: 18, color: tgMuted }}>›</div>
              </div>
            ))}
          </>
        )}

        {tab === "consultation" && (
          <div>
            <div style={{ background: tgCard, borderRadius: 16, padding: 20, marginBottom: 12 }}>
              <div style={{ fontSize: 36, textAlign: "center", marginBottom: 12 }}>👨‍⚖️</div>
              <div style={{ fontSize: 17, fontWeight: 700, textAlign: "center", marginBottom: 8 }}>Yuridik konsultatsiya</div>
              <div style={{ fontSize: 13, color: tgMuted, textAlign: "center", lineHeight: 1.6, marginBottom: 16 }}>Professional yurist bilan telefon orqali maslahat. To'lovdan keyin telefon raqam yuboriladi.</div>
              <div style={{ background: "rgba(42,171,238,0.1)", borderRadius: 12, padding: 14 }}>
                {[
                  { icon: "🕐", label: "Ish vaqti", val: "10:00 – 20:00" },
                  { icon: "⏱️", label: "Muddati", val: "30 daqiqa" },
                  { icon: "💳", label: "Narx", val: "99 000 so'm" },
                ].map((r) => (
                  <div key={r.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                    <span style={{ fontSize: 13, color: tgMuted }}>{r.icon} {r.label}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: tgBlue }}>{r.val}</span>
                  </div>
                ))}
              </div>
              <button style={{ width: "100%", marginTop: 16, background: `linear-gradient(135deg, ${tgBlue}, #1A8FD1)`, color: "#fff", border: "none", borderRadius: 12, padding: "14px 0", fontSize: 15, fontWeight: 600, cursor: "pointer" }}>
                💳 To'lov qilish
              </button>
            </div>
          </div>
        )}

        {tab === "ai" && (
          <div>
            <div style={{ background: `linear-gradient(135deg, #2D1B69, #1A1040)`, borderRadius: 16, padding: 20, marginBottom: 12, border: "1px solid rgba(147,51,234,0.3)" }}>
              <div style={{ fontSize: 36, textAlign: "center", marginBottom: 10 }}>🤖</div>
              <div style={{ fontSize: 17, fontWeight: 700, textAlign: "center", marginBottom: 8 }}>Qozibuva AI</div>
              <div style={{ fontSize: 13, color: tgMuted, textAlign: "center", lineHeight: 1.6, marginBottom: 16 }}>Sun'iy intellekt yordamida huquqiy savollaringizga javob oling</div>
              <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                <div style={{ flex: 1, background: "rgba(147,51,234,0.15)", borderRadius: 12, padding: 12, textAlign: "center" }}>
                  <div style={{ fontSize: 22, marginBottom: 4 }}>🎯</div>
                  <div style={{ fontSize: 11, color: tgMuted }}>Joriy kredit</div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: "#A855F7" }}>3</div>
                </div>
                <div style={{ flex: 1, background: "rgba(42,171,238,0.1)", borderRadius: 12, padding: 12, textAlign: "center" }}>
                  <div style={{ fontSize: 22, marginBottom: 4 }}>💰</div>
                  <div style={{ fontSize: 11, color: tgMuted }}>+5 kredit</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: tgBlue }}>50 000</div>
                  <div style={{ fontSize: 10, color: tgMuted }}>so'm</div>
                </div>
              </div>
              <button style={{ width: "100%", background: "linear-gradient(135deg, #7C3AED, #A855F7)", color: "#fff", border: "none", borderRadius: 12, padding: "14px 0", fontSize: 15, fontWeight: 600, cursor: "pointer" }}>
                💳 Kredit sotib olish
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
