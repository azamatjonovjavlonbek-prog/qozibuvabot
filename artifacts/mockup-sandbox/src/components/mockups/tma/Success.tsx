import { useState, useEffect } from "react";

const tgBlue = "#2AABEE";
const tgDark = "#17212B";
const tgCard = "#232E3C";
const tgMuted = "#8B9EB5";
const tgGreen = "#4CAF84";

export function Success() {
  const [show, setShow] = useState(false);
  useEffect(() => { setTimeout(() => setShow(true), 300); }, []);

  return (
    <div style={{ background: tgDark, minHeight: "100vh", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", color: "#F5F5F5", maxWidth: 390, margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px 20px" }}>
      {/* Success icon */}
      <div style={{ opacity: show ? 1 : 0, transform: show ? "scale(1)" : "scale(0.5)", transition: "all 0.5s cubic-bezier(0.34,1.56,0.64,1)", marginBottom: 24 }}>
        <div style={{ width: 100, height: 100, borderRadius: "50%", background: `linear-gradient(135deg, ${tgGreen}, #2E7D52)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 48, boxShadow: `0 0 40px rgba(76,175,132,0.4)` }}>✓</div>
      </div>

      {/* Text */}
      <div style={{ opacity: show ? 1 : 0, transform: show ? "translateY(0)" : "translateY(20px)", transition: "all 0.5s ease 0.2s", textAlign: "center", marginBottom: 24 }}>
        <div style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>To'lov muvaffaqiyatli!</div>
        <div style={{ fontSize: 15, color: tgMuted, lineHeight: 1.6 }}>Ariza shabloni elektron pochta va Telegram orqali yuborildi</div>
      </div>

      {/* Receipt */}
      <div style={{ opacity: show ? 1 : 0, transition: "opacity 0.5s ease 0.4s", width: "100%", background: tgCard, borderRadius: 16, padding: "16px 18px", marginBottom: 20 }}>
        <div style={{ fontSize: 12, color: tgMuted, marginBottom: 12, textTransform: "uppercase", letterSpacing: 0.5 }}>Chek</div>
        {[
          { label: "Xizmat", val: "Nikohdan ajratish arizasi" },
          { label: "Miqdor", val: "15 000 so'm" },
          { label: "To'lov usuli", val: "Payme" },
          { label: "Sana", val: "11.07.2026, 14:32" },
          { label: "Tranzaksiya", val: "#TXN-2847651" },
        ].map((r) => (
          <div key={r.label} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
            <span style={{ fontSize: 13, color: tgMuted }}>{r.label}</span>
            <span style={{ fontSize: 13, fontWeight: 500 }}>{r.val}</span>
          </div>
        ))}
      </div>

      {/* Download button */}
      <div style={{ opacity: show ? 1 : 0, transition: "opacity 0.5s ease 0.5s", width: "100%", display: "flex", flexDirection: "column", gap: 10 }}>
        <button style={{ width: "100%", background: `linear-gradient(135deg, ${tgBlue}, #1A8FD1)`, color: "#fff", border: "none", borderRadius: 14, padding: "15px 0", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
          📄 Arizani yuklab olish
        </button>
        <button style={{ width: "100%", background: "rgba(255,255,255,0.07)", color: "#F5F5F5", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14, padding: "13px 0", fontSize: 14, fontWeight: 500, cursor: "pointer" }}>
          🏠 Bosh sahifaga qaytish
        </button>
      </div>
    </div>
  );
}
