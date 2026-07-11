import { useState } from "react";
import { ChevronLeft, Bot, Sparkles, Zap, CreditCard, CheckCircle2, MessageSquare } from "lucide-react";
import { sendOrder, closeMiniApp } from "@/lib/tg";

interface Props { onBack: () => void; }

export function AiPage({ onBack }: Props) {
  const [sent, setSent] = useState<"chat" | "buy" | null>(null);

  function handleStartChat() {
    sendOrder({ type: "ai_chat" });
    setSent("chat");
    setTimeout(closeMiniApp, 1600);
  }

  function handleBuyCredits() {
    sendOrder({ type: "ai_credits" });
    setSent("buy");
    setTimeout(closeMiniApp, 1600);
  }

  if (sent) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: 32, textAlign: "center" }}>
        <div style={{ width: 80, height: 80, borderRadius: 24, background: "rgba(168,85,247,0.15)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
          <CheckCircle2 size={40} color="#A855F7" strokeWidth={1.6} />
        </div>
        <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 10 }}>
          {sent === "chat" ? "Bot chatiga qarang!" : "Buyurtma yuborildi!"}
        </div>
        <div style={{ fontSize: 14, color: "var(--tg-muted)", lineHeight: 1.7 }}>
          {sent === "chat"
            ? "AI bilan suhbat boshlanmoqda..."
            : "To'lov rekvizitlari bot chatiga yuborildi."}
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
        <div style={{ fontSize: 17, fontWeight: 700 }}>Qozibuva AI</div>
      </div>

      <div style={{ padding: "16px", flex: 1 }}>
        {/* Header card */}
        <div style={{ background: "linear-gradient(160deg,#2D1B69,#1A1040)", borderRadius: 18, padding: 22, border: "1px solid rgba(147,51,234,0.25)", marginBottom: 14 }}>
          <div style={{ width: 64, height: 64, borderRadius: 18, background: "rgba(168,85,247,0.2)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
            <Bot size={28} color="#A855F7" strokeWidth={1.6} />
          </div>
          <div style={{ fontSize: 18, fontWeight: 700, textAlign: "center", marginBottom: 8 }}>AI Huquqiy Maslahat</div>
          <div style={{ fontSize: 13, color: "var(--tg-muted)", textAlign: "center", lineHeight: 1.6, marginBottom: 20 }}>
            Sun'iy intellekt yordamida huquqiy savollaringizga javob oling.
          </div>

          {/* Free credits banner */}
          <div style={{ background: "linear-gradient(135deg,rgba(76,175,132,0.2),rgba(42,171,238,0.1))", border: "1px solid rgba(76,175,132,0.35)", borderRadius: 14, padding: "12px 16px", textAlign: "center", marginBottom: 18 }}>
            <div style={{ fontSize: 12, color: "rgba(76,175,132,0.8)", marginBottom: 4, fontWeight: 600 }}>🎁 BEPUL SOVG'A</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: "#4CAF84" }}>10 ta</div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.75)" }}>bepul kredit — har bir yangi foydalanuvchiga</div>
          </div>

          {/* Stats row */}
          <div style={{ display: "flex", gap: 10 }}>
            <div style={{ flex: 1, background: "rgba(168,85,247,0.12)", borderRadius: 14, padding: "12px 10px", textAlign: "center", border: "1px solid rgba(168,85,247,0.2)" }}>
              <Sparkles size={20} color="#A855F7" style={{ margin: "0 auto 6px" }} />
              <div style={{ fontSize: 11, color: "var(--tg-muted)", marginBottom: 2 }}>Bepul paket</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#A855F7" }}>10</div>
              <div style={{ fontSize: 10, color: "var(--tg-muted)" }}>ta savol</div>
            </div>
            <div style={{ flex: 1, background: "rgba(42,171,238,0.08)", borderRadius: 14, padding: "12px 10px", textAlign: "center", border: "1px solid rgba(42,171,238,0.15)" }}>
              <Zap size={20} color="#2AABEE" style={{ margin: "0 auto 6px" }} />
              <div style={{ fontSize: 11, color: "var(--tg-muted)", marginBottom: 2 }}>Qo'shimcha paket</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#2AABEE" }}>5</div>
              <div style={{ fontSize: 10, color: "var(--tg-muted)" }}>ta / 50 000 so'm</div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div style={{ background: "var(--tg-card)", borderRadius: 16, padding: "4px 0", marginBottom: 16 }}>
          {[
            "Har qanday huquqiy savollarga javob",
            "O'zbek va rus tillarida ishlaydi",
            "Kreditlar tugagach qo'shimcha sotib olasiz",
          ].map((s) => (
            <div key={s} style={{ fontSize: 13, color: "var(--tg-muted)", padding: "12px 16px", borderBottom: "1px solid var(--tg-border)", display: "flex", gap: 10, alignItems: "center" }}>
              <span style={{ color: "#A855F7", flexShrink: 0 }}>✦</span>{s}
            </div>
          ))}
        </div>
      </div>

      {/* Buttons */}
      <div style={{ padding: "12px 16px 24px", borderTop: "1px solid var(--tg-border)", display: "flex", flexDirection: "column", gap: 10 }}>
        <button onClick={handleStartChat}
          style={{ width: "100%", background: "linear-gradient(135deg,#7C3AED,#A855F7)", color: "#fff", border: "none", borderRadius: 14, padding: "15px 0", fontSize: 16, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 9 }}>
          <MessageSquare size={18} strokeWidth={2} /> AI bilan suhbat boshlash
        </button>
        <button onClick={handleBuyCredits}
          style={{ width: "100%", background: "transparent", color: "var(--tg-muted)", border: "1px solid var(--tg-border)", borderRadius: 14, padding: "13px 0", fontSize: 14, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 9 }}>
          <CreditCard size={16} /> Qo'shimcha 5 kredit — 50 000 so'm
        </button>
      </div>
    </div>
  );
}
