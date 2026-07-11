import { useState, useRef } from "react";
import { ChevronLeft, ChevronRight, FileText, Scale, Users, Car, Copy, Check, Upload, ImageIcon, Loader2, CheckCircle2, AlertCircle, ArrowRight, Info } from "lucide-react";
import { tg } from "@/lib/tg";

interface Props { onBack: () => void; }
type Step = "select" | "payment" | "uploading" | "sent";

interface Category { id: string; label: string; desc: string; icon: typeof Scale; color: string; bg: string; }

const CATEGORIES: Category[] = [
  { id: "divorce", icon: Scale,  label: "Nikohdan ajratish arizasi",       desc: "Fuqarolik holati aktlari bo'yicha sud arizasi", color: "#F87171", bg: "rgba(248,113,113,0.12)" },
  { id: "aliment", icon: Users,  label: "Aliment undirish arizasi",         desc: "Bolaga aliment undirish uchun sud arizasi",       color: "#2AABEE", bg: "rgba(42,171,238,0.12)" },
  { id: "radar",   icon: Car,    label: "Multiradar jarima bekor qilish",   desc: "Yo'l harakati jarimalari bo'yicha ariza",          color: "#4CAF84", bg: "rgba(76,175,132,0.12)" },
];

const CARD_NUMBER = "9860 3501 4913 3539";
const CARD_OWNER  = "Javlonbek Azamatjonov";
const PRICE       = "29 000 so'm";

function getInitData(): string { try { return tg.initData ?? ""; } catch { return ""; } }
function getApiBase(): string {
  const base = import.meta.env.BASE_URL as string | undefined;
  return (base ?? "").replace(/\/$/, "").replace(/\/mini-app$/, "") + "/api";
}

