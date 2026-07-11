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
import { Confirm } from "@/pages/Confirm";
import { Success } from "@/pages/Success";
import "./index.css";

export type Service =
  | { type: "shablon"; catId: string; label: string }
  | { type: "consultation" }
  | { type: "ai_credits" };

export type Page =
  | "home"
  | "ariza"
  | "consultation"
  | "ai"
  | "courts"
  | "aliment_calc"
  | "tahlil"
  | "professional"
  | "confirm"
  | "success";

export default function App() {
  const [page, setPage] = useState<Page>("home");
  const [service, setService] = useState<Service | null>(null);

  useEffect(() => { initTg(); }, []);

  function goConfirm(svc: Service) {
    setService(svc);
    setPage("confirm");
  }

  const confirmBack: Page = service?.type === "shablon" ? "ariza" : service?.type === "consultation" ? "consultation" : "ai";

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", minHeight: "100vh" }}>
      {page === "home"         && <Home onNavigate={setPage} />}
      {page === "ariza"        && <ArizaCatalog onSelect={goConfirm} onBack={() => setPage("home")} />}
      {page === "consultation" && <ConsultationPage onConfirm={() => goConfirm({ type: "consultation" })} onBack={() => setPage("home")} />}
      {page === "ai"           && <AiPage onConfirm={() => goConfirm({ type: "ai_credits" })} onBack={() => setPage("home")} />}
      {page === "courts"       && <Courts onBack={() => setPage("home")} />}
      {page === "aliment_calc" && <AlimentCalc onBack={() => setPage("home")} />}
      {page === "tahlil"       && <Tahlil onBack={() => setPage("home")} />}
      {page === "professional" && <ProfessionalPage onBack={() => setPage("home")} />}
      {page === "confirm"      && service && (
        <Confirm service={service} onBack={() => setPage(confirmBack)} onSuccess={() => setPage("success")} />
      )}
      {page === "success"      && <Success onHome={() => setPage("home")} />}
    </div>
  );
}
