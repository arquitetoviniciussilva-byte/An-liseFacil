"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  FileBadge,
  Clock,
  ArrowUpRight,
  Plus,
  FileWarning,
  FileClock,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import supabase from "@/lib/supabase";

type AnalysisRow = {
  id: string;
  process_number: string;
  protocol_number: string;
  requester: string;
  technical_responsible: string;
  document: string;
  request_type: string;
  address: string;
  real_estate_id: string;
  zoning: string;
  status: string;
  observations?: string | null;
  assigned_analyst_id?: string | null;
  created_by?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

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
  <Card className="overflow-hidden border-none shadow-sm transition-all hover:shadow-md">
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="mb-1 text-sm font-medium text-slate-500">{title}</p>
          <h3 className="text-3xl font-bold tracking-tight text-slate-900">
            {value}
          </h3>
        </div>
        <div className={cn("rounded-2xl p-3.5", color)}>
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
  <Card className="border-none shadow-sm transition-all hover:bg-slate-50/50">
    <CardContent className="flex items-center justify-between p-5">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
          {title}
        </p>
        <p className="mt-1 text-2xl font-bold text-slate-900">{value}</p>
      </div>
      <div className={cn("rounded-xl p-2.5", color)}>
        <Icon size={18} />
      </div>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const { profile, isAuthenticated } = useAuth();
  const [view, setView] = useState<"me" | "all">("all");
  const [analyses, setAnalyses] = useState<AnalysisRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const fetchDashboardData = async () => {
      if (!isAuthenticated || !profile?.id) {
        if (active) {
          setAnalyses([]);
          setLoading(false);
        }
        return;
      }

      try {
        if (active) setLoading(true);

        let query = supabase
          .from("analyses")
          .select("*")
          .order("updated_at", { ascending: false })
          .limit(8);

        if (view === "me") {
          query = query.eq("assigned_analyst_id", profile.id);
        }

        const { data, error } = await query;

        if (!active) return;

        if (error) {
          console.error("Erro ao buscar dados do dashboard:", error);
          setAnalyses([]);
          return;
        }

        setAnalyses((data || []) as AnalysisRow[]);
      } catch (error) {
        if (!active) return;
        console.error("Erro ao buscar dados do dashboard:", error);
        setAnalyses([]);
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchDashboardData();

    return () => {
      active = false;
    };
  }, [isAuthenticated, profile?.id, view]);

  const stats = useMemo(() => {
    const inProgress = analyses.filter(
      (a) =>
        a.status === "em_andamento" ||
        a.status === "Em Andamento" ||
        a.status === "em andamento"
    ).length;

    const docPending = analyses.filter(
      (a) =>
        a.status === "pendencia_documental" ||
        a.status === "Pendência Documental" ||
        a.status === "pendencia documental"
    ).length;

    const techPending = analyses.filter(
      (a) =>
        a.status === "pendencia_tecnica" ||
        a.status === "Pendência Técnica" ||
        a.status === "pendencia tecnica"
    ).length;

    const approved = analyses.filter(
      (a) =>
        a.status === "aprovado" ||
        a.status === "Aprovado"
    ).length;

    const permitsIssued = analyses.filter(
      (a) =>
        a.status === "alvara_emitido" ||
        a.status === "Alvará Emitido" ||
        a.status === "alvara emitido"
    ).length;

    const semMovimentacao = analyses.filter((a) => {
      if (!a.updated_at) return false;
      const diff = Date.now() - new Date(a.updated_at).getTime();
      return diff > 15 * 24 * 60 * 60 * 1000;
    }).length;

    return {
      inProgress,
      pending: docPending + techPending,
      approved,
      permitsIssued,
      docPending,
      techPending,
      semMovimentacao,
    };
  }, [analyses]);

  const cardsData = [
    {
      title: "Projetos em Análise",
      value: stats.inProgress,
      icon: Clock,
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "Projetos Pendentes",
      value: stats.pending,
      icon: AlertCircle,
      color: "bg-amber-50 text-amber-600",
    },
    {
      title: "Projetos Aprovados",
      value: stats.approved,
      icon: CheckCircle2,
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      title: "Alvarás Emitidos",
      value: stats.permitsIssued,
      icon: FileBadge,
      color: "bg-indigo-50 text-indigo-600",
    },
  ];

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-1 shadow-sm w-fit">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setView("me")}
            className={cn(
              "h-9 px-4 text-xs font-semibold transition-all",
              view === "me"
                ? "bg-slate-900 text-white hover:bg-slate-800 shadow-sm"
                : "text-slate-500 hover:text-slate-900"
            )}
          >
            Meus processos
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setView("all")}
            className={cn(
              "h-9 px-4 text-xs font-semibold transition-all",
              view === "all"
                ? "bg-slate-900 text-white hover:bg-slate-800 shadow-sm"
                : "text-slate-500 hover:text-slate-900"
            )}
          >
            Todos os processos
          </Button>
        </div>

        <Button
          asChild
          className="h-10 gap-2 bg-indigo-600 text-white hover:bg-indigo-700"
        >
          <Link to="/analises/nova">
            <Plus size={16} />
            Nova Análise
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cardsData.map((card) => (
          <SummaryCard key={card.title} {...card} />
        ))}
      </div>

      <Card className="border-none shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-base font-semibold">
            Análises Recentes
          </CardTitle>
          <Link to="/analises">
            <Button
              variant="link"
              className="flex items-center gap-1 p-0 text-indigo-600 hover:underline"
            >
              Ver todas <ArrowUpRight size={14} />
            </Button>
          </Link>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1080px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400">
                  <th className="pb-3 font-medium">Processo</th>
                  <th className="pb-3 font-medium">Requerente</th>
                  <th className="pb-3 font-medium">CNPJ</th>
                  <th className="pb-3 font-medium">Categoria</th>
                  <th className="pb-3 font-medium">Obra</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Última Mov.</th>
                  <th className="pb-3 text-right font-medium">Ação</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-50">
                {analyses.map((item) => (
                  <tr
                    key={item.id}
                    className="transition-colors hover:bg-slate-50/50"
                  >
                    <td className="py-4 font-medium text-slate-900">
                      {item.process_number}
                    </td>
                    <td className="py-4 text-slate-600">{item.requester}</td>
                    <td className="py-4 text-slate-600">{item.document}</td>
                    <td className="py-4 text-slate-600">{item.request_type}</td>
                    <td className="py-4 text-slate-600">{item.address}</td>
                    <td className="py-4">
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="py-4 text-slate-600">
                      {item.updated_at
                        ? format(new Date(item.updated_at), "dd/MM/yyyy", {
                            locale: ptBR,
                          })
                        : "-"}
                    </td>
                    <td className="py-4 text-right">
                      <Link to={`/analises/${item.id}`}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 px-3 text-xs font-bold border-slate-200 hover:bg-slate-50 hover:text-indigo-600 transition-all"
                        >
                          Detalhes
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}

                {analyses.length === 0 && (
                  <tr>
                    <td
                      colSpan={8}
                      className="py-12 text-center text-slate-400 italic"
                    >
                      Nenhum registro encontrado.
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
          value={stats.docPending}
          icon={FileWarning}
          color="bg-amber-50 text-amber-600"
        />
        <MiniStatCard
          title="Pendência técnica"
          value={stats.techPending}
          icon={AlertCircle}
          color="bg-orange-50 text-orange-600"
        />
        <MiniStatCard
          title="Aguardando alvará"
          value={stats.approved}
          icon={FileBadge}
          color="bg-indigo-50 text-indigo-600"
        />
        <MiniStatCard
          title="Sem mov. há 15+ dias"
          value={stats.semMovimentacao}
          icon={FileClock}
          color="bg-slate-100 text-slate-500"
        />
      </div>
    </div>
  );
};

export default Dashboard;