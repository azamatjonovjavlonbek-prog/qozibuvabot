import { useState } from "react";
import { ChevronLeft, FileSearch, Upload, FileText, CheckCircle2, Sparkles, AlertCircle } from "lucide-react";
import { sendOrder, closeMiniApp } from "@/lib/tg";

interface Props { onBack: () => void; }

export function Tahlil({ onBack }: Props) {
  const [sent, setSent] = useState(false);

  function handleRequest() {
    sendOrder({ type: "tahlil_request" });
    setSent(true);
    setTimeout(closeMiniApp, 1800);
  }

  if (sent) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: 32, textAlign: "center" }}>
        <div style={{ width: 80, height: 80, borderRadius: 24, background: "rgba(168,85,247,0.15)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
          <CheckCircle2 size={40} color="#A855F7" strokeWidth={1.6} />
        </div>
        <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 10 }}>Tayyor!</div>
        <div style={{ fontSize: 14, color: "var(--tg-muted)", lineHeight: 1.7 }}>
          Bot chatiga qarang — hujjatni yuboring, AI tahlil qiladi.
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
          <div style={{ fontSize: 17, fontWeight: 700 }}>Hujjat tahlili (AI)</div>
          <div style={{ fontSize: 12, color: "var(--tg-muted)" }}>Suniy intellekt yordamida</div>
        </div>
      </div>

      <div style={{ padding: "16px", flex: 1 }}>
        <div style={{ background: "linear-gradient(160deg,#2D1B69,#1A1040)", borderRadius: 18, padding: 20, marginBottom: 14, border: "1px solid rgba(147,51,234,0.25)" }}>
          <div style={{ width: 64, height: 64, borderRadius: 18, background: "rgba(168,85,247,0.2)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
            <FileSearch size={28} color="#A855F7" strokeWidth={1.6} />
          </div>
          <div style={{ fontSize: 18, fontWeight: 700, textAlign: "center", marginBottom: 8 }}>Hujjat tahlili</div>
          <div style={{ fontSize: 13, color: "var(--tg-muted)", textAlign: "center", lineHeight: 1.65 }}>
            Sun'iy intellekt sizning hujjatingizni o'qib, huquqiy nuqtai nazardan tahlil qiladi va tavsiyalar beradi.
          </div>
        </div>

        <div style={{ background: "var(--tg-card)", borderRadius: 16, padding: "4px 0", marginBottom: 14 }}>
          {[
            { icon: FileText,    color: "#2AABEE", label: "PDF, Word, rasmli hujjatlar qabul qilinadi" },
            { icon: Sparkles,    color: "#A855F7", label: "Huquqiy tahlil va tavsiyalar beriladi" },
            { icon: CheckCircle2,color: "#4CAF84", label: "AI kredit talab qiladi (bot orqali sotib oling)" },
          ].map(({ icon: Icon, color, label }) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderBottom: "1px solid var(--tg-border)" }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: `${color}20`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon size={17} color={color} strokeWidth={1.8} />
              </div>
              <span style={{ fontSize: 13 }}>{label}</span>
            </div>
          ))}
        </div>

        <div style={{ background: "rgba(251,185,36,0.08)", border: "1px solid rgba(251,185,36,0.2)", borderRadius: 12, padding: "12px 14px", marginBottom: 20, display: "flex", gap: 10 }}>
          <AlertCircle size={16} color="#FBB924" style={{ flexShrink: 0, marginTop: 2 }} />
          <div style={{ fontSize: 12, color: "var(--tg-muted)", lineHeight: 1.6 }}>
            Bosish bilan mini app yopiladi va bot sizdan hujjatni so'raydi. Hujjatni bot chatiga yuboring.
          </div>
        </div>

        <button onClick={handleRequest}
          style={{ width: "100%", background: "linear-gradient(135deg,#7C3AED,#A855F7)", color: "#fff", border: "none", borderRadius: 14, padding: "15px 0", fontSize: 16, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 9 }}>
          <Upload size={18} strokeWidth={2} /> Hujjat tahlilini boshlash
        </button>
      </div>
    </div>
  );
}
