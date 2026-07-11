import { useState, useRef, useEffect } from "react";
import { ChevronLeft, Send, Bot, User, Loader2, CreditCard, AlertCircle } from "lucide-react";
import { tg } from "@/lib/tg";

interface Props {
  onBack: () => void;
  onBuyCredits: () => void;
}

interface Message {
  role: "user" | "ai";
  text: string;
}

function getInitData(): string {
  try { return tg.initData ?? ""; } catch { return ""; }
}

function getApiBase(): string {
  const base = import.meta.env.BASE_URL as string | undefined;
  return (base ?? "").replace(/\/$/, "").replace(/\/mini-app$/, "") + "/api";
}

export function AiChat({ onBack, onBuyCredits }: Props) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ai",
      text: "Salom! Men Qozibuva AI — O'zbekiston qonunchiligi bo'yicha huquqiy maslahatchi. Savolingizni yozing.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [creditsLeft, setCreditsLeft] = useState<number | null>(null);
  const [noCredits, setNoCredits] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage() {
    const q = input.trim();
    if (!q || loading) return;

    setMessages((prev) => [...prev, { role: "user", text: q }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${getApiBase()}/ai/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q, initData: getInitData() }),
      });

      if (res.status === 402) {
        setNoCredits(true);
        setMessages((prev) => [
          ...prev,
          { role: "ai", text: "⚠️ Kreditlaringiz tugadi. Davom etish uchun qo'shimcha kredit sotib oling." },
        ]);
        setCreditsLeft(0);
        return;
      }

      if (!res.ok) {
        const err = await res.json().catch(() => ({})) as { error?: string };
        const msg = err.error === "ai_not_configured"
          ? "AI xizmati hali sozlanmagan. Administrator ANTHROPIC_API_KEY ni qo'shishi kerak."
          : "Xatolik yuz berdi. Qaytadan urinib ko'ring.";
        setMessages((prev) => [...prev, { role: "ai", text: msg }]);
        return;
      }

      const data = await res.json() as { answer: string; creditsLeft: number };
      setCreditsLeft(data.creditsLeft);
      setMessages((prev) => [...prev, { role: "ai", text: data.answer }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "Ulanishda xato. Internet aloqasini tekshiring." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void sendMessage();
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", maxHeight: "100dvh" }}>
      {/* Header */}
      <div style={{ background: "var(--tg-header)", padding: "12px 16px", display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid var(--tg-border)", flexShrink: 0 }}>
        <div onClick={onBack} style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
          <ChevronLeft size={20} strokeWidth={2} />
        </div>
        <div style={{ width: 38, height: 38, borderRadius: 12, background: "rgba(168,85,247,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Bot size={20} color="#A855F7" strokeWidth={1.8} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 700 }}>Qozibuva AI</div>
          <div style={{ fontSize: 11, color: "var(--tg-muted)" }}>Huquqiy maslahatchi</div>
        </div>
        {creditsLeft !== null && (
          <div style={{ background: "rgba(168,85,247,0.15)", border: "1px solid rgba(168,85,247,0.3)", borderRadius: 10, padding: "5px 10px", fontSize: 12, fontWeight: 700, color: "#A855F7", flexShrink: 0 }}>
            {creditsLeft} kredit
          </div>
        )}
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "14px 14px 8px", display: "flex", flexDirection: "column", gap: 12 }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ display: "flex", gap: 10, flexDirection: msg.role === "user" ? "row-reverse" : "row", alignItems: "flex-end" }}>
            {msg.role === "ai" && (
              <div style={{ width: 30, height: 30, borderRadius: 9, background: "rgba(168,85,247,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginBottom: 2 }}>
                <Bot size={15} color="#A855F7" strokeWidth={1.8} />
              </div>
            )}
            {msg.role === "user" && (
              <div style={{ width: 30, height: 30, borderRadius: 9, background: "rgba(42,171,238,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginBottom: 2 }}>
                <User size={15} color="#2AABEE" strokeWidth={1.8} />
              </div>
            )}
            <div style={{
              maxWidth: "78%",
              background: msg.role === "user"
                ? "linear-gradient(135deg,#2AABEE,#1A8FD1)"
                : "var(--tg-card)",
              border: msg.role === "ai" ? "1px solid var(--tg-border)" : "none",
              borderRadius: msg.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
              padding: "10px 14px",
              fontSize: 14,
              lineHeight: 1.6,
              color: msg.role === "user" ? "#fff" : "var(--tg-text)",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}>
              {msg.text}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
            <div style={{ width: 30, height: 30, borderRadius: 9, background: "rgba(168,85,247,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Bot size={15} color="#A855F7" strokeWidth={1.8} />
            </div>
            <div style={{ background: "var(--tg-card)", border: "1px solid var(--tg-border)", borderRadius: "16px 16px 16px 4px", padding: "12px 16px", display: "flex", alignItems: "center", gap: 8 }}>
              <Loader2 size={16} color="#A855F7" className="spin" style={{ animation: "spin 1s linear infinite" }} />
              <span style={{ fontSize: 13, color: "var(--tg-muted)" }}>Tahlil qilinmoqda...</span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* No credits banner */}
      {noCredits && (
        <div style={{ margin: "0 14px 8px", background: "rgba(251,146,60,0.1)", border: "1px solid rgba(251,146,60,0.3)", borderRadius: 12, padding: "12px 14px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <AlertCircle size={16} color="#FB923C" />
            <span style={{ fontSize: 13, fontWeight: 600, color: "#FB923C" }}>Kreditlar tugadi</span>
          </div>
          <button onClick={onBuyCredits}
            style={{ width: "100%", background: "linear-gradient(135deg,#FB923C,#C2410C)", color: "#fff", border: "none", borderRadius: 10, padding: "10px 0", fontSize: 14, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <CreditCard size={15} /> 5 kredit — 50 000 so'm
          </button>
        </div>
      )}

      {/* Input */}
      {!noCredits && (
        <div style={{ padding: "8px 14px 20px", borderTop: "1px solid var(--tg-border)", flexShrink: 0, display: "flex", gap: 10, alignItems: "flex-end" }}>
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Huquqiy savolingizni yozing..."
            rows={1}
            style={{
              flex: 1,
              background: "var(--tg-card)",
              border: "1px solid var(--tg-border)",
              borderRadius: 14,
              padding: "11px 14px",
              fontSize: 14,
              color: "var(--tg-text)",
              resize: "none",
              outline: "none",
              fontFamily: "inherit",
              lineHeight: 1.5,
              maxHeight: 120,
              overflowY: "auto",
            }}
            onInput={(e) => {
              const t = e.currentTarget;
              t.style.height = "auto";
              t.style.height = Math.min(t.scrollHeight, 120) + "px";
            }}
          />
          <button
            onClick={() => void sendMessage()}
            disabled={!input.trim() || loading}
            style={{
              width: 44, height: 44, borderRadius: 13, flexShrink: 0,
              background: input.trim() && !loading
                ? "linear-gradient(135deg,#7C3AED,#A855F7)"
                : "var(--tg-card)",
              border: "1px solid var(--tg-border)",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: input.trim() && !loading ? "pointer" : "default",
              transition: "all 0.15s",
            }}>
            <Send size={18} color={input.trim() && !loading ? "#fff" : "var(--tg-muted)"} strokeWidth={2} />
          </button>
        </div>
      )}
    </div>
  );
}
