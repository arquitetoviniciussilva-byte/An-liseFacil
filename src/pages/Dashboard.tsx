"use client";

import {
  AlertCircle,
  CheckCircle2,
  FileBadge,
  Clock,
  ArrowUpRight,
  Plus,
  FileWarning,
  FileClock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { dashboardSummary, mockAnalyses } from "@/data/mockData";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { canEditAnalysis, isAdmin } from "@/lib/permissions";
import { useMemo, useState } from "react";
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
  <Card className="overflow-hidden border-none shadow-sm">
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="mb-1 text-sm font-medium text-slate-500">{title}</p>
          <h3 className="text-3xl font-bold tracking-tight text-slate-900">
            {value}
          </h3>
        </div>
        <div className={cn("rounded-xl p-3", color)}>
          <Icon size={24} />
        </div>
      </div>
    </CardContent>
  </Card>
);

const MiniStatCard = ({
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
  <Card className="border-none shadow-sm">
    <CardContent className="flex items-center justify-between p-5">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
          {title}
        </p>
        <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
      </div>
      <div className={cn("rounded-xl p-3", color)}>
        <Icon size={20} />
      </div>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const { profile } = useAuth();
  const [view, setView] = useState<"me" | "all">("all");

  const filteredAnalyses =
    view === "me"
      ? mockAnalyses.filter((a) => a.assigned_analyst_id === profile?.id)
      : mockAnalyses;

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

  const recentAnalyses = filteredAnalyses.slice(0, 8);

  const pendingSummary = useMemo(() => {
    const documental = filteredAnalyses.filter(
      (item) => item.status === "Pendência Documental"
    ).length;

    const tecnica = filteredAnalyses.filter(
      (item) => item.status === "Pendência Técnica"
    ).length;

    const aguardandoAlvara = filteredAnalyses.filter(
      (item) => item.status === "Aprovado"
    ).length;

    const semMovimentacao = filteredAnalyses.filter((item) => {
      const updatedAt = new Date(item.updatedAt).getTime();
      const today = Date.now();
      const diffDays = (today - updatedAt) / (1000 * 60 * 60 * 24);
      return diffDays > 15;
    }).length;

    return {
      documental,
      tecnica,
      aguardandoAlvara,
      semMovimentacao,
    };
  }, [filteredAnalyses]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <Button
          asChild
          className="h-11 gap-2 bg-indigo-600 px-5 text-white hover:bg-indigo-700"
        >
          <Link to="/analises/nova">
            <Plus size={16} />
            Nova Análise
          </Link>
        </Button>

        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
          <Button
            variant={view === "me" ? "default" : "outline"}
            onClick={() => setView("me")}
            className={cn(
              "h-11 px-5",
              view === "me" && "bg-slate-900 text-white hover:bg-slate-800"
            )}
          >
            Meus processos
          </Button>

          <Button
            variant={view === "all" ? "default" : "outline"}
            onClick={() => setView("all")}
            className={cn(
              "h-11 px-5",
              view === "all" && "bg-slate-900 text-white hover:bg-slate-800"
            )}
          >
            Todos os processos
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cardsData.map((card) => (
          <SummaryCard key={card.title} {...card} />
        ))}
      </div>

      <Card className="border-none shadow-sm">
        <CardHeader className="flex flex-col gap-3 pb-2 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-base font-semibold">
            Análises Recentes
          </CardTitle>

          <Link to="/analises">
            <Button
              variant="link"
              className="h-auto p-0 text-indigo-600 hover:underline"
            >
              <span className="flex items-center gap-1">
                Ver todas <ArrowUpRight size={14} />
              </span>
            </Button>
          </Link>
        </CardHeader>

        <CardContent className="pt-2">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1080px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400">
                  <th className="pb-3 pr-4 font-medium">Processo</th>
                  <th className="pb-3 pr-4 font-medium">Requerente</th>
                  <th className="pb-3 pr-4 font-medium">CNPJ</th>
                  <th className="pb-3 pr-4 font-medium">Categoria</th>
                  <th className="pb-3 pr-4 font-medium">Obra</th>
                  <th className="pb-3 pr-4 font-medium">Status</th>
                  <th className="pb-3 pr-4 font-medium">Última Mov.</th>
                  <th className="pb-3 text-right font-medium">Ação</th>
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
                      className="group transition-colors hover:bg-slate-50/50"
                    >
                      <td className="py-4 pr-4 font-medium text-slate-900 whitespace-nowrap">
                        {item.processNumber}
                      </td>

                      <td className="py-4 pr-4 text-slate-600">
                        <div className="max-w-[220px] leading-5">
                          {item.requester}
                        </div>
                      </td>

                      <td className="py-4 pr-4 text-slate-600 whitespace-nowrap">
                        {item.document}
                      </td>

                      <td className="py-4 pr-4 text-slate-600">
                        <div className="max-w-[190px] leading-5">
                          {item.requestType}
                        </div>
                      </td>

                      <td className="py-4 pr-4 text-slate-600">
                        <div className="max-w-[220px] leading-5">
                          {item.address}
                        </div>
                      </td>

                      <td className="py-4 pr-4 whitespace-nowrap">
                        <StatusBadge status={item.status} />
                      </td>

                      <td className="py-4 pr-4 text-slate-600 whitespace-nowrap">
                        {format(new Date(item.updatedAt), "dd/MM/yyyy", {
                          locale: ptBR,
                        })}
                      </td>

                      <td className="py-4 text-right">
                        <Link to={`/analises/${item.id}`}>
                          <Button variant="outline" size="sm" className="gap-1">
                            {canEdit ? "Abrir análise" : "Visualizar"}
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  );
                })}

                {recentAnalyses.length === 0 && (
                  <tr>
                    <td
                      colSpan={8}
                      className="py-8 text-center text-slate-500"
                    >
                      Nenhuma análise encontrada para este filtro.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MiniStatCard
          title="Pendência documental"
          value={pendingSummary.documental}
          icon={FileWarning}
          color="bg-amber-50 text-amber-600"
        />
        <MiniStatCard
          title="Pendência técnica"
          value={pendingSummary.tecnica}
          icon={AlertCircle}
          color="bg-orange-50 text-orange-600"
        />
        <MiniStatCard
          title="Aguardando alvará"
          value={pendingSummary.aguardandoAlvara}
          icon={FileBadge}
          color="bg-indigo-50 text-indigo-600"
        />
        <MiniStatCard
          title="Sem mov. há 15+ dias"
          value={pendingSummary.semMovimentacao}
          icon={FileClock}
          color="bg-slate-100 text-slate-700"
        />
      </div>
    </div>
  );
};

export default Dashboard;