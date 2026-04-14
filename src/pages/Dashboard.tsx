"use client";

import {
  FileText,
  AlertCircle,
  CheckCircle2,
  FileBadge,
  Clock,
  ArrowUpRight,
  Plus,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  dashboardSummary,
  mockAnalyses,
  recentActivities,
} from "@/data/mockData";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { canEditAnalysis, isAdmin } from "@/lib/permissions";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const SummaryCard = ({
  title,
  value,
  icon: Icon,
  color,
}: {
  title: string;
  value: number;
  icon: any;
  color: string;
}) => (
  <Card className="border-none shadow-sm overflow-hidden">
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
        </div>
        <div className={cn("p-3 rounded-xl", color)}>
          <Icon size={24} />
        </div>
      </div>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const { profile } = useAuth();
  const [view, setView] = useState<"me" | "all">("all");

  // Filtragem de análises conforme visão selecionada
  const filteredAnalyses =
    view === "me"
      ? mockAnalyses.filter((a) => a.assigned_analyst_id === profile?.id)
      : mockAnalyses;

  // Cards na ordem solicitada
  const cardsData = [
    {
      title: "Projetos Analisados",
      value: dashboardSummary.inProgress,
      icon: Clock,
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "Projetos Pendentes",
      value: dashboardSummary.docPending + dashboardSummary.techPending,
      icon: AlertCircle,
      color: "bg-amber-50 text-amber-600",
    },
    {
      title: "Projetos Aprovados",
      value: dashboardSummary.approved,
      icon: CheckCircle2,
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      title: "Alvarás Assinados",
      value: dashboardSummary.permitsIssued,
      icon: FileBadge,
      color: "bg-indigo-50 text-indigo-600",
    },
  ];

  // Limita a 8 registros recentes
  const recentAnalyses = filteredAnalyses.slice(0, 8);

  return (
    <div className="space-y-8">
      {/* Botão Nova Análise e Filtro */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Button
          asChild
          className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2"
        >
          <Link to="/analises/nova">
            <Plus size={16} />
            Nova Análise
          </Link>
        </Button>

        <div className="flex gap-2">
          <Button
            variant={view === "me" ? "default" : "outline"}
            onClick={() => setView("me")}
          >
            Meus processos
          </Button>
          <Button
            variant={view === "all" ? "default" : "outline"}
            onClick={() => setView("all")}
          >
            Todos os processos
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cardsData.map((card) => (
          <SummaryCard key={card.title} {...card} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Análises Recentes */}
        <Card className="lg:col-span-2 border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-semibold">
              Análises Recentes
            </CardTitle>
            <Link to="/analises">
              <Button variant="link" className="text-indigo-600 hover:underline flex items-center gap-1">
                Ver todas <ArrowUpRight size={14} />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="text-slate-400 border-b border-slate-100">
                    <th className="pb-3 font-medium">Processo</th>
                    <th className="pb-3 font-medium">Requerente</th>
                    <th className="pb-3 font-medium">CNPJ</th>
                    <th className="pb-3 font-medium">Categoria</th>
                    <th className="pb-3 font-medium">Obra</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Última Mov.</th>
                    <th className="pb-3 font-medium text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {recentAnalyses.map((item) => {
                    const canEdit =
                      canEditAnalysis(profile, item.assigned_analyst_id) ||
                      isAdmin(profile);
                    return (
                      <tr
                        key={item.id}
                        className="group hover:bg-slate-50/50 transition-colors"
                      >
                        <td className="py-4 font-medium text-slate-900">
                          {item.processNumber}
                        </td>
                        <td className="py-4 text-slate-600">{item.requester}</td>
                        <td className="py-4 text-slate-600">{item.document}</td>
                        <td className="py-4 text-slate-600">{item.requestType}</td>
                        <td className="py-4 text-slate-600">{item.address}</td>
                        <td className="py-4">
                          <StatusBadge status={item.status} />
                        </td>
                        <td className="py-4 text-slate-600">
                          {format(
                            new Date(item.updatedAt),
                            "dd/MM/yyyy",
                            { locale: ptBR },
                          )}
                        </td>
                        <td className="py-4 text-right">
                          <Link to={`/analises/${item.id}`}>
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-1"
                            >
                              {canEdit ? "Abrir análise" : "Visualizar"}
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Espaço reservado (pode ser usado futuramente) */}
        <div className="hidden lg:block"></div>
      </div>
    </div>
  );
};

export default Dashboard;