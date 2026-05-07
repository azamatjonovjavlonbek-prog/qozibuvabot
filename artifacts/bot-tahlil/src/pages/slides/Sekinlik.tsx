export default function Sekinlik() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "#0f1117" }}>
      <div className="absolute inset-0" style={{
        backgroundImage: "linear-gradient(rgba(69,123,157,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(69,123,157,0.05) 1px, transparent 1px)",
        backgroundSize: "6vw 6vw"
      }} />
      <div className="absolute top-0 left-0 right-0" style={{ height: "0.4vh", background: "#e63946" }} />

      {/* Slide number */}
      <div className="absolute top-0 right-0" style={{
        padding: "2.5vh 3vw",
        fontFamily: "IBM Plex Mono, monospace",
        fontSize: "1.5vw",
        color: "rgba(141,157,182,0.5)"
      }}>
        01
      </div>

      <div className="absolute inset-0 flex" style={{ paddingLeft: "7vw", paddingRight: "7vw", paddingTop: "7vh", paddingBottom: "7vh" }}>
        {/* Left column */}
        <div className="flex flex-col justify-center" style={{ width: "45%", paddingRight: "4vw" }}>
          <div style={{
            fontFamily: "IBM Plex Mono, monospace",
            fontSize: "1.5vw",
            color: "#e63946",
            letterSpacing: "0.1em",
            marginBottom: "2vh"
          }}>
            MUAMMO #1
          </div>
          <h2 style={{
            fontFamily: "Space Grotesk, sans-serif",
            fontWeight: 800,
            fontSize: "4.5vw",
            lineHeight: 1.05,
            color: "#f1faee",
            letterSpacing: "-0.02em",
            textWrap: "balance",
            marginBottom: "3vh"
          }}>
            Bot
            <br />
            <span style={{ color: "#e63946" }}>Sekin</span>
            <br />
            Ishlayapti
          </h2>
          <p style={{
            fontFamily: "IBM Plex Mono, monospace",
            fontSize: "1.8vw",
            color: "#8d9db6",
            lineHeight: 1.6
          }}>
            Foydalanuvchi tugmani bosganidan javob kelguncha sezilarli kechikish kuzatilmoqda.
          </p>
        </div>

        {/* Divider */}
        <div style={{ width: "1px", background: "linear-gradient(180deg, transparent, rgba(69,123,157,0.4), transparent)", margin: "0 2vw" }} />

        {/* Right column — causes */}
        <div className="flex flex-col justify-center" style={{ width: "55%", paddingLeft: "2vw" }}>
          <div style={{ marginBottom: "2vh", fontFamily: "IBM Plex Mono, monospace", fontSize: "1.5vw", color: "#8d9db6", letterSpacing: "0.08em" }}>
            ASOSIY SABABLAR
          </div>

          {/* Cause 1 */}
          <div style={{ marginBottom: "2.5vh", padding: "2vh 2vw", background: "rgba(230,57,70,0.06)", border: "1px solid rgba(230,57,70,0.2)", borderRadius: "0.4vw" }}>
            <div style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: "2vw", color: "#f1faee", marginBottom: "0.8vh" }}>
              Polling rejimi
            </div>
            <div style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: "1.6vw", color: "#8d9db6", lineHeight: 1.5 }}>
              Bot Telegram serverini 1-3 soniyada bir so'raydi. Webhook o'rniga polling ishlatilmoqda.
            </div>
          </div>

          {/* Cause 2 */}
          <div style={{ marginBottom: "2.5vh", padding: "2vh 2vw", background: "rgba(230,57,70,0.06)", border: "1px solid rgba(230,57,70,0.2)", borderRadius: "0.4vw" }}>
            <div style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: "2vw", color: "#f1faee", marginBottom: "0.8vh" }}>
              PDF generatsiya
            </div>
            <div style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: "1.6vw", color: "#8d9db6", lineHeight: 1.5 }}>
              Har so'rovda shrift faylini diskdan qayta o'qiydi. CPU og'ir operatsiya.
            </div>
          </div>

          {/* Cause 3 */}
          <div style={{ padding: "2vh 2vw", background: "rgba(230,57,70,0.06)", border: "1px solid rgba(230,57,70,0.2)", borderRadius: "0.4vw" }}>
            <div style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: "2vw", color: "#f1faee", marginBottom: "0.8vh" }}>
              Sinxron fayl operatsiyalar
            </div>
            <div style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: "1.6vw", color: "#8d9db6", lineHeight: 1.5 }}>
              templateStore.ts da fs.readFileSync ishlatilmoqda — event loop bloklanadi.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
