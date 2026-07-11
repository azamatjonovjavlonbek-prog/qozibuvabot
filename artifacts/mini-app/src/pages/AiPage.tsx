import { ChevronLeft, Bot, Sparkles, Zap, CreditCard } from "lucide-react";

interface Props { onConfirm: () => void; onBack: () => void; }

export function AiPage({ onConfirm, onBack }: Props) {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <div style={{ background: "var(--tg-header)", padding: "16px", display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid var(--tg-border)" }}>
        <div onClick={onBack} style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <ChevronLeft size={20} strokeWidth={2} />
        </div>
        <div style={{ fontSize: 17, fontWeight: 700 }}>Qozibuva AI</div>
      </div>

      <div style={{ padding: "16px", flex: 1 }}>
        <div style={{ background: "linear-gradient(160deg,#2D1B69,#1A1040)", borderRadius: 18, padding: 22, border: "1px solid rgba(147,51,234,0.25)", marginBottom: 14 }}>
          <div style={{ width: 64, height: 64, borderRadius: 18, background: "rgba(168,85,247,0.2)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
            <Bot size={28} color="#A855F7" strokeWidth={1.6} />
          </div>
          <div style={{ fontSize: 18, fontWeight: 700, textAlign: "center", marginBottom: 8 }}>AI Huquqiy Maslahat</div>
          <div style={{ fontSize: 13, color: "var(--tg-muted)", textAlign: "center", lineHeight: 1.6, marginBottom: 20 }}>
            Sun'iy intellekt yordamida huquqiy savollaringizga javob oling. Kredit sotib olish orqali AI bilan suhbatlashing.
          </div>

          <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
            <div style={{ flex: 1, background: "rgba(168,85,247,0.12)", borderRadius: 14, padding: "14px 10px", textAlign: "center", border: "1px solid rgba(168,85,247,0.2)" }}>
              <Sparkles size={22} color="#A855F7" style={{ margin: "0 auto 6px" }} />
              <div style={{ fontSize: 11, color: "var(--tg-muted)", marginBottom: 4 }}>Paket hajmi</div>
              <div style={{ fontSize: 26, fontWeight: 800, color: "#A855F7" }}>5</div>
              <div style={{ fontSize: 11, color: "var(--tg-muted)" }}>ta savol</div>
            </div>
            <div style={{ flex: 1, background: "rgba(42,171,238,0.08)", borderRadius: 14, padding: "14px 10px", textAlign: "center", border: "1px solid rgba(42,171,238,0.15)" }}>
              <Zap size={22} color="#2AABEE" style={{ margin: "0 auto 6px" }} />
              <div style={{ fontSize: 11, color: "var(--tg-muted)", marginBottom: 4 }}>Narxi</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#2AABEE" }}>50 000</div>
              <div style={{ fontSize: 11, color: "var(--tg-muted)" }}>so'm</div>
            </div>
          </div>

          {[
            "Har qanday huquqiy savollarga javob",
            "O'zbek va rus tillarini qo'llab-quvvatlaydi",
            "Sotib olgach kredit darhol qo'shiladi",
          ].map((s) => (
            <div key={s} style={{ fontSize: 12, color: "var(--tg-muted)", padding: "7px 0", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", gap: 8, alignItems: "center" }}>
              <span style={{ color: "#A855F7" }}>✦</span>{s}
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: "12px 16px 24px", borderTop: "1px solid var(--tg-border)" }}>
        <button onClick={onConfirm} style={{ width: "100%", background: "linear-gradient(135deg,#7C3AED,#A855F7)", color: "#fff", border: "none", borderRadius: 14, padding: "15px 0", fontSize: 16, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <CreditCard size={17} /> 5 kredit sotib olish — 50 000 so'm
        </button>
      </div>
    </div>
  );
}
