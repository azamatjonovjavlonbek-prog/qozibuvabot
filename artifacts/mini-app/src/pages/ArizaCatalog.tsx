import { useState } from "react";
import { ChevronLeft, ChevronRight, FileText, Scale, Users, Car, CheckCircle2 } from "lucide-react";
import { sendOrder, closeMiniApp } from "@/lib/tg";

interface Props {
  onBack: () => void;
}

const CATEGORIES = [
  {
    id: "divorce",
    icon: Scale,
    label: "Nikohdan ajratish arizasi",
    color: "#F87171",
    bg: "rgba(248,113,113,0.12)",
    desc: "Fuqarolik holati aktlari bo'yicha sud arizasi",
  },
  {
    id: "aliment",
    icon: Users,
    label: "Aliment undirish arizasi",
    color: "#2AABEE",
    bg: "rgba(42,171,238,0.12)",
    desc: "Bolaga aliment undirish uchun sud arizasi",
  },
  {
    id: "radar",
    icon: Car,
    label: "Multiradar jarima bekor qilish",
    color: "#4CAF84",
    bg: "rgba(76,175,132,0.12)",
    desc: "Yo'l harakati jarimalari bo'yicha ariza",
  },
];

export function ArizaCatalog({ onBack }: Props) {
  const [sent, setSent] = useState(false);

  function handleSelect(catId: string, label: string) {
    sendOrder({ type: "shablon", catId, label });
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
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(42,171,238,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <FileText size={18} color="#2AABEE" strokeWidth={1.8} />
          </div>
          <div>
            <div style={{ fontSize: 17, fontWeight: 700 }}>Ariza shablonlari</div>
            <div style={{ fontSize: 12, color: "var(--tg-muted)" }}>29 000 so'm • Word formatda</div>
          </div>
        </div>
      </div>

      <div style={{ padding: "14px 16px 24px", flex: 1 }}>
        <div style={{ background: "rgba(42,171,238,0.06)", border: "1px solid rgba(42,171,238,0.18)", borderRadius: 14, padding: "13px 15px", marginBottom: 18, display: "flex", gap: 12, alignItems: "center" }}>
          <div style={{ width: 38, height: 38, borderRadius: 11, background: "rgba(42,171,238,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <FileText size={17} color="#2AABEE" strokeWidth={1.8} />
          </div>
          <div style={{ fontSize: 13, color: "var(--tg-muted)", lineHeight: 1.55 }}>
            Ariza turini tanlang — to'lov ma'lumotlari <b style={{ color: "#2AABEE" }}>bot chatiga</b> yuboriladi
          </div>
        </div>

        <div style={{ fontSize: 11, fontWeight: 700, color: "var(--tg-muted)", marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.8 }}>Mavjud arizalar</div>

        {CATEGORIES.map(({ id, icon: Icon, label, color, bg, desc }) => (
          <div key={id}
            onClick={() => handleSelect(id, label)}
            style={{ background: "var(--tg-card)", borderRadius: 16, padding: "16px 15px", marginBottom: 10, display: "flex", alignItems: "center", gap: 14, cursor: "pointer", border: "1px solid var(--tg-border)", transition: "opacity 0.15s" }}>
            <div style={{ width: 50, height: 50, borderRadius: 14, background: bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Icon size={24} color={color} strokeWidth={1.7} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.35, marginBottom: 4 }}>{label}</div>
              <div style={{ fontSize: 12, color: "var(--tg-muted)" }}>{desc}</div>
            </div>
            <ChevronRight size={18} color="var(--tg-muted)" strokeWidth={1.6} />
          </div>
        ))}
      </div>
    </div>
  );
}
