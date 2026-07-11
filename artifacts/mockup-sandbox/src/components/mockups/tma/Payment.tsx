import { useState } from "react";
import {
  ChevronLeft, FileText, CreditCard, Smartphone, Building2, Circle, CheckCircle2,
  Camera,
} from "lucide-react";

const tgBlue = "#2AABEE";
const tgDark = "#17212B";
const tgCard = "#232E3C";
const tgMuted = "#8B9EB5";
const tgText = "#F5F5F5";

const METHODS = [
  {
    id: "payme",
    icon: Smartphone,
    label: "Payme",
    sub: "Eng qulay to'lov tizimi",
    color: "#00C853",
    bg: "rgba(0,200,83,0.1)",
    badge: "Tavsiya etiladi",
  },
  {
    id: "click",
    icon: Smartphone,
    label: "Click",
    sub: "O'zbekiston to'lov tizimi",
    color: tgBlue,
    bg: "rgba(42,171,238,0.1)",
    badge: "",
  },
  {
    id: "card",
    icon: Building2,
    label: "Bank kartasi",
    sub: "Chek yuborish orqali",
    color: "#FBB924",
    bg: "rgba(251,185,36,0.1)",
    badge: "",
  },
] as const;

export function Payment() {
  const [method, setMethod] = useState<"payme" | "click" | "card" | null>(null);

  return (
    <div style={{ background: tgDark, minHeight: "100vh", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", color: tgText, maxWidth: 390, margin: "0 auto", display: "flex", flexDirection: "column" }}>

      {/* Header */}
      <div style={{ background: "#1A2433", padding: "16px 16px 16px", display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <ChevronLeft size={20} color={tgText} strokeWidth={2} />
        </div>
        <div style={{ fontSize: 17, fontWeight: 700 }}>To'lov</div>
      </div>

      <div style={{ padding: "16px", flex: 1 }}>

        {/* Order card */}
        <div style={{ background: tgCard, borderRadius: 18, padding: "16px", marginBottom: 18 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: tgMuted, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 12 }}>Buyurtma</div>
          <div style={{ display: "flex", alignItems: "center", gap: 13, marginBottom: 16 }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: "rgba(248,113,113,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <FileText size={22} color="#F87171" strokeWidth={1.8} />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.3 }}>Nikohdan ajratish arizasi</div>
              <div style={{ fontSize: 12, color: tgMuted, marginTop: 2 }}>Word formatda shablon</div>
            </div>
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 13, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 13, color: tgMuted }}>Jami to'lov</span>
            <span style={{ fontSize: 22, fontWeight: 800, color: tgBlue }}>15 000 so'm</span>
          </div>
        </div>

        {/* Method label */}
        <div style={{ fontSize: 11, fontWeight: 700, color: tgMuted, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 10 }}>To'lov usuli</div>

        {METHODS.map(({ id, icon: Icon, label, sub, color, bg, badge }) => (
          <div key={id} onClick={() => setMethod(id)} style={{ background: method === id ? `${bg}` : tgCard, border: `1.5px solid ${method === id ? color : "rgba(255,255,255,0.05)"}`, borderRadius: 16, padding: "14px 16px", marginBottom: 10, display: "flex", alignItems: "center", gap: 14, cursor: "pointer", transition: "all 0.18s" }}>
            <div style={{ width: 44, height: 44, borderRadius: 13, background: bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Icon size={22} color={color} strokeWidth={1.7} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                <span style={{ fontSize: 14, fontWeight: 700 }}>{label}</span>
                {badge && (
                  <span style={{ background: "rgba(0,200,83,0.15)", color: "#00C853", fontSize: 10, fontWeight: 700, borderRadius: 6, padding: "2px 7px" }}>{badge}</span>
                )}
              </div>
              <div style={{ fontSize: 12, color: tgMuted }}>{sub}</div>
            </div>
            {method === id
              ? <CheckCircle2 size={22} color={color} strokeWidth={2} />
              : <Circle size={22} color="rgba(255,255,255,0.15)" strokeWidth={1.5} />
            }
          </div>
        ))}

        {/* Card details */}
        {method === "card" && (
          <div style={{ background: "rgba(251,185,36,0.07)", border: "1px solid rgba(251,185,36,0.25)", borderRadius: 14, padding: "14px 16px", marginTop: 4 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <CreditCard size={16} color="#FBB924" strokeWidth={1.8} />
              <span style={{ fontSize: 13, fontWeight: 700, color: "#FBB924" }}>Karta rekvizitlari</span>
            </div>
            <div style={{ fontFamily: "monospace", fontSize: 17, letterSpacing: 3, color: tgText, marginBottom: 5 }}>8600 0000 0000 0000</div>
            <div style={{ fontSize: 12, color: tgMuted }}>Karta egasi: YURIST QOZIBUVA</div>
            <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "rgba(251,185,36,0.85)" }}>
              <Camera size={13} strokeWidth={1.8} />
              To'lovdan keyin chek rasmi yuboring
            </div>
          </div>
        )}
      </div>

      {/* CTA */}
      <div style={{ padding: "12px 16px 24px", background: "#1A2433", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <button
          disabled={!method}
          style={{ width: "100%", background: method ? `linear-gradient(135deg,${tgBlue},#1A8FD1)` : "rgba(255,255,255,0.07)", color: method ? "#fff" : tgMuted, border: "none", borderRadius: 14, padding: "15px 0", fontSize: 16, fontWeight: 700, cursor: method ? "pointer" : "not-allowed", transition: "all 0.25s", display: "flex", alignItems: "center", justifyContent: "center", gap: 9 }}
        >
          {!method && <><CreditCard size={18} /> To'lov usulini tanlang</>}
          {method === "payme" && <><Smartphone size={18} /> Payme orqali to'lash</>}
          {method === "click" && <><Smartphone size={18} /> Click orqali to'lash</>}
          {method === "card"  && <><Camera size={18} /> Chek yuborish</>}
        </button>
      </div>
    </div>
  );
}
