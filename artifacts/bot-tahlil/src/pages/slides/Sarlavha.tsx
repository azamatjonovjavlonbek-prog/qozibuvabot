export default function Sarlavha() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "#0f1117" }}>
      {/* Grid accent lines */}
      <div className="absolute inset-0" style={{
        backgroundImage: "linear-gradient(rgba(69,123,157,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(69,123,157,0.07) 1px, transparent 1px)",
        backgroundSize: "6vw 6vw"
      }} />

      {/* Top accent bar */}
      <div className="absolute top-0 left-0 right-0" style={{ height: "0.4vh", background: "#e63946" }} />

      {/* Left color block */}
      <div className="absolute left-0 top-0 bottom-0" style={{ width: "0.6vw", background: "linear-gradient(180deg, #e63946 0%, #457b9d 100%)" }} />

      {/* Main content */}
      <div className="absolute inset-0 flex flex-col justify-center" style={{ paddingLeft: "8vw", paddingRight: "8vw" }}>

        {/* Tag */}
        <div className="flex items-center" style={{ marginBottom: "3vh" }}>
          <div style={{
            background: "rgba(230,57,70,0.15)",
            border: "1px solid rgba(230,57,70,0.4)",
            borderRadius: "0.3vw",
            padding: "0.6vh 1.2vw",
            fontFamily: "IBM Plex Mono, monospace",
            fontSize: "1.5vw",
            color: "#e63946",
            letterSpacing: "0.08em"
          }}>
            TEXNIK TAHLIL / 2025
          </div>
        </div>

        {/* Title */}
        <h1 style={{
          fontFamily: "Space Grotesk, sans-serif",
          fontWeight: 800,
          fontSize: "7vw",
          lineHeight: 1.0,
          color: "#f1faee",
          letterSpacing: "-0.03em",
          textWrap: "balance",
          marginBottom: "2.5vh"
        }}>
          Bot Muammolari
          <br />
          <span style={{ color: "#e63946" }}>Tahlil</span>
        </h1>

        {/* Subtitle */}
        <p style={{
          fontFamily: "IBM Plex Mono, monospace",
          fontSize: "2vw",
          color: "#8d9db6",
          letterSpacing: "0.02em",
          marginBottom: "5vh"
        }}>
          Sekinlik · Lokatsiya xatoliklari · Yechimlar
        </p>

        {/* Two metric boxes */}
        <div className="flex" style={{ gap: "2vw" }}>
          <div style={{
            background: "rgba(230,57,70,0.1)",
            border: "1px solid rgba(230,57,70,0.25)",
            borderRadius: "0.4vw",
            padding: "1.5vh 2vw"
          }}>
            <div style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 800, fontSize: "3.5vw", color: "#e63946", lineHeight: 1 }}>2</div>
            <div style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: "1.5vw", color: "#8d9db6", marginTop: "0.5vh" }}>asosiy muammo</div>
          </div>
          <div style={{
            background: "rgba(69,123,157,0.1)",
            border: "1px solid rgba(69,123,157,0.25)",
            borderRadius: "0.4vw",
            padding: "1.5vh 2vw"
          }}>
            <div style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 800, fontSize: "3.5vw", color: "#a8dadc", lineHeight: 1 }}>5</div>
            <div style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: "1.5vw", color: "#8d9db6", marginTop: "0.5vh" }}>echim taklif</div>
          </div>
        </div>
      </div>

      {/* Right decorative element */}
      <div className="absolute right-0 top-0 bottom-0" style={{ width: "30vw", overflow: "hidden" }}>
        <div style={{
          position: "absolute",
          right: "-8vw",
          top: "50%",
          transform: "translateY(-50%)",
          width: "28vw",
          height: "28vw",
          borderRadius: "50%",
          border: "1px solid rgba(69,123,157,0.15)",
          boxShadow: "0 0 0 4vw rgba(69,123,157,0.03), 0 0 0 8vw rgba(69,123,157,0.02)"
        }} />
        <div style={{
          position: "absolute",
          right: "-4vw",
          top: "50%",
          transform: "translateY(-50%)",
          width: "14vw",
          height: "14vw",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(230,57,70,0.08) 0%, transparent 70%)"
        }} />
      </div>

      {/* Bottom */}
      <div className="absolute bottom-0 left-0 right-0" style={{ height: "0.2vh", background: "rgba(69,123,157,0.3)" }} />
    </div>
  );
}