export function ArizaCatalog({ onBack }: Props) {
  const [step, setStep]       = useState<Step>("select");
  const [selected, setSelected] = useState<Category | null>(null);
  const [copied, setCopied]   = useState(false);
  const [file, setFile]       = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError]     = useState<string | null>(null);
  const fileInputRef          = useRef<HTMLInputElement>(null);

  function selectCat(cat: Category) {
    setSelected(cat);
    setFile(null);
    setPreview(null);
    setError(null);
    setStep("payment");
  }

  function copyCard() {
    navigator.clipboard.writeText(CARD_NUMBER).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setError(null);
    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target?.result as string);
    reader.readAsDataURL(f);
  }

  async function handleSubmit() {
    if (!file || !selected) return;
    setStep("uploading");
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("catId", selected.id);
      formData.append("initData", getInitData());

      const res = await fetch(`${getApiBase()}/shablon/pay`, { method: "POST", body: formData });
      if (!res.ok) {
        const err = await res.json().catch(() => ({})) as { error?: string };
        throw new Error(err.error ?? "failed");
      }
      setStep("sent");
    } catch {
      setStep("payment");
      setError("Yuborishda xato yuz berdi. Qaytadan urinib ko'ring.");
    }
  }

  /* ── SENT ── */
  if (step === "sent") return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: 32, textAlign: "center" }}>
      <div style={{ width: 88, height: 88, borderRadius: 26, background: "rgba(42,171,238,0.15)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 22 }}>
        <CheckCircle2 size={44} color="#2AABEE" strokeWidth={1.5} />
      </div>
      <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 10 }}>Chek yuborildi!</div>
      <div style={{ fontSize: 14, color: "var(--tg-muted)", lineHeight: 1.75, maxWidth: 280 }}>
        Administrator tekshirib, tasdiqlangach <strong style={{ color: "var(--tg-text)" }}>ariza fayli</strong> bot orqali avtomatik yuboriladi.
      </div>
      <div style={{ marginTop: 20, background: "rgba(42,171,238,0.08)", border: "1px solid rgba(42,171,238,0.2)", borderRadius: 14, padding: "12px 16px", maxWidth: 300, width: "100%" }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#2AABEE", marginBottom: 6, display: "flex", alignItems: "center", gap: 5 }}><FileText size={12} color="#2AABEE" strokeWidth={2} />{selected?.label}</div>
        <div style={{ fontSize: 11, color: "var(--tg-muted)", lineHeight: 1.5 }}>Tasdiqlangandan so'ng Word formatida ariza sizning Telegram chatga yuboriladi.</div>
      </div>
      <button onClick={onBack} style={{ marginTop: 22, background: "transparent", border: "1px solid var(--tg-border)", borderRadius: 12, padding: "10px 28px", color: "var(--tg-muted)", fontSize: 13, cursor: "pointer" }}>
        Bosh sahifaga
      </button>
    </div>
  );

  /* ── UPLOADING ── */
  if (step === "uploading") return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", gap: 14 }}>
      <Loader2 size={48} color="#2AABEE" style={{ animation: "spin 1s linear infinite" }} />
      <div style={{ fontSize: 16, fontWeight: 700 }}>Chek yuborilmoqda...</div>
    </div>
  );

  /* ── PAYMENT ── */
  if (step === "payment" && selected) return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <div style={{ background: "var(--tg-header)", padding: "16px", display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid var(--tg-border)" }}>
        <div onClick={() => setStep("select")} style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <ChevronLeft size={20} strokeWidth={2} />
        </div>
        <div>
          <div style={{ fontSize: 17, fontWeight: 700 }}>To'lov ma'lumotlari</div>
          <div style={{ fontSize: 12, color: "var(--tg-muted)" }}>Ariza shablon uchun</div>
        </div>
      </div>

      <div style={{ padding: 16, flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 12 }}>

        {/* Tanlangan ariza */}
        <div style={{ background: "var(--tg-card)", borderRadius: 16, padding: 14, border: "1px solid var(--tg-border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 11, color: "var(--tg-muted)", marginBottom: 3 }}>Tanlangan ariza</div>
            <div style={{ fontSize: 14, fontWeight: 700 }}>{selected.label}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 11, color: "var(--tg-muted)", marginBottom: 3 }}>Narx</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#2AABEE" }}>{PRICE}</div>
          </div>
        </div>

        {/* Karta */}
        <div style={{ background: "var(--tg-card)", borderRadius: 16, padding: 16, border: "1px solid var(--tg-border)" }}>
          <div style={{ fontSize: 11, color: "var(--tg-muted)", fontWeight: 600, letterSpacing: "0.5px", textTransform: "uppercase", marginBottom: 10 }}>Karta ma'lumotlari</div>
          <button onClick={copyCard} style={{ width: "100%", background: "rgba(42,171,238,0.08)", border: "1.5px dashed rgba(42,171,238,0.35)", borderRadius: 12, padding: "14px 16px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontSize: 11, color: "var(--tg-muted)", marginBottom: 4 }}>Karta raqami (bosib nusxa oling)</div>
              <div style={{ fontSize: 19, fontWeight: 800, letterSpacing: "2px", color: "var(--tg-text)", fontFamily: "monospace" }}>{CARD_NUMBER}</div>
            </div>
            <div style={{ width: 34, height: 34, borderRadius: 9, background: copied ? "rgba(76,175,132,0.15)" : "rgba(42,171,238,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              {copied ? <Check size={16} color="#4CAF84" strokeWidth={2.2} /> : <Copy size={16} color="#2AABEE" strokeWidth={2} />}
            </div>
          </button>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 2px" }}>
            <span style={{ fontSize: 13, color: "var(--tg-muted)" }}>Karta egasi</span>
            <span style={{ fontSize: 14, fontWeight: 700 }}>{CARD_OWNER}</span>
          </div>
        </div>

        {/* Chek yuklash */}
        <div style={{ background: "var(--tg-card)", borderRadius: 16, padding: 16, border: "1px solid var(--tg-border)" }}>
          <div style={{ fontSize: 11, color: "var(--tg-muted)", fontWeight: 600, letterSpacing: "0.5px", textTransform: "uppercase", marginBottom: 10 }}>To'lov cheki (screenshot)</div>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} style={{ display: "none" }} />
          {preview ? (
            <div style={{ position: "relative", marginBottom: 8 }}>
              <img src={preview} alt="Chek" style={{ width: "100%", maxHeight: 200, objectFit: "contain", borderRadius: 12, background: "rgba(255,255,255,0.04)", border: "1px solid var(--tg-border)" }} />
              <button onClick={() => fileInputRef.current?.click()} style={{ position: "absolute", top: 8, right: 8, background: "rgba(0,0,0,0.6)", border: "none", borderRadius: 8, padding: "6px 10px", color: "#fff", fontSize: 12, cursor: "pointer" }}>O'zgartirish</button>
            </div>
          ) : (
            <button onClick={() => fileInputRef.current?.click()} style={{ width: "100%", background: "rgba(42,171,238,0.06)", border: "2px dashed rgba(42,171,238,0.3)", borderRadius: 14, padding: "22px 0", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              <div style={{ width: 46, height: 46, borderRadius: 13, background: "rgba(42,171,238,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <ImageIcon size={22} color="#2AABEE" strokeWidth={1.6} />
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#2AABEE" }}>Chek rasmini tanlang</div>
              <div style={{ fontSize: 12, color: "var(--tg-muted)" }}>To'lov cheki (screenshot)</div>
            </button>
          )}
          {error && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10, padding: "10px 12px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 10 }}>
              <AlertCircle size={14} color="#EF4444" />
              <span style={{ fontSize: 12, color: "#EF4444" }}>{error}</span>
            </div>
          )}
        </div>

        <div style={{ background: "rgba(42,171,238,0.07)", border: "1px solid rgba(42,171,238,0.2)", borderRadius: 12, padding: "10px 14px" }}>
          <div style={{ fontSize: 12, color: "var(--tg-muted)", lineHeight: 1.6, display: "flex", alignItems: "flex-start", gap: 7 }}>
            <Info size={13} color="#2AABEE" strokeWidth={2} style={{ flexShrink: 0, marginTop: 1 }} />
            <span>To'lovdan so'ng chek rasmini yuklang. Administrator tasdiqlashi bilan <strong style={{ color: "var(--tg-text)" }}>Word formatidagi ariza</strong> botga avtomatik yuboriladi.</span>
          </div>
        </div>
      </div>

      <div style={{ padding: "12px 16px 24px", borderTop: "1px solid var(--tg-border)", display: "flex", flexDirection: "column", gap: 10 }}>
        <button onClick={() => void handleSubmit()} style={{ width: "100%", background: file ? "linear-gradient(135deg,#2AABEE,#1A8FD1)" : "var(--tg-card)", color: file ? "#fff" : "var(--tg-muted)", border: file ? "none" : "1px solid var(--tg-border)", borderRadius: 14, padding: "15px 0", fontSize: 15, fontWeight: 700, cursor: file ? "pointer" : "default", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "all 0.2s" }}>
          <Upload size={18} strokeWidth={2} />
          {file ? "Chekni yuborish" : "Avval chekni tanlang"}
        </button>
        <button onClick={() => setStep("select")} style={{ background: "transparent", border: "none", color: "var(--tg-muted)", fontSize: 13, padding: "8px 0", cursor: "pointer" }}>Bekor qilish</button>
      </div>
    </div>
  );

  /* ── SELECT ── */
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
            <div style={{ fontSize: 12, color: "var(--tg-muted)" }}>{PRICE} • Word formatda</div>
          </div>
        </div>
      </div>

      <div style={{ padding: "14px 16px 24px", flex: 1 }}>
        <div style={{ background: "rgba(42,171,238,0.06)", border: "1px solid rgba(42,171,238,0.18)", borderRadius: 14, padding: "13px 15px", marginBottom: 18, display: "flex", gap: 12, alignItems: "center" }}>
          <div style={{ width: 38, height: 38, borderRadius: 11, background: "rgba(42,171,238,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <FileText size={17} color="#2AABEE" strokeWidth={1.8} />
          </div>
          <div style={{ fontSize: 13, color: "var(--tg-muted)", lineHeight: 1.55 }}>
            Ariza turini tanlang → to'lovni amalga oshiring → chek yuboring → <b style={{ color: "#2AABEE" }}>Word ariza avtomatik yuboriladi</b>
          </div>
        </div>

        <div style={{ fontSize: 11, fontWeight: 700, color: "var(--tg-muted)", marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.8 }}>Mavjud arizalar</div>

        {CATEGORIES.map(({ id, icon: Icon, label, color, bg, desc }) => (
          <div key={id} onClick={() => selectCat({ id, icon: Icon, label, color, bg, desc })}
            style={{ background: "var(--tg-card)", borderRadius: 16, padding: "16px 15px", marginBottom: 10, display: "flex", alignItems: "center", gap: 14, cursor: "pointer", border: "1px solid var(--tg-border)" }}>
            <div style={{ width: 50, height: 50, borderRadius: 14, background: bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Icon size={24} color={color} strokeWidth={1.7} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.35, marginBottom: 4 }}>{label}</div>
              <div style={{ fontSize: 12, color: "var(--tg-muted)" }}>{desc}</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4, flexShrink: 0 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color }}>{PRICE}</span>
              <ArrowRight size={16} color="var(--tg-muted)" strokeWidth={1.6} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
