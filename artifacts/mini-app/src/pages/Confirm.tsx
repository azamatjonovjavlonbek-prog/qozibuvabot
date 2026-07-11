import type { Service } from "@/App";
import { ChevronLeft, FileText, MessageCircle, Bot, CreditCard, Info } from "lucide-react";
import { sendOrder } from "@/lib/tg";

interface Props {
  service: Service;
  onBack: () => void;
  onSuccess: () => void;
}

const PRICE_MAP: Record<string, string> = {
  shablon: "15 000 so'm",
  consultation: "99 000 so'm",
  ai_credits: "50 000 so'm",
};

const LABEL_MAP: Record<string, string> = {
  consultation: "Yuridik konsultatsiya",
  ai_credits: "Qozibuva AI — 5 kredit",
};

const ICON_MAP = {
  shablon: FileText,
  consultation: MessageCircle,
  ai_credits: Bot,
};

const COLOR_MAP = {
  shablon: "#2AABEE",
  consultation: "#4CAF84",
  ai_credits: "#A855F7",
};

export function Confirm({ service, onBack, onSuccess }: Props) {
  const Icon = ICON_MAP[service.type];
  const color = COLOR_MAP[service.type];
  const price = PRICE_MAP[service.type];
  const label = service.type === "shablon" ? service.label : LABEL_MAP[service.type];

  function handleConfirm() {
    sendOrder({
      type: service.type,
      catId: service.type === "shablon" ? service.catId : undefined,
      label,
    });
    onSuccess();
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ background: "var(--tg-header)", padding: "16px", display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid var(--tg-border)" }}>
        <div onClick={onBack} style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <ChevronLeft size={20} strokeWidth={2} />
        </div>
        <div style={{ fontSize: 17, fontWeight: 700 }}>Buyurtmani tasdiqlash</div>
      </div>

      <div style={{ padding: "16px", flex: 1 }}>
        {/* Service card */}
        <div style={{ background: "var(--tg-card)", borderRadius: 18, padding: "18px", marginBottom: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "var(--tg-muted)", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 14 }}>Xizmat</div>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
            <div style={{ width: 52, height: 52, borderRadius: 15, background: `${color}20`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Icon size={24} color={color} strokeWidth={1.8} />
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.3, marginBottom: 4 }}>{label}</div>
              {service.type === "shablon" && (
                <div style={{ fontSize: 12, color: "var(--tg-muted)" }}>Word formatda • Darhol yuboriladi</div>
              )}
              {service.type === "consultation" && (
                <div style={{ fontSize: 12, color: "var(--tg-muted)" }}>Telefon raqam yuboriladi</div>
              )}
              {service.type === "ai_credits" && (
                <div style={{ fontSize: 12, color: "var(--tg-muted)" }}>5 ta savol krediti</div>
              )}
            </div>
          </div>
          <div style={{ borderTop: "1px solid var(--tg-border)", paddingTop: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 14, color: "var(--tg-muted)" }}>To'lov miqdori</span>
            <span style={{ fontSize: 22, fontWeight: 800, color }}>
              {price}
            </span>
          </div>
        </div>

        {/* Info */}
        <div style={{ background: "rgba(42,171,238,0.07)", border: "1px solid rgba(42,171,238,0.18)", borderRadius: 14, padding: "13px 15px", display: "flex", gap: 10 }}>
          <Info size={16} color="#2AABEE" style={{ flexShrink: 0, marginTop: 1 }} />
          <div style={{ fontSize: 12, color: "var(--tg-muted)", lineHeight: 1.6 }}>
            "Tasdiqlash" tugmasini bossangiz, bot sizga karta rekvizitlarini yuboradi. To'lovdan keyin xizmat darhol yetkaziladi.
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div style={{ padding: "12px 16px 24px", background: "var(--tg-header)", borderTop: "1px solid var(--tg-border)" }}>
        <button onClick={handleConfirm} style={{ width: "100%", background: `linear-gradient(135deg,${color},${color}cc)`, color: "#fff", border: "none", borderRadius: 14, padding: "15px 0", fontSize: 16, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 9, marginBottom: 10 }}>
          <CreditCard size={18} strokeWidth={2} /> To'lov ma'lumotlarini olish
        </button>
        <button onClick={onBack} style={{ width: "100%", background: "rgba(255,255,255,0.06)", color: "var(--tg-text)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "13px 0", fontSize: 14, fontWeight: 500, cursor: "pointer" }}>
          Orqaga
        </button>
      </div>
    </div>
  );
}
