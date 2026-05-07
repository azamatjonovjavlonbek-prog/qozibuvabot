export default function EchimLokatsiya() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "#0f1117" }}>
      <div className="absolute inset-0" style={{
        backgroundImage: "linear-gradient(rgba(69,123,157,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(69,123,157,0.05) 1px, transparent 1px)",
        backgroundSize: "6vw 6vw"
      }} />
      <div className="absolute top-0 left-0 right-0" style={{ height: "0.4vh", background: "#2a9d8f" }} />

      <div className="absolute top-0 right-0" style={{
        padding: "2.5vh 3vw",
        fontFamily: "IBM Plex Mono, monospace",
        fontSize: "1.5vw",
        color: "rgba(141,157,182,0.5)"
      }}>
        04
      </div>

      <div className="absolute inset-0 flex flex-col" style={{ paddingLeft: "7vw", paddingRight: "7vw", paddingTop: "7vh", paddingBottom: "7vh" }}>

        {/* Header */}
        <div style={{ marginBottom: "3.5vh" }}>
          <div style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: "1.5vw", color: "#2a9d8f", letterSpacing: "0.1em", marginBottom: "1vh" }}>
            ECHIM #2
          </div>
          <h2 style={{
            fontFamily: "Space Grotesk, sans-serif",
            fontWeight: 800,
            fontSize: "4vw",
            color: "#f1faee",
            letterSpacing: "-0.02em",
            lineHeight: 1
          }}>
            Lokatsiya Aniqligini Tuzatish
          </h2>
        </div>

        {/* Two columns */}
        <div className="flex" style={{ flex: 1, gap: "3vw" }}>

          {/* Left — coordinate fix */}
          <div style={{ flex: 1 }}>
            <div style={{
              fontFamily: "IBM Plex Mono, monospace",
              fontSize: "1.5vw",
              color: "#8d9db6",
              letterSpacing: "0.08em",
              marginBottom: "2vh",
              borderBottom: "1px solid rgba(69,123,157,0.2)",
              paddingBottom: "1.5vh"
            }}>
              KOORDINATALAR
            </div>

            <div style={{ marginBottom: "2.5vh", padding: "2vh 1.8vw", background: "rgba(42,157,143,0.07)", border: "1px solid rgba(42,157,143,0.2)", borderRadius: "0.4vw" }}>
              <div style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: "2vw", color: "#f1faee", marginBottom: "0.8vh" }}>
                Google Maps orqali tekshirish
              </div>
              <div style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: "1.65vw", color: "#8d9db6", lineHeight: 1.5 }}>
                Har bir viloyat sudi manzilini Google Maps da qidirib, to'g'ri lat/lng ni courtsData.ts ga kiritish.
              </div>
            </div>

            <div style={{ padding: "2vh 1.8vw", background: "rgba(42,157,143,0.07)", border: "1px solid rgba(42,157,143,0.2)", borderRadius: "0.4vw" }}>
              <div style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: "2vw", color: "#f1faee", marginBottom: "0.8vh" }}>
                Koordinatasiz sudlar
              </div>
              <div style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: "1.65vw", color: "#8d9db6", lineHeight: 1.5 }}>
                lat/lng yo'q bo'lsa lokatsiya jo'natilmaydi — bu allaqachon ishlamoqda. Faqat ma'lumotlarni to'g'rilash kerak.
              </div>
            </div>
          </div>

          {/* Right — UX fix */}
          <div style={{ flex: 1 }}>
            <div style={{
              fontFamily: "IBM Plex Mono, monospace",
              fontSize: "1.5vw",
              color: "#8d9db6",
              letterSpacing: "0.08em",
              marginBottom: "2vh",
              borderBottom: "1px solid rgba(69,123,157,0.2)",
              paddingBottom: "1.5vh"
            }}>
              FOYDALANUVCHI TAJRIBASI
            </div>

            <div style={{ marginBottom: "2.5vh", padding: "2vh 1.8vw", background: "rgba(42,157,143,0.07)", border: "1px solid rgba(42,157,143,0.2)", borderRadius: "0.4vw" }}>
              <div style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: "2vw", color: "#f1faee", marginBottom: "0.8vh" }}>
                "Xaritada ko'rish" tugmasi
              </div>
              <div style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: "1.65vw", color: "#8d9db6", lineHeight: 1.5 }}>
                Avtomatik lokatsiya o'rniga alohida tugma qo'shish. Foydalanuvchi xohlasa bosadi — API chaqiruvlari kamayadi.
              </div>
            </div>

            <div style={{ padding: "2vh 1.8vw", background: "rgba(42,157,143,0.07)", border: "1px solid rgba(42,157,143,0.2)", borderRadius: "0.4vw" }}>
              <div style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: "2vw", color: "#f1faee", marginBottom: "0.8vh" }}>
                Fuqarolik sudlari ajratish
              </div>
              <div style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: "1.65vw", color: "#8d9db6", lineHeight: 1.5 }}>
                Fuqarolik va Jinoyat bo'limi uchun alohida ma'lumot yaratish — foydalanuvchi chalkashmasin.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
