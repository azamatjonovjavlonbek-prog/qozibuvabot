import { useEffect, useState } from "react";
import { CheckCircle2, ArrowLeft } from "lucide-react";

interface Props { onHome: () => void; }

export function Success({ onHome }: Props) {
  const [show, setShow] = useState(false);
  useEffect(() => { const t = setTimeout(() => setShow(true), 150); return () => clearTimeout(t); }, []);

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "32px 20px", textAlign: "center" }}>
      {/* Icon */}
      <div style={{ opacity: show ? 1 : 0, transform: show ? "scale(1)" : "scale(0.4)", transition: "all 0.5s cubic-bezier(0.34,1.56,0.64,1)", marginBottom: 24 }}>
        <div style={{ width: 96, height: 96, borderRadius: 28, background: "linear-gradient(135deg,#4CAF84,#2E7D52)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 48px rgba(76,175,132,0.35)" }}>
          <CheckCircle2 size={48} color="#fff" strokeWidth={2} />
        </div>
      </div>

      {/* Text */}
      <div style={{ opacity: show ? 1 : 0, transform: show ? "translateY(0)" : "translateY(20px)", transition: "all 0.45s ease 0.2s", marginBottom: 32 }}>
        <div style={{ fontSize: 24, fontWeight: 800, marginBottom: 10 }}>Buyurtma qabul qilindi!</div>
        <div style={{ fontSize: 14, color: "var(--tg-muted)", lineHeight: 1.7, maxWidth: 280 }}>
          Bot sizga to'lov rekvizitlarini yubordi. Iltimos, Telegram chat ga qayting.
        </div>
      </div>

      {/* Note */}
      <div style={{ opacity: show ? 1 : 0, transition: "opacity 0.4s ease 0.4s", background: "var(--tg-card)", borderRadius: 16, padding: "16px 18px", width: "100%", marginBottom: 24, textAlign: "left" }}>
        {[
          "✅ Buyurtma botga yuborildi",
          "💳 To'lov rekvizitlari Telegram chatda",
          "📄 To'lovdan keyin xizmat yetkaziladi",
        ].map((s) => (
          <div key={s} style={{ fontSize: 13, color: "var(--tg-muted)", padding: "7px 0", borderBottom: "1px solid var(--tg-border)" }}>{s}</div>
        ))}
      </div>

      <div style={{ opacity: show ? 1 : 0, transition: "opacity 0.4s ease 0.5s", width: "100%" }}>
        <button onClick={onHome} style={{ width: "100%", background: "rgba(255,255,255,0.07)", color: "var(--tg-text)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14, padding: "13px 0", fontSize: 14, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <ArrowLeft size={16} strokeWidth={1.8} /> Bosh sahifaga qaytish
        </button>
      </div>
    </div>
  );
}
