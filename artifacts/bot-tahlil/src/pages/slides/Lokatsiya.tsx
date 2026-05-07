export default function Lokatsiya() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "#0f1117" }}>
      <div className="absolute inset-0" style={{
        backgroundImage: "linear-gradient(rgba(69,123,157,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(69,123,157,0.05) 1px, transparent 1px)",
        backgroundSize: "6vw 6vw"
      }} />
      <div className="absolute top-0 left-0 right-0" style={{ height: "0.4vh", background: "#457b9d" }} />

      <div className="absolute top-0 right-0" style={{
        padding: "2.5vh 3vw",
        fontFamily: "IBM Plex Mono, monospace",
        fontSize: "1.5vw",
        color: "rgba(141,157,182,0.5)"
      }}>
        02
      </div>

      <div className="absolute inset-0 flex flex-col" style={{ paddingLeft: "7vw", paddingRight: "7vw", paddingTop: "7vh", paddingBottom: "7vh" }}>
        {/* Header */}
        <div className="flex items-center" style={{ marginBottom: "4vh" }}>
          <div style={{ width: "0.5vw", height: "5vh", background: "#457b9d", borderRadius: "0.2vw", marginRight: "1.5vw" }} />
          <div>
            <div style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: "1.5vw", color: "#457b9d", letterSpacing: "0.1em", marginBottom: "0.5vh" }}>
              MUAMMO #2
            </div>
            <h2 style={{
              fontFamily: "Space Grotesk, sans-serif",
              fontWeight: 800,
              fontSize: "4vw",
              color: "#f1faee",
              letterSpacing: "-0.02em",
              lineHeight: 1
            }}>
              Lokatsiya Noaniq va Noto'g'ri
            </h2>
          </div>
        </div>

        {/* Three column issues */}
        <div className="flex" style={{ gap: "2vw", flex: 1 }}>

          {/* Issue A */}
          <div style={{
            flex: 1,
            background: "rgba(69,123,157,0.08)",
            border: "1px solid rgba(69,123,157,0.25)",
            borderRadius: "0.5vw",
            padding: "2.5vh 2vw"
          }}>
            <div style={{
              fontFamily: "Space Grotesk, sans-serif",
              fontWeight: 800,
              fontSize: "4vw",
              color: "#a8dadc",
              lineHeight: 1,
              marginBottom: "1.5vh"
            }}>
              A
            </div>
            <div style={{
              fontFamily: "Space Grotesk, sans-serif",
              fontWeight: 700,
              fontSize: "2.2vw",
              color: "#f1faee",
              marginBottom: "1.2vh"
            }}>
              Koordinatalar eski
            </div>
            <div style={{
              fontFamily: "IBM Plex Mono, monospace",
              fontSize: "1.7vw",
              color: "#8d9db6",
              lineHeight: 1.6
            }}>
              courtsData.ts dagi lat/lng qiymatlari taxminiy. Bir qator sudlar uchun noto'g'ri bino ko'rsatiladi.
            </div>
          </div>

          {/* Issue B */}
          <div style={{
            flex: 1,
            background: "rgba(69,123,157,0.08)",
            border: "1px solid rgba(69,123,157,0.25)",
            borderRadius: "0.5vw",
            padding: "2.5vh 2vw"
          }}>
            <div style={{
              fontFamily: "Space Grotesk, sans-serif",
              fontWeight: 800,
              fontSize: "4vw",
              color: "#a8dadc",
              lineHeight: 1,
              marginBottom: "1.5vh"
            }}>
              B
            </div>
            <div style={{
              fontFamily: "Space Grotesk, sans-serif",
              fontWeight: 700,
              fontSize: "2.2vw",
              color: "#f1faee",
              marginBottom: "1.2vh"
            }}>
              Har doim lokatsiya
            </div>
            <div style={{
              fontFamily: "IBM Plex Mono, monospace",
              fontSize: "1.7vw",
              color: "#8d9db6",
              lineHeight: 1.6
            }}>
              Sud ma'lumoti ko'rilganda avtomatik lokatsiya jo'natiladi. Bu Telegram API ga qo'shimcha so'rov yuboradi.
            </div>
          </div>

          {/* Issue C */}
          <div style={{
            flex: 1,
            background: "rgba(69,123,157,0.08)",
            border: "1px solid rgba(69,123,157,0.25)",
            borderRadius: "0.5vw",
            padding: "2.5vh 2vw"
          }}>
            <div style={{
              fontFamily: "Space Grotesk, sans-serif",
              fontWeight: 800,
              fontSize: "4vw",
              color: "#a8dadc",
              lineHeight: 1,
              marginBottom: "1.5vh"
            }}>
              C
            </div>
            <div style={{
              fontFamily: "Space Grotesk, sans-serif",
              fontWeight: 700,
              fontSize: "2.2vw",
              color: "#f1faee",
              marginBottom: "1.2vh"
            }}>
              Fuqarolik = Jinoyat
            </div>
            <div style={{
              fontFamily: "IBM Plex Mono, monospace",
              fontSize: "1.7vw",
              color: "#8d9db6",
              lineHeight: 1.6
            }}>
              Fuqarolik sudlari jinoyat sudlari bilan bitta ma'lumotga ulangan. Foydalanuvchi chalkashishi mumkin.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
