import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, FileText, Clock, CheckCircle2, XCircle, CreditCard, RefreshCw, Inbox, Scale, Users, Car } from "lucide-react";
import { tg } from "@/lib/tg";

interface Props { onBack: () => void; }

interface ProfRequest {
  id: number;
  description: string;
  status: "pending" | "priced" | "completed" | "rejected";
  price: number | null;
  createdAt: string;
}

interface ShablonOrder {
  id: number;
  catId: string;
  catLabel: string;
  status: "pending" | "completed" | "rejected";
  createdAt: string;
}

function getInitData(): string { try { return tg.initData ?? ""; } catch { return ""; } }
function getApiBase(): string {
  const base = import.meta.env.BASE_URL as string | undefined;
  return (base ?? "").replace(/\/$/, "").replace(/\/mini-app$/, "") + "/api";
}
function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("uz-Latn-UZ", { day: "2-digit", month: "2-digit", year: "numeric" });
}
function formatPrice(p: number): string { return p.toLocaleString("uz-UZ") + " so'm"; }

const CAT_ICON: Record<string, typeof Scale> = { divorce: Scale, aliment: Users, radar: Car };
const CAT_COLOR: Record<string, string> = { divorce: "#F87171", aliment: "#2AABEE", radar: "#4CAF84" };
const CAT_BG: Record<string, string> = { divorce: "rgba(248,113,113,0.12)", aliment: "rgba(42,171,238,0.12)", radar: "rgba(76,175,132,0.12)" };

function ProfStatusBadge({ status, price }: { status: ProfRequest["status"]; price: number | null }) {
  const map = {
    pending:   { label: "Ko'rib chiqilmoqda", color: "#FBB924", bg: "rgba(251,185,36,0.12)", icon: Clock },
    priced:    { label: "To'lov kutilmoqda",   color: "#2AABEE", bg: "rgba(42,171,238,0.12)", icon: CreditCard },
    completed: { label: "Bajarildi",            color: "#4CAF84", bg: "rgba(76,175,132,0.12)", icon: CheckCircle2 },
    rejected:  { label: "Rad etildi",           color: "#EF4444", bg: "rgba(239,68,68,0.12)",  icon: XCircle },
  };
  const { label, color, bg, icon: Icon } = map[status] ?? map.pending;
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 5, background: bg, borderRadius: 8, padding: "4px 10px" }}>
      <Icon size={11} color={color} strokeWidth={2.2} />
      <span style={{ fontSize: 11, fontWeight: 700, color }}>
        {label}{status === "priced" && price ? ` — ${formatPrice(price)}` : ""}
      </span>
    </div>
  );
}

function ShablonStatusBadge({ status }: { status: ShablonOrder["status"] }) {
  const map = {
    pending:   { label: "Tekshirilmoqda", color: "#FBB924", bg: "rgba(251,185,36,0.12)", icon: Clock },
    completed: { label: "Yuborildi ✓",    color: "#4CAF84", bg: "rgba(76,175,132,0.12)", icon: CheckCircle2 },
    rejected:  { label: "Rad etildi",     color: "#EF4444", bg: "rgba(239,68,68,0.12)",  icon: XCircle },
  };
  const { label, color, bg, icon: Icon } = map[status] ?? map.pending;
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 5, background: bg, borderRadius: 8, padding: "4px 10px" }}>
      <Icon size={11} color={color} strokeWidth={2.2} />
      <span style={{ fontSize: 11, fontWeight: 700, color }}>{label}</span>
    </div>
  );
}

