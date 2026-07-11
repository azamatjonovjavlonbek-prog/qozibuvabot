import { FileText, MessageCircle, Bot, Scale, ChevronRight, Sparkles, CheckCircle2 } from "lucide-react";
import { tgUser } from "@/lib/tg";

interface Props { onCatalog: () => void; }

const SERVICES = [
  { icon: FileText,      label: "Ariza shablonlari", sub: "15 000 so'm", color: "#2AABEE", bg: "rgba(42,171,238,0.15)", onClick: true },
  { icon: MessageCircle, label: "Konsultatsiya",      sub: "99 000 so'm", color: "#4CAF84", bg: "rgba(76,175,132,0.15)", onClick: true },
  { icon: Bot,           label: "Qozibuva AI",        sub: "50 000 so'm", color: "#A855F7", bg: "rgba(168,85,247,0.15)", onClick: true },
  { icon: Scale,         label: "Professional ariza", sub: "Murojaat",    color: "#FBB924", bg: "rgba(251,185,36,0.15)", onClick: false },
];

export function Home({ onCatalog }: Props) {
  const name = tgUser?.first_name ?? "Foydalanuvchi";

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(180deg,#1A3A52,#1E2D40)", padding: "20px 16px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 44, height: 44, borderRadius: 14, background: "linear-gradient(135deg,#2AABEE,#1A8FD1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Scale size={22} color="#fff" strokeWidth={2} />
          </div>
          <div>
            <div style={{ fontSize: 17, fontWeight: 700 }}>Qozibuva</div>
            <div style={{ fontSize: 12, color: "var(--tg-muted)" }}>Huquqiy xizmatlar platformasi</div>
          </div>
        </div>
      </div>

      {/* Welcome */}
      <div style={{ margin: "14px 16px 0", background: "linear-gradient(135deg,#2AABEE,#1A8FD1)", borderRadius: 18, padding: "18px 20px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -24, right: -24, width: 110, height: 110, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", marginBottom: 3 }}>Xush kelibsiz,</div>
        <div style={{ fontSize: 19, fontWeight: 700, marginBottom: 10 }}>{name}</div>
        <div style={{ display: "flex", gap: 8 }}>
          <span style={{ background: "rgba(255,255,255,0.22)", borderRadius: 20, padding: "4px 10px", fontSize: 12, display: "flex", alignItems: "center", gap: 5 }}>
            <Sparkles size={11} /> Onlayn xizmat
          </span>
          <span style={{ background: "rgba(255,255,255,0.22)", borderRadius: 20, padding: "4px 10px", fontSize: 12, display: "flex", alignItems: "center", gap: 5 }}>
            <CheckCircle2 size={11} /> O'zbekiston
          </span>
        </div>
      </div>

      {/* Services grid */}
      <div style={{ margin: "16px 16px 0" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "var(--tg-muted)", marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.8 }}>Xizmatlar</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {SERVICES.map(({ icon: Icon, label, sub, color, bg, onClick }) => (
            <div key={label} onClick={onClick ? onCatalog : undefined} style={{ background: "var(--tg-card)", borderRadius: 16, padding: "16px 14px", cursor: onClick ? "pointer" : "default", border: "1px solid var(--tg-border)", opacity: onClick ? 1 : 0.5 }}>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: bg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10 }}>
                <Icon size={20} color={color} strokeWidth={1.8} />
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4, lineHeight: 1.3 }}>{label}</div>
              <div style={{ fontSize: 11, color, fontWeight: 600 }}>{sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Info card */}
      <div style={{ margin: "16px 16px 0" }}>
        <div style={{ background: "rgba(42,171,238,0.07)", border: "1px solid rgba(42,171,238,0.18)", borderRadius: 14, padding: "13px 15px", display: "flex", gap: 12, alignItems: "flex-start" }}>
          <CheckCircle2 size={18} color="#2AABEE" style={{ flexShrink: 0, marginTop: 1 }} />
          <div style={{ fontSize: 12, color: "var(--tg-muted)", lineHeight: 1.6 }}>
            Xizmat tanlang, buyurtmani tasdiqlang — bot sizga to'lov ma'lumotlarini yuboradi.
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ padding: "16px", marginTop: "auto" }}>
        <button onClick={onCatalog} style={{ width: "100%", background: "linear-gradient(135deg,#2AABEE,#1A8FD1)", color: "#fff", border: "none", borderRadius: 14, padding: "15px 0", fontSize: 16, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          Xizmatni tanlash <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
