import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, FileText, Clock, CheckCircle2, XCircle, CreditCard, RefreshCw, Inbox } from "lucide-react";
import { tg } from "@/lib/tg";

interface Props { onBack: () => void; }

interface ProfRequest {
  id: number;
  description: string;
  status: "pending" | "priced" | "completed" | "rejected";
  price: number | null;
  createdAt: string;
}

function getInitData(): string {
  try { return tg.initData ?? ""; } catch { return ""; }
}

function getApiBase(): string {
  const base = import.meta.env.BASE_URL as string | undefined;
  return (base ?? "").replace(/\/$/, "").replace(/\/mini-app$/, "") + "/api";
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("uz-Latn-UZ", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function formatPrice(p: number): string {
  return p.toLocaleString("uz-UZ") + " so'm";
}

function StatusBadge({ status, price }: { status: ProfRequest["status"]; price: number | null }) {
  const map = {
    pending:   { label: "Ko'rib chiqilmoqda", color: "#FBB924", bg: "rgba(251,185,36,0.12)", icon: Clock },
    priced:    { label: "To'lov kutilmoqda",   color: "#2AABEE", bg: "rgba(42,171,238,0.12)",  icon: CreditCard },
    completed: { label: "Bajarildi",            color: "#4CAF84", bg: "rgba(76,175,132,0.12)",  icon: CheckCircle2 },
    rejected:  { label: "Rad etildi",           color: "#EF4444", bg: "rgba(239,68,68,0.12)",   icon: XCircle },
  };
  const { label, color, bg, icon: Icon } = map[status] ?? map.pending;
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 5, background: bg, borderRadius: 8, padding: "4px 10px" }}>
      <Icon size={12} color={color} strokeWidth={2.2} />
      <span style={{ fontSize: 11, fontWeight: 700, color }}>{label}{status === "priced" && price ? ` — ${formatPrice(price)}` : ""}</span>
    </div>
  );
}

export function MyRequestsPage({ onBack }: Props) {
  const [requests, setRequests] = useState<ProfRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${getApiBase()}/professional/my-requests`, {
        headers: { "x-init-data": getInitData() },
      });
      if (!res.ok) throw new Error("fetch_failed");
      const data = await res.json() as { requests: ProfRequest[] };
      setRequests(data.requests);
    } catch {
      setError("Ma'lumotlarni yuklab bo'lmadi.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <div style={{ background: "var(--tg-header)", padding: "16px", display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid var(--tg-border)" }}>
        <div onClick={onBack} style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <ChevronLeft size={20} strokeWidth={2} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 17, fontWeight: 700 }}>Mening arizalarim</div>
          <div style={{ fontSize: 12, color: "var(--tg-muted)" }}>Professional arizalar tarixi</div>
        </div>
        <div onClick={() => void load()} style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <RefreshCw size={16} strokeWidth={2} style={loading ? { animation: "spin 1s linear infinite" } : {}} />
        </div>
      </div>

      <div style={{ padding: 16, flex: 1 }}>
        {loading && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 200 }}>
            <RefreshCw size={28} color="#4CAF84" style={{ animation: "spin 1s linear infinite" }} />
          </div>
        )}

        {!loading && error && (
          <div style={{ textAlign: "center", padding: 32 }}>
            <div style={{ fontSize: 14, color: "#EF4444", marginBottom: 12 }}>{error}</div>
            <button onClick={() => void load()} style={{ background: "var(--tg-card)", border: "1px solid var(--tg-border)", borderRadius: 10, padding: "8px 20px", color: "var(--tg-text)", cursor: "pointer", fontSize: 13 }}>
              Qayta urinish
            </button>
          </div>
        )}

        {!loading && !error && requests.length === 0 && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 280, gap: 12 }}>
            <div style={{ width: 70, height: 70, borderRadius: 20, background: "rgba(251,146,60,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Inbox size={32} color="#FB923C" strokeWidth={1.4} />
            </div>
            <div style={{ fontSize: 16, fontWeight: 700 }}>Arizalar yo'q</div>
            <div style={{ fontSize: 13, color: "var(--tg-muted)", textAlign: "center", maxWidth: 240, lineHeight: 1.6 }}>
              Siz hali professional ariza yubormagansiz. Buyurtma bering — yurist yozib beradi.
            </div>
          </div>
        )}

        {!loading && !error && requests.map((req) => (
          <div key={req.id} style={{ background: "var(--tg-card)", borderRadius: 16, padding: 16, marginBottom: 12, border: "1px solid var(--tg-border)" }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 32, height: 32, borderRadius: 10, background: "rgba(251,146,60,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <FileText size={15} color="#FB923C" strokeWidth={1.8} />
                </div>
                <div>
                  <div style={{ fontSize: 11, color: "var(--tg-muted)" }}>Ariza #{req.id}</div>
                  <div style={{ fontSize: 11, color: "var(--tg-muted)" }}>{formatDate(req.createdAt)}</div>
                </div>
              </div>
              <StatusBadge status={req.status} price={req.price} />
            </div>

            <div style={{ fontSize: 13, color: "var(--tg-muted)", lineHeight: 1.6, marginBottom: req.status === "priced" ? 12 : 0 }}>
              {req.description.length > 100 ? req.description.slice(0, 100) + "…" : req.description}
            </div>

            {req.status === "priced" && req.price && (
              <div style={{ background: "rgba(42,171,238,0.08)", border: "1px solid rgba(42,171,238,0.2)", borderRadius: 12, padding: "10px 12px", marginTop: 8 }}>
                <div style={{ fontSize: 12, color: "#2AABEE", fontWeight: 700, marginBottom: 4 }}>
                  💳 To'lov: {formatPrice(req.price)}
                </div>
                <div style={{ fontSize: 11, color: "var(--tg-muted)", lineHeight: 1.5 }}>
                  Telegramdagi chat botga chek (screenshot) rasmini yuboring. Yurist tez orada bog'lanadi.
                </div>
              </div>
            )}

            {req.status === "completed" && (
              <div style={{ background: "rgba(76,175,132,0.08)", border: "1px solid rgba(76,175,132,0.2)", borderRadius: 12, padding: "10px 12px", marginTop: 8 }}>
                <div style={{ fontSize: 11, color: "#4CAF84", lineHeight: 1.5 }}>
                  ✅ Ariza tasdiqlandi. Yurist siz bilan bog'lanadi.
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