export function MyRequestsPage({ onBack }: Props) {
  const [tab, setTab]                 = useState<"shablon" | "professional">("shablon");
  const [shablonOrders, setShablonOrders] = useState<ShablonOrder[]>([]);
  const [profRequests, setProfRequests]   = useState<ProfRequest[]>([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const initData = getInitData();
      const base = getApiBase();
      const headers = { "x-init-data": initData };
      const [s, p] = await Promise.all([
        fetch(`${base}/shablon/my-orders`, { headers }).then(r => r.json() as Promise<{ orders: ShablonOrder[] }>),
        fetch(`${base}/professional/my-requests`, { headers }).then(r => r.json() as Promise<{ requests: ProfRequest[] }>),
      ]);
      setShablonOrders(s.orders ?? []);
      setProfRequests(p.requests ?? []);
    } catch {
      setError("Ma'lumotlarni yuklab bo'lmadi.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  const totalCount = shablonOrders.length + profRequests.length;

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ background: "var(--tg-header)", padding: "16px", display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid var(--tg-border)" }}>
        <div onClick={onBack} style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <ChevronLeft size={20} strokeWidth={2} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 17, fontWeight: 700 }}>Mening arizalarim</div>
          <div style={{ fontSize: 12, color: "var(--tg-muted)" }}>{totalCount} ta buyurtma</div>
        </div>
        <div onClick={() => void load()} style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <RefreshCw size={16} strokeWidth={2} style={loading ? { animation: "spin 1s linear infinite" } : {}} />
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", padding: "12px 16px 0", gap: 8 }}>
        {([
          { key: "shablon",      label: "Shablon arizalar",   count: shablonOrders.length },
          { key: "professional", label: "Professional arizalar", count: profRequests.length },
        ] as const).map(({ key, label, count }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            style={{ flex: 1, background: tab === key ? "rgba(42,171,238,0.15)" : "var(--tg-card)", border: tab === key ? "1.5px solid rgba(42,171,238,0.4)" : "1px solid var(--tg-border)", borderRadius: 12, padding: "9px 0", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}
          >
            <span style={{ fontSize: 12, fontWeight: 700, color: tab === key ? "#2AABEE" : "var(--tg-text)" }}>{label}</span>
            <span style={{ fontSize: 11, color: "var(--tg-muted)" }}>{count} ta</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ padding: "12px 16px 24px", flex: 1 }}>
        {loading && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 200 }}>
            <RefreshCw size={28} color="#2AABEE" style={{ animation: "spin 1s linear infinite" }} />
          </div>
        )}

        {!loading && error && (
          <div style={{ textAlign: "center", padding: 32 }}>
            <div style={{ fontSize: 14, color: "#EF4444", marginBottom: 12 }}>{error}</div>
            <button onClick={() => void load()} style={{ background: "var(--tg-card)", border: "1px solid var(--tg-border)", borderRadius: 10, padding: "8px 20px", color: "var(--tg-text)", cursor: "pointer", fontSize: 13 }}>Qayta urinish</button>
          </div>
        )}

        {/* SHABLON TAB */}
        {!loading && !error && tab === "shablon" && (
          shablonOrders.length === 0 ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 250, gap: 10 }}>
              <div style={{ width: 64, height: 64, borderRadius: 18, background: "rgba(42,171,238,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Inbox size={28} color="#2AABEE" strokeWidth={1.4} />
              </div>
              <div style={{ fontSize: 15, fontWeight: 700 }}>Shablon ariza yo'q</div>
              <div style={{ fontSize: 12, color: "var(--tg-muted)", textAlign: "center", maxWidth: 220, lineHeight: 1.6 }}>Hali ariza shablon buyurtma bermagansiz.</div>
            </div>
          ) : (
            shablonOrders.map((order) => {
              const Icon = CAT_ICON[order.catId] ?? FileText;
              const color = CAT_COLOR[order.catId] ?? "#2AABEE";
              const bg = CAT_BG[order.catId] ?? "rgba(42,171,238,0.12)";
              return (
                <div key={order.id} style={{ background: "var(--tg-card)", borderRadius: 16, padding: 16, marginBottom: 10, border: "1px solid var(--tg-border)" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 40, height: 40, borderRadius: 12, background: bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <Icon size={18} color={color} strokeWidth={1.8} />
                      </div>
                      <div>
                        <div style={{ fontSize: 11, color: "var(--tg-muted)" }}>#{order.id} · {formatDate(order.createdAt)}</div>
                        <div style={{ fontSize: 13, fontWeight: 700, marginTop: 1 }}>{order.catLabel}</div>
                      </div>
                    </div>
                    <ShablonStatusBadge status={order.status} />
                  </div>
                  {order.status === "pending" && (
                    <div style={{ background: "rgba(251,185,36,0.08)", border: "1px solid rgba(251,185,36,0.2)", borderRadius: 10, padding: "8px 12px" }}>
                      <div style={{ fontSize: 11, color: "var(--tg-muted)" }}>⏳ Administrator to'lovingizni tekshirmoqda. Tasdiqlangach ariza bot orqali avtomatik yuboriladi.</div>
                    </div>
                  )}
                  {order.status === "completed" && (
                    <div style={{ background: "rgba(76,175,132,0.08)", border: "1px solid rgba(76,175,132,0.2)", borderRadius: 10, padding: "8px 12px" }}>
                      <div style={{ fontSize: 11, color: "#4CAF84" }}>✅ Ariza Word formatida Telegram botga yuborildi.</div>
                    </div>
                  )}
                  {order.status === "rejected" && (
                    <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 10, padding: "8px 12px" }}>
                      <div style={{ fontSize: 11, color: "#EF4444" }}>❌ To'lov tasdiqlanmadi. Botga murojaat qiling.</div>
                    </div>
                  )}
                </div>
              );
            })
          )
        )}

        {/* PROFESSIONAL TAB */}
        {!loading && !error && tab === "professional" && (
          profRequests.length === 0 ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 250, gap: 10 }}>
              <div style={{ width: 64, height: 64, borderRadius: 18, background: "rgba(251,146,60,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Inbox size={28} color="#FB923C" strokeWidth={1.4} />
              </div>
              <div style={{ fontSize: 15, fontWeight: 700 }}>Professional ariza yo'q</div>
              <div style={{ fontSize: 12, color: "var(--tg-muted)", textAlign: "center", maxWidth: 220, lineHeight: 1.6 }}>Hali professional ariza yubormagansiz.</div>
            </div>
          ) : (
            profRequests.map((req) => (
              <div key={req.id} style={{ background: "var(--tg-card)", borderRadius: 16, padding: 16, marginBottom: 10, border: "1px solid var(--tg-border)" }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(251,146,60,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <FileText size={18} color="#FB923C" strokeWidth={1.8} />
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: "var(--tg-muted)" }}>#{req.id} · {formatDate(req.createdAt)}</div>
                      <div style={{ fontSize: 13, fontWeight: 700, marginTop: 1, color: "#FB923C" }}>Professional ariza</div>
                    </div>
                  </div>
                  <ProfStatusBadge status={req.status} price={req.price} />
                </div>
                <div style={{ fontSize: 12, color: "var(--tg-muted)", lineHeight: 1.55, marginBottom: req.status === "priced" ? 10 : 0 }}>
                  {req.description.length > 100 ? req.description.slice(0, 100) + "…" : req.description}
                </div>
                {req.status === "priced" && req.price && (
                  <div style={{ background: "rgba(42,171,238,0.08)", border: "1px solid rgba(42,171,238,0.2)", borderRadius: 10, padding: "10px 12px" }}>
                    <div style={{ fontSize: 12, color: "#2AABEE", fontWeight: 700, marginBottom: 3 }}>💳 To'lov: {formatPrice(req.price)}</div>
                    <div style={{ fontSize: 11, color: "var(--tg-muted)" }}>Telegram botga chek (screenshot) rasmini yuboring.</div>
                  </div>
                )}
                {req.status === "completed" && (
                  <div style={{ background: "rgba(76,175,132,0.08)", border: "1px solid rgba(76,175,132,0.2)", borderRadius: 10, padding: "8px 12px" }}>
                    <div style={{ fontSize: 11, color: "#4CAF84" }}>✅ Tasdiqlandi. Yurist siz bilan bog'lanadi.</div>
                  </div>
                )}
                {req.status === "rejected" && (
                  <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 10, padding: "8px 12px" }}>
                    <div style={{ fontSize: 11, color: "#EF4444" }}>❌ Rad etildi. Botga murojaat qiling.</div>
                  </div>
                )}
              </div>
            ))
          )
        )}
      </div>
    </div>
  );
}
