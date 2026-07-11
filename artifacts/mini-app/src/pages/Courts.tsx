import { useState } from "react";
import { ChevronLeft, ChevronRight, Landmark, Phone, Mail, MapPin, Copy, CheckCircle } from "lucide-react";
import { COURT_TYPES, REGIONS, OLIY_SUD, getCourts, type CourtType, type CourtEntry } from "@/lib/courtsData";

interface Props { onBack: () => void; }

type Step = "type" | "region" | "list" | "detail";

export function Courts({ onBack }: Props) {
  const [step, setStep] = useState<Step>("type");
  const [selectedType, setSelectedType] = useState<CourtType | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [selectedCourt, setSelectedCourt] = useState<CourtEntry | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  function selectType(type: CourtType) {
    setSelectedType(type);
    if (type === "oliy") {
      setSelectedCourt(OLIY_SUD);
      setStep("detail");
    } else {
      setStep("region");
    }
  }

  function selectRegion(regionId: string) {
    setSelectedRegion(regionId);
    setStep("list");
  }

  function goBack() {
    if (step === "detail" && selectedType !== "oliy") { setStep("list"); return; }
    if (step === "detail") { setStep("type"); return; }
    if (step === "list") { setStep("region"); return; }
    if (step === "region") { setStep("type"); return; }
    onBack();
  }

  function copyText(text: string, key: string) {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  }

  const courts = selectedType && selectedRegion ? getCourts(selectedType, selectedRegion) : [];
  const regionName = REGIONS.find(r => r.id === selectedRegion)?.name ?? "";
  const typeName = COURT_TYPES.find(t => t.id === selectedType)?.name ?? "";

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ background: "var(--tg-header)", padding: "16px", display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid var(--tg-border)", position: "sticky", top: 0, zIndex: 10 }}>
        <div onClick={step === "type" ? onBack : goBack} style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
          <ChevronLeft size={20} strokeWidth={2} />
        </div>
        <div style={{ flex: 1, overflow: "hidden" }}>
          <div style={{ fontSize: 17, fontWeight: 700 }}>Sud manzillari</div>
          {step !== "type" && <div style={{ fontSize: 11, color: "var(--tg-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {typeName}{regionName ? ` • ${regionName}` : ""}
          </div>}
        </div>
      </div>

      <div style={{ padding: "14px 16px 24px", flex: 1 }}>

        {/* Step 1: Select court type */}
        {step === "type" && (
          <>
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--tg-muted)", marginBottom: 12, textTransform: "uppercase", letterSpacing: 0.8 }}>Sud turini tanlang</div>
            {COURT_TYPES.map(({ id, name, emoji }) => (
              <div key={id} onClick={() => selectType(id)}
                style={{ background: "var(--tg-card)", borderRadius: 14, padding: "14px 16px", marginBottom: 8, display: "flex", alignItems: "center", gap: 14, cursor: "pointer", border: "1px solid var(--tg-border)" }}>
                <div style={{ fontSize: 22, width: 44, height: 44, borderRadius: 12, background: "rgba(42,171,238,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {emoji}
                </div>
                <div style={{ flex: 1, fontSize: 14, fontWeight: 500, lineHeight: 1.35 }}>{name}</div>
                <ChevronRight size={18} color="var(--tg-muted)" />
              </div>
            ))}
          </>
        )}

        {/* Step 2: Select region */}
        {step === "region" && (
          <>
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--tg-muted)", marginBottom: 12, textTransform: "uppercase", letterSpacing: 0.8 }}>Viloyatni tanlang</div>
            {REGIONS.map(({ id, name }) => (
              <div key={id} onClick={() => selectRegion(id)}
                style={{ background: "var(--tg-card)", borderRadius: 12, padding: "13px 15px", marginBottom: 6, display: "flex", alignItems: "center", gap: 12, cursor: "pointer", border: "1px solid var(--tg-border)" }}>
                <Landmark size={16} color="var(--tg-muted)" strokeWidth={1.6} style={{ flexShrink: 0 }} />
                <div style={{ flex: 1, fontSize: 14, fontWeight: 500 }}>{name}</div>
                <ChevronRight size={16} color="var(--tg-muted)" />
              </div>
            ))}
          </>
        )}

        {/* Step 3: Courts list */}
        {step === "list" && (
          <>
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--tg-muted)", marginBottom: 12, textTransform: "uppercase", letterSpacing: 0.8 }}>
              {courts.length} ta sud topildi
            </div>
            {courts.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 20px", color: "var(--tg-muted)" }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>🏛</div>
                <div style={{ fontSize: 14 }}>Ushbu bo'yicha ma'lumot mavjud emas</div>
              </div>
            ) : courts.map((court, i) => (
              <div key={i} onClick={() => { setSelectedCourt(court); setStep("detail"); }}
                style={{ background: "var(--tg-card)", borderRadius: 14, padding: "14px 15px", marginBottom: 8, cursor: "pointer", border: "1px solid var(--tg-border)" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                  <div style={{ width: 38, height: 38, borderRadius: 10, background: "rgba(42,171,238,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Landmark size={16} color="#2AABEE" strokeWidth={1.8} />
                  </div>
                  <div style={{ flex: 1, overflow: "hidden" }}>
                    <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4, lineHeight: 1.3 }}>{court.name}</div>
                    <div style={{ fontSize: 12, color: "var(--tg-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{court.address}</div>
                  </div>
                  <ChevronRight size={16} color="var(--tg-muted)" style={{ flexShrink: 0 }} />
                </div>
              </div>
            ))}
          </>
        )}

        {/* Step 4: Court detail */}
        {step === "detail" && selectedCourt && (
          <div>
            <div style={{ background: "var(--tg-card)", borderRadius: 18, padding: 20, marginBottom: 12 }}>
              <div style={{ width: 64, height: 64, borderRadius: 18, background: "rgba(42,171,238,0.15)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                <Landmark size={28} color="#2AABEE" strokeWidth={1.6} />
              </div>
              <div style={{ fontSize: 16, fontWeight: 700, textAlign: "center", marginBottom: 18, lineHeight: 1.4 }}>{selectedCourt.name}</div>

              {/* Address */}
              <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 12, padding: "12px 14px", marginBottom: 8, display: "flex", gap: 10, alignItems: "flex-start" }}
                onClick={() => copyText(selectedCourt.address, "addr")}>
                <MapPin size={16} color="#2AABEE" style={{ flexShrink: 0, marginTop: 2 }} strokeWidth={1.8} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, color: "var(--tg-muted)", marginBottom: 3 }}>Manzil</div>
                  <div style={{ fontSize: 13, lineHeight: 1.5 }}>{selectedCourt.address}</div>
                </div>
                {copied === "addr" ? <CheckCircle size={15} color="#4CAF84" /> : <Copy size={15} color="var(--tg-muted)" />}
              </div>

              {/* Phone */}
              <a href={`tel:${selectedCourt.phone.replace(/\s/g, "")}`} style={{ textDecoration: "none", color: "inherit", display: "block" }}>
                <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 12, padding: "12px 14px", marginBottom: 8, display: "flex", gap: 10, alignItems: "center" }}>
                  <Phone size={16} color="#4CAF84" strokeWidth={1.8} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11, color: "var(--tg-muted)", marginBottom: 3 }}>Telefon</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#4CAF84" }}>{selectedCourt.phone}</div>
                  </div>
                </div>
              </a>

              {/* Email */}
              {selectedCourt.email && (
                <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 12, padding: "12px 14px", display: "flex", gap: 10, alignItems: "center" }}
                  onClick={() => copyText(selectedCourt.email!, "email")}>
                  <Mail size={16} color="#A855F7" strokeWidth={1.8} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11, color: "var(--tg-muted)", marginBottom: 3 }}>Email</div>
                    <div style={{ fontSize: 13, color: "#A855F7" }}>{selectedCourt.email}</div>
                  </div>
                  {copied === "email" ? <CheckCircle size={15} color="#4CAF84" /> : <Copy size={15} color="var(--tg-muted)" />}
                </div>
              )}
            </div>

            <button onClick={() => { const tel = selectedCourt.phone.replace(/\s/g, ""); window.open(`tel:${tel}`); }}
              style={{ width: "100%", background: "linear-gradient(135deg,#4CAF84,#2E7D52)", color: "#fff", border: "none", borderRadius: 14, padding: "14px 0", fontSize: 15, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <Phone size={17} strokeWidth={2} /> Qo'ng'iroq qilish
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
