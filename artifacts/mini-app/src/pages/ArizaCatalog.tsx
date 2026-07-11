import type { Service } from "@/App";
import { ChevronLeft, ChevronRight, FileText, AlertTriangle, Baby, Ticket } from "lucide-react";

interface Props {
  onSelect: (svc: Service) => void;
  onBack: () => void;
}

const CATEGORIES = [
  {
    id: "divorce",
    icon: AlertTriangle,
    label: "Nikohdan ajratish arizasi",
    color: "#F87171",
    bg: "rgba(248,113,113,0.12)",
    desc: "Fuqarolik holati aktlari bo'yicha sud arizasi",
  },
  {
    id: "aliment",
    icon: Baby,
    label: "Aliment undirish arizasi",
    color: "#2AABEE",
    bg: "rgba(42,171,238,0.12)",
    desc: "Bolaga aliment undirish uchun sud arizasi",
  },
  {
    id: "radar",
    icon: Ticket,
    label: "Multiradar jarima bekor qilish",
    color: "#4CAF84",
    bg: "rgba(76,175,132,0.12)",
    desc: "Yo'l harakati jarimalari bo'yicha ariza",
  },
];

export function ArizaCatalog({ onSelect, onBack }: Props) {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ background: "var(--tg-header)", padding: "16px", display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid var(--tg-border)" }}>
        <div onClick={onBack} style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <ChevronLeft size={20} strokeWidth={2} />
        </div>
        <div>
          <div style={{ fontSize: 17, fontWeight: 700 }}>Ariza shablonlari</div>
          <div style={{ fontSize: 12, color: "var(--tg-muted)" }}>29 000 so'm • Word formatda</div>
        </div>
      </div>

      <div style={{ padding: "14px 16px 24px", flex: 1 }}>
        {/* Price info */}
        <div style={{ background: "rgba(42,171,238,0.08)", border: "1px solid rgba(42,171,238,0.2)", borderRadius: 14, padding: "12px 15px", marginBottom: 16, display: "flex", gap: 12, alignItems: "center" }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(42,171,238,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <FileText size={18} color="#2AABEE" strokeWidth={1.8} />
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600 }}>Shablon ariza</div>
            <div style={{ fontSize: 12, color: "var(--tg-muted)" }}>To'lovdan so'ng darhol yuboriladi • <b style={{ color: "#2AABEE" }}>29 000 so'm</b></div>
          </div>
        </div>

        <div style={{ fontSize: 11, fontWeight: 700, color: "var(--tg-muted)", marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.8 }}>Mavjud arizalar</div>

        {CATEGORIES.map(({ id, icon: Icon, label, color, bg, desc }) => (
          <div key={id}
            onClick={() => onSelect({ type: "shablon", catId: id, label })}
            style={{ background: "var(--tg-card)", borderRadius: 14, padding: "14px 15px", marginBottom: 10, display: "flex", alignItems: "center", gap: 13, cursor: "pointer", border: "1px solid var(--tg-border)" }}>
            <div style={{ width: 48, height: 48, borderRadius: 13, background: bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Icon size={22} color={color} strokeWidth={1.8} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.35, marginBottom: 3 }}>{label}</div>
              <div style={{ fontSize: 12, color: "var(--tg-muted)" }}>{desc}</div>
            </div>
            <ChevronRight size={18} color="var(--tg-muted)" strokeWidth={1.6} />
          </div>
        ))}
      </div>
    </div>
  );
}
