import { useState } from "react";
import { ChevronLeft, Phone, Clock, Timer, CreditCard, CheckCircle2 } from "lucide-react";
import { sendOrder, closeMiniApp } from "@/lib/tg";

interface Props { onBack: () => void; }

export function ConsultationPage({ onBack }: Props) {
  const [sent, setSent] = useState(false);

  function handleOrder() {
    sendOrder({ type: "consultation" });
    setSent(true);
    setTimeout(closeMiniApp, 1800);
  }

  if (sent) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: 32, textAlign: "center" }}>
        <div style={{ width: 80, height: 80, borderRadius: 24, background: "rgba(76,175,132,0.15)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
          <CheckCircle2 size={40} color="#4CAF84" strokeWidth={1.6} />
        </div>
        <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 10 }}>Buyurtma yuborildi!</div>
        <div style={{ fontSize: 14, color: "var(--tg-muted)", lineHeight: 1.7 }}>
          Bot chatiga qarang — to'lov rekvizitlari yuborildi.
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <div style={{ background: "var(--tg-header)", padding: "16px", display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid var(--tg-border)" }}>
        <div onClick={onBack} style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <ChevronLeft size={20} strokeWidth={2} />
        </div>
        <div style={{ fontSize: 17, fontWeight: 700 }}>Konsultatsiya</div>
      </div>

      <div style={{ padding: "16px", flex: 1 }}>
        <div style={{ background: "var(--tg-card)", borderRadius: 18, padding: 20, marginBottom: 14 }}>
          <div style={{ width: 64, height: 64, borderRadius: 18, background: "rgba(76,175,132,0.15)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
            <Phone size={28} color="#4CAF84" strokeWidth={1.6} />
          </div>
          <div style={{ fontSize: 18, fontWeight: 700, textAlign: "center", marginBottom: 8 }}>Yuridik konsultatsiya</div>
          <div style={{ fontSize: 13, color: "var(--tg-muted)", textAlign: "center", lineHeight: 1.6, marginBottom: 18 }}>
            Professional yurist bilan telefon orqali maslahat. To'lovdan keyin telefon raqam yuboriladi.
          </div>
          <div style={{ background: "rgba(76,175,132,0.08)", border: "1px solid rgba(76,175,132,0.18)", borderRadius: 14, padding: "4px 0", marginBottom: 18 }}>
            {[
              { icon: Clock,      label: "Ish vaqti",  val: "10:00 – 20:00" },
              { icon: Timer,      label: "Muddati",    val: "30 daqiqa" },
              { icon: CreditCard, label: "To'lov",     val: "99 000 so'm" },
            ].map(({ icon: Icon, label, val }) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 15px", borderBottom: "1px solid var(--tg-border)" }}>
                <span style={{ fontSize: 13, color: "var(--tg-muted)", display: "flex", alignItems: "center", gap: 8 }}><Icon size={14} strokeWidth={1.7} />{label}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#4CAF84" }}>{val}</span>
              </div>
            ))}
          </div>
          {[
            "Huquqiy masala bo'yicha professional maslahat",
            "To'lovdan so'ng telefon raqam yuboriladi",
            "Ish vaqtida qo'ng'iroq qiling",
          ].map((s) => (
            <div key={s} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 8 }}>
              <CheckCircle2 size={15} color="#4CAF84" style={{ flexShrink: 0, marginTop: 2 }} />
              <span style={{ fontSize: 12, color: "var(--tg-muted)" }}>{s}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: "12px 16px 24px", borderTop: "1px solid var(--tg-border)" }}>
        <button onClick={handleOrder} style={{ width: "100%", background: "linear-gradient(135deg,#4CAF84,#2E7D52)", color: "#fff", border: "none", borderRadius: 14, padding: "15px 0", fontSize: 16, fontWeight: 700, cursor: "pointer" }}>
          Buyurtma berish — 99 000 so'm
        </button>
      </div>
    </div>
  );
}
