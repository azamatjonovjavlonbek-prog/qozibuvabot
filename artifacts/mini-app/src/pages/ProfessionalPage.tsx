import { useState, useRef } from "react";
import { ChevronLeft, Scale, Star, ArrowRight, Upload, ImageIcon, Loader2, CheckCircle2, AlertCircle, X, FileText, Plus } from "lucide-react";
import { tg } from "@/lib/tg";

interface Props { onBack: () => void; }
type Step = "info" | "form" | "uploading" | "sent";

function getInitData(): string {
  try { return tg.initData ?? ""; } catch { return ""; }
}

function getApiBase(): string {
  const base = import.meta.env.BASE_URL as string | undefined;
  return (base ?? "").replace(/\/$/, "").replace(/\/mini-app$/, "") + "/api";
}

interface AttachedFile { file: File; preview: string | null; }

export function ProfessionalPage({ onBack }: Props) {
  const [step, setStep]               = useState<Step>("info");
  const [description, setDescription] = useState("");
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const descOk = description.trim().length >= 20;

  function addFiles(newFiles: FileList | null) {
    if (!newFiles) return;
    const toAdd = Array.from(newFiles).slice(0, 5 - attachedFiles.length);
    toAdd.forEach((file) => {
      const isImage = file.type.startsWith("image/");
      if (isImage) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          setAttachedFiles((prev) => [...prev, { file, preview: ev.target?.result as string }]);
        };
        reader.readAsDataURL(file);
      } else {
        setAttachedFiles((prev) => [...prev, { file, preview: null }]);
      }
    });
  }

  function removeFile(idx: number) {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== idx));
  }

  async function handleSubmit() {
    if (!descOk) return;
    setStep("uploading");
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append("description", description.trim());
      formData.append("initData", getInitData());
      attachedFiles.forEach(({ file }) => formData.append("files", file));

      const res = await fetch(`${getApiBase()}/professional/submit`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({})) as { error?: string };
        throw new Error(err.error ?? "submit_failed");
      }
      setStep("sent");
    } catch {
      setStep("form");
      setUploadError("Yuborishda xato yuz berdi. Qaytadan urinib ko'ring.");
    }
  }

  /* ── SENT ── */
  if (step === "sent") {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: 32, textAlign: "center" }}>
        <div style={{ width: 88, height: 88, borderRadius: 26, background: "rgba(251,146,60,0.15)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 22 }}>
          <CheckCircle2 size={44} color="#FB923C" strokeWidth={1.5} />
        </div>
        <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 10 }}>Yuristga yuborildi!</div>
        <div style={{ fontSize: 14, color: "var(--tg-muted)", lineHeight: 1.75, maxWidth: 280 }}>
          Arizangiz ko'rib chiqiladi. Narx belgilangach <strong style={{ color: "var(--tg-text)" }}>bot orqali</strong> xabar olasiz.
        </div>
        <div style={{ marginTop: 28, background: "rgba(251,146,60,0.08)", border: "1px solid rgba(251,146,60,0.2)", borderRadius: 14, padding: "14px 18px", textAlign: "left", maxWidth: 300, width: "100%" }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#FB923C", marginBottom: 8 }}>Keyingi qadamlar:</div>
          {["Yurist masalangizni ko'rib chiqadi", "Narx belgilanib, botda xabar keladi", "To'lovdan so'ng yurist bog'lanadi", "Tayyor ariza Telegram orqali yuboriladi"].map((s, i) => (
            <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 6 }}>
              <span style={{ fontSize: 11, color: "#FB923C", fontWeight: 700, minWidth: 16 }}>{i + 1}.</span>
              <span style={{ fontSize: 12, color: "var(--tg-muted)", lineHeight: 1.5 }}>{s}</span>
            </div>
          ))}
        </div>
        <button onClick={onBack} style={{ marginTop: 24, background: "transparent", border: "1px solid var(--tg-border)", borderRadius: 12, padding: "10px 28px", color: "var(--tg-muted)", fontSize: 13, cursor: "pointer" }}>
          Bosh sahifaga
        </button>
      </div>
    );
  }

  /* ── UPLOADING ── */
  if (step === "uploading") {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", gap: 16 }}>
        <Loader2 size={48} color="#FB923C" style={{ animation: "spin 1s linear infinite" }} />
        <div style={{ fontSize: 16, fontWeight: 700 }}>Yuborilmoqda...</div>
        <div style={{ fontSize: 13, color: "var(--tg-muted)" }}>Bir oz kuting</div>
      </div>
    );
  }

  /* ── FORM ── */
  if (step === "form") {
    return (
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <div style={{ background: "var(--tg-header)", padding: "16px", display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid var(--tg-border)" }}>
          <div onClick={() => setStep("info")} style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <ChevronLeft size={20} strokeWidth={2} />
          </div>
          <div>
            <div style={{ fontSize: 17, fontWeight: 700 }}>Ariza ma'lumotlari</div>
            <div style={{ fontSize: 12, color: "var(--tg-muted)" }}>Yuristga yuboriladigan</div>
          </div>
        </div>

        <div style={{ padding: 16, flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 14 }}>

          {/* Description */}
          <div style={{ background: "var(--tg-card)", borderRadius: 16, padding: 16, border: "1px solid var(--tg-border)" }}>
            <div style={{ fontSize: 11, color: "var(--tg-muted)", fontWeight: 600, letterSpacing: "0.5px", textTransform: "uppercase", marginBottom: 10 }}>
              Masala haqida * (min. 20 belgi)
            </div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Masalan: Nikohdan ajrashdim, ikkita bola bor, aliment to'lashdan bosh tortmoqda. Sudga ariza kerak..."
              rows={6}
              style={{ width: "100%", background: "transparent", border: "none", outline: "none", color: "var(--tg-text)", fontSize: 14, lineHeight: 1.65, resize: "none", fontFamily: "inherit", boxSizing: "border-box" }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, borderTop: "1px solid var(--tg-border)", paddingTop: 8 }}>
              <span style={{ fontSize: 11, color: "var(--tg-muted)" }}>
                {description.trim().length < 20 ? `Yana ${20 - description.trim().length} ta belgi` : "✓ Yetarli"}
              </span>
              <span style={{ fontSize: 11, color: "var(--tg-muted)" }}>{description.length} belgi</span>
            </div>
          </div>

          {/* Files */}
          <div style={{ background: "var(--tg-card)", borderRadius: 16, padding: 16, border: "1px solid var(--tg-border)" }}>
            <div style={{ fontSize: 11, color: "var(--tg-muted)", fontWeight: 600, letterSpacing: "0.5px", textTransform: "uppercase", marginBottom: 10 }}>
              Hujjatlar / Rasmlar (ixtiyoriy, max 5)
            </div>

            <input ref={fileInputRef} type="file" accept="image/*,.pdf,.doc,.docx" multiple onChange={(e) => addFiles(e.target.files)} style={{ display: "none" }} />

            {attachedFiles.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 10 }}>
                {attachedFiles.map((af, idx) => (
                  <div key={idx} style={{ position: "relative", width: 72, height: 72, borderRadius: 12, overflow: "hidden", border: "1px solid var(--tg-border)", background: "var(--tg-bg)", flexShrink: 0 }}>
                    {af.preview ? (
                      <img src={af.preview} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2 }}>
                        <FileText size={20} color="var(--tg-muted)" strokeWidth={1.5} />
                        <span style={{ fontSize: 8, color: "var(--tg-muted)", textAlign: "center", padding: "0 4px", wordBreak: "break-all" }}>
                          {af.file.name.split(".").pop()?.toUpperCase()}
                        </span>
                      </div>
                    )}
                    <button onClick={() => removeFile(idx)} style={{ position: "absolute", top: 3, right: 3, width: 20, height: 20, borderRadius: "50%", background: "rgba(0,0,0,0.65)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                      <X size={11} color="#fff" strokeWidth={2.5} />
                    </button>
                  </div>
                ))}
                {attachedFiles.length < 5 && (
                  <div onClick={() => fileInputRef.current?.click()} style={{ width: 72, height: 72, borderRadius: 12, border: "2px dashed rgba(251,146,60,0.3)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                    <Plus size={22} color="#FB923C" strokeWidth={1.8} />
                  </div>
                )}
              </div>
            )}

            {attachedFiles.length === 0 && (
              <button onClick={() => fileInputRef.current?.click()} style={{ width: "100%", background: "rgba(251,146,60,0.06)", border: "2px dashed rgba(251,146,60,0.25)", borderRadius: 14, padding: "20px 0", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(251,146,60,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <ImageIcon size={20} color="#FB923C" strokeWidth={1.6} />
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#FB923C" }}>Rasm yoki hujjat qo'shish</div>
                <div style={{ fontSize: 11, color: "var(--tg-muted)" }}>JPG, PNG, PDF, DOC (max 5 ta)</div>
              </button>
            )}
          </div>

          {uploadError && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 10 }}>
              <AlertCircle size={14} color="#EF4444" />
              <span style={{ fontSize: 12, color: "#EF4444" }}>{uploadError}</span>
            </div>
          )}

          <div style={{ background: "rgba(251,146,60,0.07)", border: "1px solid rgba(251,146,60,0.2)", borderRadius: 12, padding: "10px 14px" }}>
            <div style={{ fontSize: 12, color: "var(--tg-muted)", lineHeight: 1.6 }}>
              💡 Masalangizni qanchalik batafsil yozsangiz, yurist shunchalik tez va to'g'ri ariza yozib bera oladi.
            </div>
          </div>
        </div>

        <div style={{ padding: "12px 16px 24px", borderTop: "1px solid var(--tg-border)", display: "flex", flexDirection: "column", gap: 10 }}>
          <button
            onClick={() => void handleSubmit()}
            disabled={!descOk}
            style={{ width: "100%", background: descOk ? "linear-gradient(135deg,#FB923C,#C2410C)" : "var(--tg-card)", color: descOk ? "#fff" : "var(--tg-muted)", border: descOk ? "none" : "1px solid var(--tg-border)", borderRadius: 14, padding: "15px 0", fontSize: 15, fontWeight: 700, cursor: descOk ? "pointer" : "default", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "all 0.2s" }}
          >
            <Upload size={17} strokeWidth={2} />
            Yuristga yuborish
          </button>
          <button onClick={() => setStep("info")} style={{ background: "transparent", border: "none", color: "var(--tg-muted)", fontSize: 13, padding: "8px 0", cursor: "pointer" }}>
            Bekor qilish
          </button>
        </div>
      </div>
    );
  }

  /* ── INFO ── */
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <div style={{ background: "var(--tg-header)", padding: "16px", display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid var(--tg-border)" }}>
        <div onClick={onBack} style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <ChevronLeft size={20} strokeWidth={2} />
        </div>
        <div>
          <div style={{ fontSize: 17, fontWeight: 700 }}>Professional ariza</div>
          <div style={{ fontSize: 12, color: "var(--tg-muted)" }}>Yurist tomonidan yoziladi</div>
        </div>
      </div>

      <div style={{ padding: 16, flex: 1 }}>
        <div style={{ background: "linear-gradient(160deg,#2A1A00,#1A1208)", borderRadius: 18, padding: 20, marginBottom: 14, border: "1px solid rgba(251,146,60,0.25)" }}>
          <div style={{ width: 64, height: 64, borderRadius: 18, background: "rgba(251,146,60,0.2)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
            <Scale size={28} color="#FB923C" strokeWidth={1.6} />
          </div>
          <div style={{ fontSize: 18, fontWeight: 700, textAlign: "center", marginBottom: 8 }}>Professional ariza</div>
          <div style={{ fontSize: 13, color: "var(--tg-muted)", textAlign: "center", lineHeight: 1.65, marginBottom: 16 }}>
            Yuristimiz sizning holatingizga mos ariza yozib beradi.
          </div>
          <div style={{ background: "rgba(251,146,60,0.12)", borderRadius: 12, padding: "12px 16px", textAlign: "center" }}>
            <div style={{ fontSize: 12, color: "var(--tg-muted)", marginBottom: 4 }}>Narxi</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#FB923C" }}>199 000 – 1 000 000 so'm</div>
            <div style={{ fontSize: 11, color: "var(--tg-muted)", marginTop: 3 }}>Murakkablikka qarab belgilanadi</div>
          </div>
        </div>

        <div style={{ background: "var(--tg-card)", borderRadius: 16, padding: "4px 0", marginBottom: 14 }}>
          {[
            "Masalangizni batafsil yozing + hujjat/rasm yuklang",
            "Yurist ko'rib chiqib, narxni belgilaydi",
            "To'lovdan so'ng yurist siz bilan bog'lanadi",
            "Tayyor ariza Telegram orqali yuboriladi",
          ].map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "12px 16px", borderBottom: "1px solid var(--tg-border)" }}>
              <div style={{ width: 22, height: 22, borderRadius: 7, background: "rgba(251,146,60,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                <span style={{ fontSize: 11, fontWeight: 800, color: "#FB923C" }}>{i + 1}</span>
              </div>
              <span style={{ fontSize: 13, lineHeight: 1.45 }}>{s}</span>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          {[
            { icon: Star, label: "Shaxsiy yondashuv" },
            { icon: Scale, label: "Tajribali yurist" },
            { icon: CheckCircle2, label: "Kafolatlangan" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} style={{ flex: 1, background: "var(--tg-card)", borderRadius: 12, padding: "10px 8px", textAlign: "center", border: "1px solid var(--tg-border)" }}>
              <Icon size={18} color="#FB923C" style={{ marginBottom: 5 }} strokeWidth={1.6} />
              <div style={{ fontSize: 10, color: "var(--tg-muted)", lineHeight: 1.3 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: "12px 16px 24px", borderTop: "1px solid var(--tg-border)" }}>
        <button onClick={() => setStep("form")} style={{ width: "100%", background: "linear-gradient(135deg,#FB923C,#C2410C)", color: "#fff", border: "none", borderRadius: 14, padding: "15px 0", fontSize: 16, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 9 }}>
          Buyurtma berish <ArrowRight size={18} strokeWidth={2.2} />
        </button>
      </div>
    </div>
  );
}
