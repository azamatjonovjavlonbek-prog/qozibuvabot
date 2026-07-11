import { useState } from "react";

const tgBlue = "#2AABEE";
const tgDark = "#17212B";
const tgCard = "#232E3C";
const tgMuted = "#8B9EB5";
const tgText = "#F5F5F5";

export function Payment() {
  const [method, setMethod] = useState<"payme" | "click" | "card" | null>(null);

  return (
    <div style={{ background: tgDark, minHeight: "100vh", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", color: tgText, maxWidth: 390, margin: "0 auto", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ background: "#1A2433", padding: "18px 16px 16px", display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 18 }}>‹</div>
        <div style={{ fontSize: 17, fontWeight: 700 }}>To'lov</div>
      </div>

      <div style={{ padding: "16px 16px", flex: 1 }}>
        {/* Order summary */}
        <div style={{ background: tgCard, borderRadius: 16, padding: "16px 16px", marginBottom: 16 }}>
          <div style={{ fontSize: 12, color: tgMuted, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>Buyurtma</div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
            <div style={{ width: 46, height: 46, borderRadius: 12, background: "rgba(42,171,238,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>💔</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>Nikohdan ajratish arizasi</div>
              <div style={{ fontSize: 12, color: tgMuted }}>Word formatda shablon</div>
            </div>
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 13, color: tgMuted }}>Jami</span>
            <span style={{ fontSize: 20, fontWeight: 700, color: tgBlue }}>15 000 so'm</span>
          </div>
        </div>

        {/* Payment methods */}
        <div style={{ fontSize: 13, color: tgMuted, marginBottom: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>To'lov usuli</div>

        {[
          { id: "payme", label: "Payme", sub: "Eng qulay to'lov tizimi", icon: "🟢", badge: "Tavsiya etiladi" },
          { id: "click", label: "Click", sub: "O'zbekiston to'lov tizimi", icon: "🔵", badge: "" },
          { id: "card", label: "Bank kartasi", sub: "Chek yuborish orqali", icon: "💳", badge: "" },
        ].map((m) => (
          <div key={m.id} onClick={() => setMethod(m.id as any)} style={{ background: method === m.id ? "rgba(42,171,238,0.12)" : tgCard, border: method === m.id ? `1.5px solid ${tgBlue}` : "1.5px solid rgba(255,255,255,0.04)", borderRadius: 14, padding: "14px 16px", marginBottom: 8, display: "flex", alignItems: "center", gap: 14, cursor: "pointer", transition: "all 0.2s" }}>
            <div style={{ fontSize: 28 }}>{m.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 14, fontWeight: 600 }}>{m.label}</span>
                {m.badge && <span style={{ background: "rgba(42,171,238,0.2)", color: tgBlue, fontSize: 10, borderRadius: 6, padding: "2px 6px" }}>{m.badge}</span>}
              </div>
              <div style={{ fontSize: 12, color: tgMuted, marginTop: 2 }}>{m.sub}</div>
            </div>
            <div style={{ width: 20, height: 20, borderRadius: "50%", border: `2px solid ${method === m.id ? tgBlue : "rgba(255,255,255,0.2)"}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {method === m.id && <div style={{ width: 10, height: 10, borderRadius: "50%", background: tgBlue }} />}
            </div>
          </div>
        ))}

        {method === "card" && (
          <div style={{ background: "rgba(255,193,7,0.08)", border: "1px solid rgba(255,193,7,0.3)", borderRadius: 12, padding: "12px 14px", marginTop: 4 }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>💳 Karta rekvizitlari</div>
            <div style={{ fontFamily: "monospace", fontSize: 16, letterSpacing: 2, color: tgBlue, marginBottom: 4 }}>8600 0000 0000 0000</div>
            <div style={{ fontSize: 12, color: tgMuted }}>Karta egasi: YURIST QOZIBUVA</div>
            <div style={{ fontSize: 11, color: "rgba(255,193,7,0.8)", marginTop: 8 }}>⚠️ To'lovdan keyin chekni yuboring</div>
          </div>
        )}
      </div>

      {/* Bottom CTA */}
      <div style={{ padding: "12px 16px 20px", background: "#1A2433", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <button disabled={!method} style={{ width: "100%", background: method ? `linear-gradient(135deg, ${tgBlue}, #1A8FD1)` : "rgba(255,255,255,0.08)", color: method ? "#fff" : tgMuted, border: "none", borderRadius: 14, padding: "15px 0", fontSize: 16, fontWeight: 700, cursor: method ? "pointer" : "not-allowed", transition: "all 0.3s" }}>
          {method === "payme" && "🟢 Payme orqali to'lash"}
          {method === "click" && "🔵 Click orqali to'lash"}
          {method === "card" && "📷 Chek yuborish"}
          {!method && "To'lov usulini tanlang"}
        </button>
      </div>
    </div>
  );
}
