export default function Yakun() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "#0f1117" }}>
      <div className="absolute inset-0" style={{
        backgroundImage: "linear-gradient(rgba(69,123,157,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(69,123,157,0.05) 1px, transparent 1px)",
        backgroundSize: "6vw 6vw"
      }} />

      {/* Gradient glow bottom */}
      <div className="absolute bottom-0 left-0 right-0" style={{
        height: "40vh",
        background: "radial-gradient(ellipse 80% 100% at 50% 120%, rgba(42,157,143,0.12) 0%, transparent 70%)"
      }} />

      <div className="absolute top-0 left-0 right-0" style={{ height: "0.4vh", background: "linear-gradient(90deg, #e63946, #2a9d8f)" }} />
      <div className="absolute top-0 right-0" style={{
        padding: "2.5vh 3vw",
        fontFamily: "IBM Plex Mono, monospace",
        fontSize: "1.5vw",
        color: "rgba(141,157,182,0.5)"
      }}>
        05
      </div>

      <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ paddingLeft: "8vw", paddingRight: "8vw" }}>

        {/* Label */}
        <div style={{
          fontFamily: "IBM Plex Mono, monospace",
          fontSize: "1.5vw",
          color: "#2a9d8f",
          letterSpacing: "0.1em",
          marginBottom: "2.5vh"
        }}>
          XULOSA VA KEYINGI QADAMLAR
        </div>

        {/* Main headline */}
        <h2 style={{
          fontFamily: "Space Grotesk, sans-serif",
          fontWeight: 800,
          fontSize: "5vw",
          lineHeight: 1.0,
          color: "#f1faee",
          letterSpacing: "-0.03em",
          textWrap: "balance",
          textAlign: "center",
          marginBottom: "5vh"
        }}>
          5 Ta O'zgarish — Sezilarli Farq
        </h2>

        {/* Summary table */}
        <div style={{ width: "100%", maxWidth: "80vw" }}>

          {/* Row header */}
          <div className="flex" style={{ marginBottom: "1.5vh", paddingLeft: "1vw", paddingRight: "1vw" }}>
            <div style={{ flex: 3, fontFamily: "IBM Plex Mono, monospace", fontSize: "1.5vw", color: "#8d9db6", letterSpacing: "0.08em" }}>TADBIR</div>
            <div style={{ flex: 2, fontFamily: "IBM Plex Mono, monospace", fontSize: "1.5vw", color: "#8d9db6", letterSpacing: "0.08em" }}>NATIJA</div>
            <div style={{ flex: 1, fontFamily: "IBM Plex Mono, monospace", fontSize: "1.5vw", color: "#8d9db6", letterSpacing: "0.08em", textAlign: "right" }}>MUHIMLIK</div>
          </div>

          {/* Row 1 */}
          <div className="flex" style={{ padding: "1.6vh 1vw", background: "rgba(42,157,143,0.07)", borderRadius: "0.4vw", marginBottom: "0.8vh", border: "1px solid rgba(42,157,143,0.15)", alignItems: "center" }}>
            <div style={{ flex: 3, fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: "2vw", color: "#f1faee" }}>Webhook rejimi</div>
            <div style={{ flex: 2, fontFamily: "IBM Plex Mono, monospace", fontSize: "1.7vw", color: "#8d9db6" }}>100ms tezlik</div>
            <div style={{ flex: 1, textAlign: "right" }}>
              <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: "1.7vw", color: "#e63946", fontWeight: 600 }}>Yuqori</span>
            </div>
          </div>

          {/* Row 2 */}
          <div className="flex" style={{ padding: "1.6vh 1vw", background: "rgba(42,157,143,0.07)", borderRadius: "0.4vw", marginBottom: "0.8vh", border: "1px solid rgba(42,157,143,0.15)", alignItems: "center" }}>
            <div style={{ flex: 3, fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: "2vw", color: "#f1faee" }}>Shrift keshi</div>
            <div style={{ flex: 2, fontFamily: "IBM Plex Mono, monospace", fontSize: "1.7vw", color: "#8d9db6" }}>PDF tezroq</div>
            <div style={{ flex: 1, textAlign: "right" }}>
              <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: "1.7vw", color: "#e63946", fontWeight: 600 }}>Yuqori</span>
            </div>
          </div>

          {/* Row 3 */}
          <div className="flex" style={{ padding: "1.6vh 1vw", background: "rgba(42,157,143,0.07)", borderRadius: "0.4vw", marginBottom: "0.8vh", border: "1px solid rgba(42,157,143,0.15)", alignItems: "center" }}>
            <div style={{ flex: 3, fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: "2vw", color: "#f1faee" }}>Asinxron I/O</div>
            <div style={{ flex: 2, fontFamily: "IBM Plex Mono, monospace", fontSize: "1.7vw", color: "#8d9db6" }}>Event loop erkin</div>
            <div style={{ flex: 1, textAlign: "right" }}>
              <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: "1.7vw", color: "#457b9d", fontWeight: 600 }}>O'rta</span>
            </div>
          </div>

          {/* Row 4 */}
          <div className="flex" style={{ padding: "1.6vh 1vw", background: "rgba(42,157,143,0.07)", borderRadius: "0.4vw", marginBottom: "0.8vh", border: "1px solid rgba(42,157,143,0.15)", alignItems: "center" }}>
            <div style={{ flex: 3, fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: "2vw", color: "#f1faee" }}>Koordinatalar to'g'rilash</div>
            <div style={{ flex: 2, fontFamily: "IBM Plex Mono, monospace", fontSize: "1.7vw", color: "#8d9db6" }}>Aniq lokatsiya</div>
            <div style={{ flex: 1, textAlign: "right" }}>
              <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: "1.7vw", color: "#e63946", fontWeight: 600 }}>Yuqori</span>
            </div>
          </div>

          {/* Row 5 */}
          <div className="flex" style={{ padding: "1.6vh 1vw", background: "rgba(42,157,143,0.07)", borderRadius: "0.4vw", border: "1px solid rgba(42,157,143,0.15)", alignItems: "center" }}>
            <div style={{ flex: 3, fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: "2vw", color: "#f1faee" }}>Lokatsiya tugmasi</div>
            <div style={{ flex: 2, fontFamily: "IBM Plex Mono, monospace", fontSize: "1.7vw", color: "#8d9db6" }}>API chaqiruv kamroq</div>
            <div style={{ flex: 1, textAlign: "right" }}>
              <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: "1.7vw", color: "#457b9d", fontWeight: 600 }}>O'rta</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
