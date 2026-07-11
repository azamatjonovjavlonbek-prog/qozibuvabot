import { useEffect, useState } from "react";
import { CheckCircle2, Download, Home, FileText, Smartphone, Calendar, Hash } from "lucide-react";

const tgBlue = "#2AABEE";
const tgDark = "#17212B";
const tgCard = "#232E3C";
const tgMuted = "#8B9EB5";
const tgGreen = "#4CAF84";

const RECEIPT = [
  { icon: FileText,    label: "Xizmat",       val: "Nikohdan ajratish arizasi" },
  { icon: CheckCircle2,label: "Miqdor",       val: "15 000 so'm" },
  { icon: Smartphone,  label: "To'lov usuli", val: "Payme" },
  { icon: Calendar,    label: "Sana",         val: "11.07.2026, 14:32" },
  { icon: Hash,        label: "Tranzaksiya",  val: "#TXN-2847651" },
];

export function Success() {
  const [show, setShow] = useState(false);
  useEffect(() => { const t = setTimeout(() => setShow(true), 200); return () => clearTimeout(t); }, []);

  return (
    <div style={{ background: tgDark, minHeight: "100vh", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", color: "#F5F5F5", maxWidth: 390, margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "28px 20px" }}>

      {/* Icon */}
      <div style={{ opacity: show ? 1 : 0, transform: show ? "scale(1)" : "scale(0.4)", transition: "all 0.55s cubic-bezier(0.34,1.56,0.64,1)", marginBottom: 22 }}>
        <div style={{ width: 96, height: 96, borderRadius: 28, background: `linear-gradient(135deg,${tgGreen},#2E7D52)`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 48px rgba(76,175,132,0.35)` }}>
          <CheckCircle2 size={48} color="#fff" strokeWidth={2} />
        </div>
      </div>

      {/* Title */}
      <div style={{ opacity: show ? 1 : 0, transform: show ? "translateY(0)" : "translateY(18px)", transition: "all 0.45s ease 0.2s", textAlign: "center", marginBottom: 22 }}>
        <div style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>To'lov muvaffaqiyatli!</div>
        <div style={{ fontSize: 14, color: tgMuted, lineHeight: 1.65, maxWidth: 280 }}>Ariza shabloni Telegram orqali yuborildi. Tekshiring.</div>
      </div>

      {/* Receipt */}
      <div style={{ opacity: show ? 1 : 0, transition: "opacity 0.4s ease 0.35s", width: "100%", background: tgCard, borderRadius: 18, padding: "16px 18px", marginBottom: 18 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: tgMuted, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 12 }}>To'lov cheki</div>
        {RECEIPT.map(({ icon: Icon, label, val }) => (
          <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
            <span style={{ fontSize: 13, color: tgMuted, display: "flex", alignItems: "center", gap: 7 }}>
              <Icon size={14} strokeWidth={1.7} />
              {label}
            </span>
            <span style={{ fontSize: 13, fontWeight: 600, maxWidth: 160, textAlign: "right" }}>{val}</span>
          </div>
        ))}
      </div>

      {/* Buttons */}
      <div style={{ opacity: show ? 1 : 0, transition: "opacity 0.4s ease 0.5s", width: "100%", display: "flex", flexDirection: "column", gap: 10 }}>
        <button style={{ width: "100%", background: `linear-gradient(135deg,${tgBlue},#1A8FD1)`, color: "#fff", border: "none", borderRadius: 14, padding: "15px 0", fontSize: 15, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 9 }}>
          <Download size={17} strokeWidth={2} /> Arizani yuklab olish
        </button>
        <button style={{ width: "100%", background: "rgba(255,255,255,0.06)", color: "#F5F5F5", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14, padding: "13px 0", fontSize: 14, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 9 }}>
          <Home size={16} strokeWidth={1.8} /> Bosh sahifaga qaytish
        </button>
      </div>
    </div>
  );
}
