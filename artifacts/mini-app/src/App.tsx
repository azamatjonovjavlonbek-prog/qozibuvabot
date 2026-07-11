import { useEffect, useState } from "react";
import { initTg } from "@/lib/tg";
import { Home } from "@/pages/Home";
import { Catalog } from "@/pages/Catalog";
import { Confirm } from "@/pages/Confirm";
import { Success } from "@/pages/Success";
import "./index.css";

export type Service =
  | { type: "shablon"; catId: string; label: string }
  | { type: "consultation" }
  | { type: "ai_credits" };

export type Page = "home" | "catalog" | "confirm" | "success";

export default function App() {
  const [page, setPage] = useState<Page>("home");
  const [service, setService] = useState<Service | null>(null);

  useEffect(() => { initTg(); }, []);

  function goToConfirm(svc: Service) {
    setService(svc);
    setPage("confirm");
  }

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", minHeight: "100vh" }}>
      {page === "home"    && <Home    onCatalog={() => setPage("catalog")} />}
      {page === "catalog" && <Catalog onSelect={goToConfirm} onBack={() => setPage("home")} />}
      {page === "confirm" && service && (
        <Confirm service={service} onBack={() => setPage("catalog")} onSuccess={() => setPage("success")} />
      )}
      {page === "success" && <Success onHome={() => setPage("home")} />}
    </div>
  );
}
