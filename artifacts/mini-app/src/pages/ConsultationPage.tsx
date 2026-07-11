import { useState } from "react";
import { ChevronLeft, Phone, Clock, Timer, CreditCard, CheckCircle2, Copy, Check, ArrowRight, MessageCircle } from "lucide-react";
import { sendOrder, closeMiniApp } from "@/lib/tg";

const CARD_NUMBER = "9860 3501 4913 3539";
const CARD_OWNER = "Javlonbek Azamatjonov";
const CONSULTATION_PRICE = "99 000 so'm";

interface Props { onBack: () => void; }

type Step = "info" | "payment" | "sent";

export function ConsultationPage({ onBack }: Props) {
  const [step, setStep] = useState<Step>("info");
  const [copied, setCopied] = useState(false);

  function handleOrder() {
    sendOrder({ type: "consultation" });
    setStep("payment");
  }

  function copyCard() {
    navigator.clipboard.writeText(CARD_NUMBER).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleSentCheck() {
    setStep("sent");
    setTimeout(closeMiniApp, 2000);
  }

  if (step === "sent") {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: 32, textAlign: "center" }}>
        <div style={{ width: 80, height: 80, borderRadius: 24, background: "rgba(76,175,132,0.15)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
          <CheckCircle2 size={40} color="#4CAF84" strokeWidth={1.6} />
        </div>
        <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 10 }}>Buyurtma qabul qilindi!</div>
        <div style={{ fontSize: 14, color: "var(--tg-muted)", lineHeight: 1.7 }}>
          To'lov chekingizni bot chatiga yuboring. Administrator tasdiqlashi bilan telefon raqam yuboriladi.
        </div>
      </div>
    );
  }

  if (step === "payment") {
    return (
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <div style={{ background: "var(--tg-header)", padding: "16px", display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid var(--tg-border)" }}>
          <div onClick={() => setStep("info")} style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <ChevronLeft size={20} strokeWidth={2} />
          </div>
          <div>
            <div style={{ fontSize: 17, fontWeight: 700 }}>To'lov ma'lumotlari</div>
            <div style={{ fontSize: 12, color: "var(--tg-muted)" }}>Konsultatsiya uchun</div>
          </div>
        </div>

        <div style={{ padding: "16px", flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>

          {/* Xizmat va summa */}
          <div style={{ background: "var(--tg-card)", borderRadius: 16, padding: 16, border: "1px solid var(--tg-border)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <span style={{ fontSize: 13, color: "var(--tg-muted)" }}>Xizmat</span>
              <span style={{ fontSize: 14, fontWeight: 700 }}>Konsultatsiya</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 13, color: "var(--tg-muted)" }}>Summa</span>
              <span style={{ fontSize: 16, fontWeight: 800, color: "#4CAF84" }}>{CONSULTATION_PRICE}</span>
            </div>
          </div>

          {/* Karta raqami */}
          <div style={{ background: "var(--tg-card)", borderRadius: 16, padding: 16, border: "1px solid var(--tg-border)" }}>
            <div style={{ fontSize: 12, color: "var(--tg-muted)", marginBottom: 10, fontWeight: 600, letterSpacing: "0.5px", textTransform: "uppercase" }}>
              Karta ma'lumotlari
            </div>
            <button
              onClick={copyCard}
              style={{
                width: "100%", background: "rgba(42,171,238,0.08)", border: "1.5px dashed rgba(42,171,238,0.35)",
                borderRadius: 12, padding: "14px 16px", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "space-between",
                marginBottom: 10,
              }}
            >
              <div style={{ textAlign: "left" }}>
                <div style={{ fontSize: 12, color: "var(--tg-muted)", marginBottom: 4 }}>Karta raqami</div>
                <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: "2px", color: "var(--tg-text)", fontFamily: "monospace" }}>
                  {CARD_NUMBER}
                </div>
              </div>
              <div style={{ width: 34, height: 34, borderRadius: 9, background: copied ? "rgba(76,175,132,0.15)" : "rgba(42,171,238,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {copied
                  ? <Check size={16} color="#4CAF84" strokeWidth={2.2} />
                  : <Copy size={16} color="#2AABEE" strokeWidth={2} />
                }
              </div>
            </button>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 2px" }}>
              <span style={{ fontSize: 13, color: "var(--tg-muted)" }}>Karta egasi</span>
              <span style={{ fontSize: 14, fontWeight: 700 }}>{CARD_OWNER}</span>
            </div>
          </div>

          {/* Ko'rsatma */}
          <div style={{ background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.25)", borderRadius: 14, padding: "13px 14px" }}>
            <div style={{ fontSize: 13, color: "#FBB924", fontWeight: 700, marginBottom: 6 }}>Keyingi qadam</div>
            <div style={{ fontSize: 13, color: "var(--tg-muted)", lineHeight: 1.6 }}>
              Ushbu kartaga <strong style={{ color: "var(--tg-text)" }}>{CONSULTATION_PRICE}</strong> o'tkazing va to'lov cheki (screenshot)ni bot chatiga yuboring.
              <br /><br />
              Administrator tasdiqlashi bilan <strong style={{ color: "var(--tg-text)" }}>telefon raqam yuboriladi</strong>.
            </div>
          </div>

          {/* Ish vaqti eslatmasi */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", background: "var(--tg-card)", borderRadius: 12, border: "1px solid var(--tg-border)" }}>
            <Clock size={14} color="var(--tg-muted)" strokeWidth={1.8} />
            <span style={{ fontSize: 12, color: "var(--tg-muted)" }}>Ish vaqti: <strong style={{ color: "var(--tg-text)" }}>10:00 – 20:00</strong> • Tasdiqlash: <strong style={{ color: "var(--tg-text)" }}>5–15 daqiqa</strong></span>
          </div>
        </div>

        <div style={{ padding: "12px 16px 24px", borderTop: "1px solid var(--tg-border)", display: "flex", flexDirection: "column", gap: 10 }}>
          <button
            onClick={handleSentCheck}
            style={{ width: "100%", background: "linear-gradient(135deg,#4CAF84,#2E7D52)", color: "#fff", border: "none", borderRadius: 14, padding: "15px 0", fontSize: 15, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
          >
            <MessageCircle size={18} strokeWidth={2} />
            Chekni botga yubordim
          </button>
          <button
            onClick={() => setStep("info")}
            style={{ width: "100%", background: "transparent", color: "var(--tg-muted)", border: "none", borderRadius: 14, padding: "10px 0", fontSize: 13, cursor: "pointer" }}
          >
            Bekor qilish
          </button>
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
        <button
          onClick={handleOrder}
          style={{ width: "100%", background: "linear-gradient(135deg,#4CAF84,#2E7D52)", color: "#fff", border: "none", borderRadius: 14, padding: "15px 0", fontSize: 16, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
        >
          Buyurtma berish — 99 000 so'm
          <ArrowRight size={18} strokeWidth={2.2} />
        </button>
      </div>
    </div>
  );
}
