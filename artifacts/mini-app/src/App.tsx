import { useEffect, useState } from "react";
import { initTg } from "@/lib/tg";
import { Home } from "@/pages/Home";
import { ArizaCatalog } from "@/pages/ArizaCatalog";
import { ConsultationPage } from "@/pages/ConsultationPage";
import { AiPage } from "@/pages/AiPage";
import { Courts } from "@/pages/Courts";
import { AlimentCalc } from "@/pages/AlimentCalc";
import { Tahlil } from "@/pages/Tahlil";
import { ProfessionalPage } from "@/pages/ProfessionalPage";
import "./index.css";

export type Page =
  | "home"
  | "ariza"
  | "consultation"
  | "ai"
  | "courts"
  | "aliment_calc"
  | "tahlil"
  | "professional";

export default function App() {
  const [page, setPage] = useState<Page>("home");

  useEffect(() => { initTg(); }, []);

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", minHeight: "100vh" }}>
      {page === "home"         && <Home onNavigate={setPage} />}
      {page === "ariza"        && <ArizaCatalog onBack={() => setPage("home")} />}
      {page === "consultation" && <ConsultationPage onBack={() => setPage("home")} />}
      {page === "ai"           && <AiPage onBack={() => setPage("home")} />}
      {page === "courts"       && <Courts onBack={() => setPage("home")} />}
      {page === "aliment_calc" && <AlimentCalc onBack={() => setPage("home")} />}
      {page === "tahlil"       && <Tahlil onBack={() => setPage("home")} />}
      {page === "professional" && <ProfessionalPage onBack={() => setPage("home")} />}
    </div>
  );
}
