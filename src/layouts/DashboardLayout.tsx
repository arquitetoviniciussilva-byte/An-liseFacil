import { Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";

const routeTitles: Record<string, { title: string; subtitle?: string }> = {
  "/dashboard": { title: "Dashboard", subtitle: "Visão geral das análises e produtividade" },
  "/analises": { title: "Análises", subtitle: "Gerenciamento de processos e protocolos" },
  "/analises/nova": { title: "Nova Análise", subtitle: "Cadastro de novo processo no sistema" },
  "/aprovados": { title: "Aprovados", subtitle: "Processos com análise técnica concluída" },
  "/alvaras": { title: "Alvarás", subtitle: "Documentos emitidos e prontos para entrega" },
  "/configuracoes": { title: "Configurações", subtitle: "Ajustes do sistema e perfil" },
};

export const DashboardLayout = () => {
  const location = useLocation();
  const currentRoute = routeTitles[location.pathname] || { title: "Sistema" };

  return (
    <div className="flex min-h-screen bg-slate-50/50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar title={currentRoute.title} subtitle={currentRoute.subtitle} />
        <main className="p-8 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};