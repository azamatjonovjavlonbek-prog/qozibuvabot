export default function EchimSekinlik() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "#0f1117" }}>
      <div className="absolute inset-0" style={{
        backgroundImage: "linear-gradient(rgba(69,123,157,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(69,123,157,0.05) 1px, transparent 1px)",
        backgroundSize: "6vw 6vw"
      }} />

      {/* Top bar — green accent for solutions */}
      <div className="absolute top-0 left-0 right-0" style={{ height: "0.4vh", background: "#2a9d8f" }} />

      <div className="absolute top-0 right-0" style={{
        padding: "2.5vh 3vw",
        fontFamily: "IBM Plex Mono, monospace",
        fontSize: "1.5vw",
        color: "rgba(141,157,182,0.5)"
      }}>
        03
      </div>

      <div className="absolute inset-0 flex" style={{ paddingLeft: "7vw", paddingRight: "7vw", paddingTop: "7vh", paddingBottom: "7vh" }}>

        {/* Left */}
        <div className="flex flex-col justify-center" style={{ width: "38%", paddingRight: "4vw" }}>
          <div style={{
            fontFamily: "IBM Plex Mono, monospace",
            fontSize: "1.5vw",
            color: "#2a9d8f",
            letterSpacing: "0.1em",
            marginBottom: "1.5vh"
          }}>
            ECHIM #1
          </div>
          <h2 style={{
            fontFamily: "Space Grotesk, sans-serif",
            fontWeight: 800,
            fontSize: "4.2vw",
            lineHeight: 1.05,
            color: "#f1faee",
            letterSpacing: "-0.02em",
            textWrap: "balance",
            marginBottom: "2.5vh"
          }}>
            Bot
            <br />
            Tezligi
            <br />
            <span style={{ color: "#2a9d8f" }}>Yaxshilash</span>
          </h2>
          <div style={{
            padding: "1.5vh 1.5vw",
            background: "rgba(42,157,143,0.1)",
            border: "1px solid rgba(42,157,143,0.3)",
            borderRadius: "0.4vw",
            fontFamily: "IBM Plex Mono, monospace",
            fontSize: "1.6vw",
            color: "#8d9db6",
            lineHeight: 1.5
          }}>
            Quyidagi 3 ta o'zgarish bilan bot tezligi sezilarli oshadi.
          </div>
        </div>

        {/* Divider */}
        <div style={{ width: "1px", background: "linear-gradient(180deg, transparent, rgba(42,157,143,0.4), transparent)", margin: "0 2vw" }} />

        {/* Right — solutions */}
        <div className="flex flex-col justify-center" style={{ width: "62%", paddingLeft: "2vw", gap: "2vh" }}>

          {/* Solution 1 */}
          <div style={{ display: "flex", alignItems: "flex-start", gap: "1.5vw" }}>
            <div style={{
              minWidth: "3.5vw",
              height: "3.5vw",
              background: "rgba(42,157,143,0.15)",
              border: "1px solid rgba(42,157,143,0.4)",
              borderRadius: "0.4vw",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "Space Grotesk, sans-serif",
              fontWeight: 800,
              fontSize: "2vw",
              color: "#2a9d8f"
            }}>
              1
            </div>
            <div>
              <div style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: "2.2vw", color: "#f1faee", marginBottom: "0.5vh" }}>
                Webhook rejimiga o'tish
              </div>
              <div style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: "1.7vw", color: "#8d9db6", lineHeight: 1.5 }}>
                Polling o'rniga Webhook ulash — javob vaqti 1-3 soniyadan 100ms ga tushadi.
              </div>
            </div>
          </div>

          {/* Solution 2 */}
          <div style={{ display: "flex", alignItems: "flex-start", gap: "1.5vw" }}>
            <div style={{
              minWidth: "3.5vw",
              height: "3.5vw",
              background: "rgba(42,157,143,0.15)",
              border: "1px solid rgba(42,157,143,0.4)",
              borderRadius: "0.4vw",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "Space Grotesk, sans-serif",
              fontWeight: 800,
              fontSize: "2vw",
              color: "#2a9d8f"
            }}>
              2
            </div>
            <div>
              <div style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: "2.2vw", color: "#f1faee", marginBottom: "0.5vh" }}>
                Shriftni bir marta yuklash
              </div>
              <div style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: "1.7vw", color: "#8d9db6", lineHeight: 1.5 }}>
                NotoSans fontini startup da Buffer sifatida xotiraga yuklash. Har so'rovda disk o'qilmaydi.
              </div>
            </div>
          </div>

          {/* Solution 3 */}
          <div style={{ display: "flex", alignItems: "flex-start", gap: "1.5vw" }}>
            <div style={{
              minWidth: "3.5vw",
              height: "3.5vw",
              background: "rgba(42,157,143,0.15)",
              border: "1px solid rgba(42,157,143,0.4)",
              borderRadius: "0.4vw",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "Space Grotesk, sans-serif",
              fontWeight: 800,
              fontSize: "2vw",
              color: "#2a9d8f"
            }}>
              3
            </div>
            <div>
              <div style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: "2.2vw", color: "#f1faee", marginBottom: "0.5vh" }}>
                Asinxron fayl operatsiyalar
              </div>
              <div style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: "1.7vw", color: "#8d9db6", lineHeight: 1.5 }}>
                fs.readFileSync ni fs.promises.readFile ga almashtirish. Event loop bloklanmaydi.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
