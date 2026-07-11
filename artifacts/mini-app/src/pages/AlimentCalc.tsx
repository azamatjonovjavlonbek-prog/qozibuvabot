import { useState } from "react";
import { ChevronLeft, Calculator, CheckCircle2, RefreshCw } from "lucide-react";

interface Props { onBack: () => void; }

type Status = "employed" | "unemployed" | null;
type Children = "1" | "2" | "3" | "3plus" | null;

const MZOT = 1_271_000;
const AVG_SALARY = 6_461_299;

function fmt(n: number) { return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " "); }

function calcAliment(salary: number, children: Exclude<Children, null>) {
  const fractions: Record<string, [number, string, number]> = {
    "1":    [1 / 4, "1/4 (25%)",    1],
    "2":    [1 / 3, "1/3 (33,3%)",  2],
    "3":    [1 / 2, "1/2 (50%)",    3],
    "3plus":[1 / 2, "1/2 (50%)",    3],
  };
  const [fraction, label, count] = fractions[children]!;
  const amount = Math.round(salary * fraction);
  const minPerChild = Math.round(MZOT * 0.265);
  return { amount, label, count, minPerChild, minTotal: minPerChild * count };
}

export function AlimentCalc({ onBack }: Props) {
  const [status, setStatus] = useState<Status>(null);
  const [salaryInput, setSalaryInput] = useState("");
  const [children, setChildren] = useState<Children>(null);
  const [result, setResult] = useState<ReturnType<typeof calcAliment> | null>(null);

  const salary = status === "unemployed" ? AVG_SALARY : (parseInt(salaryInput.replace(/\s/g, "")) || 0);
  const canCalc = status !== null && children !== null && (status === "unemployed" || salary > 0);

  function calculate() {
    if (!canCalc || !children) return;
    setResult(calcAliment(salary, children));
  }

  function reset() {
    setStatus(null);
    setSalaryInput("");
    setChildren(null);
    setResult(null);
  }

  const CHILD_OPTIONS = [
    { id: "1" as const,    label: "1 ta bola" },
    { id: "2" as const,    label: "2 ta bola" },
    { id: "3" as const,    label: "3 ta bola" },
    { id: "3plus" as const,label: "3 va undan ortiq" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <div style={{ background: "var(--tg-header)", padding: "16px", display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid var(--tg-border)" }}>
        <div onClick={onBack} style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <ChevronLeft size={20} strokeWidth={2} />
        </div>
        <div>
          <div style={{ fontSize: 17, fontWeight: 700 }}>Aliment kalkulyatori</div>
          <div style={{ fontSize: 12, color: "var(--tg-muted)" }}>Oila kodeksi 99-moddasiga asosan</div>
        </div>
      </div>

      <div style={{ padding: "16px", flex: 1 }}>

        {result ? (
          /* Result screen */
          <div>
            <div style={{ background: "var(--tg-card)", borderRadius: 18, padding: 20, marginBottom: 12 }}>
              <div style={{ textAlign: "center", marginBottom: 20 }}>
                <div style={{ width: 64, height: 64, borderRadius: 18, background: "rgba(76,175,132,0.15)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
                  <CheckCircle2 size={28} color="#4CAF84" strokeWidth={1.6} />
                </div>
                <div style={{ fontSize: 13, color: "var(--tg-muted)", marginBottom: 6 }}>Hisoblangan aliment miqdori</div>
                <div style={{ fontSize: 34, fontWeight: 800, color: "#4CAF84" }}>{fmt(result.amount)} so'm</div>
                <div style={{ fontSize: 12, color: "var(--tg-muted)", marginTop: 4 }}>oyiga</div>
              </div>

              <div style={{ borderTop: "1px solid var(--tg-border)", paddingTop: 16 }}>
                {[
                  { label: "Ulush",        val: result.label },
                  { label: "Bolalar soni", val: `${result.count} ta` },
                  { label: "Ish haqi asosi", val: `${fmt(salary)} so'm` },
                  { label: "Qonuniy minimum (1 bola uchun)", val: `${fmt(result.minPerChild)} so'm/oy` },
                  ...(result.count > 1 ? [{ label: "Jami minimum", val: `${fmt(result.minTotal)} so'm/oy` }] : []),
                ].map(({ label, val }) => (
                  <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--tg-border)", fontSize: 13 }}>
                    <span style={{ color: "var(--tg-muted)" }}>{label}</span>
                    <span style={{ fontWeight: 600 }}>{val}</span>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 14, background: "rgba(251,185,36,0.08)", border: "1px solid rgba(251,185,36,0.2)", borderRadius: 12, padding: "12px 14px", fontSize: 12, color: "var(--tg-muted)", lineHeight: 1.6 }}>
                ⚠️ Agar hisoblangan miqdor qonuniy minimumdan past bo'lsa, sud minimumni belgilaydi. Hisob taxminiy — aniq miqdor sud qarori bilan belgilanadi.
              </div>
            </div>

            <button onClick={reset} style={{ width: "100%", background: "rgba(255,255,255,0.07)", color: "var(--tg-text)", border: "1px solid var(--tg-border)", borderRadius: 14, padding: "13px 0", fontSize: 15, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <RefreshCw size={16} /> Qaytadan hisoblash
            </button>
          </div>
        ) : (
          /* Input form */
          <>
            {/* Status selection */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10, color: "var(--tg-muted)" }}>Qarzdorning holati:</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {[
                  { id: "employed" as const, label: "Ishlaydi", emoji: "💼" },
                  { id: "unemployed" as const, label: "Ishlamaydi", emoji: "🏠" },
                ].map(({ id, label, emoji }) => (
                  <div key={id} onClick={() => setStatus(id)}
                    style={{ background: status === id ? "rgba(42,171,238,0.18)" : "var(--tg-card)", border: `1.5px solid ${status === id ? "#2AABEE" : "var(--tg-border)"}`, borderRadius: 14, padding: "14px 12px", textAlign: "center", cursor: "pointer" }}>
                    <div style={{ fontSize: 24, marginBottom: 6 }}>{emoji}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: status === id ? "#2AABEE" : "var(--tg-text)" }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Salary input (only for employed) */}
            {status === "employed" && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10, color: "var(--tg-muted)" }}>Oylik ish haqi (so'm):</div>
                <input
                  type="number"
                  inputMode="numeric"
                  placeholder="Masalan: 3 000 000"
                  value={salaryInput}
                  onChange={e => setSalaryInput(e.target.value)}
                  style={{ width: "100%", background: "var(--tg-card)", border: "1.5px solid var(--tg-border)", borderRadius: 12, padding: "14px 16px", fontSize: 15, color: "var(--tg-text)", outline: "none" }}
                />
              </div>
            )}

            {/* Unemployed info */}
            {status === "unemployed" && (
              <div style={{ background: "rgba(251,185,36,0.08)", border: "1px solid rgba(251,185,36,0.2)", borderRadius: 12, padding: "12px 14px", marginBottom: 16, fontSize: 12, color: "var(--tg-muted)", lineHeight: 1.6 }}>
                💡 Ishlamaydigan qarzdorlar uchun O'zbekiston bo'yicha o'rtacha oylik maosh asosida hisoblanadi: <b style={{ color: "#FBB924" }}>{fmt(AVG_SALARY)} so'm</b>
              </div>
            )}

            {/* Children count */}
            {status !== null && (status === "unemployed" || salary > 0) && (
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10, color: "var(--tg-muted)" }}>Bolalar soni:</div>
                {CHILD_OPTIONS.map(({ id, label }) => (
                  <div key={id} onClick={() => setChildren(id)}
                    style={{ background: children === id ? "rgba(42,171,238,0.15)" : "var(--tg-card)", border: `1.5px solid ${children === id ? "#2AABEE" : "var(--tg-border)"}`, borderRadius: 12, padding: "12px 16px", marginBottom: 6, cursor: "pointer", display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 20, height: 20, borderRadius: "50%", border: `2px solid ${children === id ? "#2AABEE" : "var(--tg-muted)"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      {children === id && <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#2AABEE" }} />}
                    </div>
                    <span style={{ fontSize: 14, fontWeight: children === id ? 600 : 400, color: children === id ? "#2AABEE" : "var(--tg-text)" }}>{label}</span>
                  </div>
                ))}
              </div>
            )}

            <button onClick={calculate} disabled={!canCalc}
              style={{ width: "100%", background: canCalc ? "linear-gradient(135deg,#FBB924,#E09000)" : "rgba(255,255,255,0.1)", color: canCalc ? "#000" : "var(--tg-muted)", border: "none", borderRadius: 14, padding: "15px 0", fontSize: 16, fontWeight: 700, cursor: canCalc ? "pointer" : "default", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <Calculator size={18} /> Hisoblash
            </button>
          </>
        )}
      </div>
    </div>
  );
}
