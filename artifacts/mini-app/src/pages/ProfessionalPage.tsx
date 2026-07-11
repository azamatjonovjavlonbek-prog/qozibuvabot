import { useState } from "react";
import { ChevronLeft, Scale, Star, CreditCard, CheckCircle2 } from "lucide-react";
import { sendOrder, closeMiniApp } from "@/lib/tg";

interface Props { onBack: () => void; }

export function ProfessionalPage({ onBack }: Props) {
  const [sent, setSent] = useState(false);

  function handleOrder() {
    sendOrder({ type: "professional_ariza" });
    setSent(true);
    setTimeout(closeMiniApp, 1800);
  }

  if (sent) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: 32, textAlign: "center" }}>
        <div style={{ width: 80, height: 80, borderRadius: 24, background: "rgba(251,146,60,0.15)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
          <CheckCircle2 size={40} color="#FB923C" strokeWidth={1.6} />
        </div>
        <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 10 }}>Buyurtma qabul qilindi!</div>
        <div style={{ fontSize: 14, color: "var(--tg-muted)", lineHeight: 1.7 }}>
          Bot chatiga qarang — yuristimiz tez orada bog'lanadi.
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
        <div>
          <div style={{ fontSize: 17, fontWeight: 700 }}>Professional ariza</div>
          <div style={{ fontSize: 12, color: "var(--tg-muted)" }}>Yurist tomonidan yoziladi</div>
        </div>
      </div>

      <div style={{ padding: "16px", flex: 1 }}>
        <div style={{ background: "linear-gradient(160deg,#2A1A00,#1A1208)", borderRadius: 18, padding: 20, marginBottom: 14, border: "1px solid rgba(251,146,60,0.25)" }}>
          <div style={{ width: 64, height: 64, borderRadius: 18, background: "rgba(251,146,60,0.2)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
            <Scale size={28} color="#FB923C" strokeWidth={1.6} />
          </div>
          <div style={{ fontSize: 18, fontWeight: 700, textAlign: "center", marginBottom: 8 }}>Professional ariza</div>
          <div style={{ fontSize: 13, color: "var(--tg-muted)", textAlign: "center", lineHeight: 1.65, marginBottom: 16 }}>
            Yuristimiz sizning holatingizga mos ariza yozib beradi.
          </div>
          <div style={{ background: "rgba(251,146,60,0.12)", borderRadius: 12, padding: "12px 16px", textAlign: "center" }}>
            <div style={{ fontSize: 12, color: "var(--tg-muted)", marginBottom: 4 }}>Narxi</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#FB923C" }}>199 000 – 1 000 000 so'm</div>
            <div style={{ fontSize: 11, color: "var(--tg-muted)", marginTop: 3 }}>Murakkablikka qarab belgilanadi</div>
          </div>
        </div>

        <div style={{ background: "var(--tg-card)", borderRadius: 16, padding: "4px 0", marginBottom: 14 }}>
          {[
            "Huquqiy vaziyatingizni batafsil o'rganib chiqiladi",
            "Ariza yurist tomonidan shaxsan yoziladi",
            "Buyurtmadan so'ng yurist siz bilan bog'lanadi",
            "Kerakli hujjatlar ro'yxati yuboriladi",
            "Tayyor ariza bot orqali yetkaziladi",
          ].map((s) => (
            <div key={s} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "12px 16px", borderBottom: "1px solid var(--tg-border)" }}>
              <Star size={14} color="#FB923C" style={{ flexShrink: 0, marginTop: 2 }} strokeWidth={2} />
              <span style={{ fontSize: 13, lineHeight: 1.4 }}>{s}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: "12px 16px 24px", borderTop: "1px solid var(--tg-border)" }}>
        <button onClick={handleOrder}
          style={{ width: "100%", background: "linear-gradient(135deg,#FB923C,#C2410C)", color: "#fff", border: "none", borderRadius: 14, padding: "15px 0", fontSize: 16, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 9 }}>
          <CreditCard size={18} strokeWidth={2} /> Buyurtma berish
        </button>
      </div>
    </div>
  );
}
