"use client";

import { useEffect, useState, useMemo } from "react";
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
import { isAdmin } from "@/lib/permissions";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import supabase from "@/lib/supabase";

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
  const [analyses, setAnalyses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("analyses")
        .select(`
          *,
          analyst:profiles!analyses_assigned_analyst_id_fkey(nome)
        `)
        .order("updated_at", { ascending: false });

      if (view === "me" && profile?.id) {
        query = query.eq("assigned_analyst_id", profile.id);
      }

      const { data, error } = await query;

      if (error) throw error;
      setAnalyses(data || []);
    } catch (error) {
      console.error("Erro ao buscar dados do dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [view, profile?.id]);

  const stats = useMemo(() => {
    const inProgress = analyses.filter(a => a.status === 'em_andamento').length;
    const docPending = analyses.filter(a => a.status === 'pendencia_documental').length;
    const techPending = analyses.filter(a => a.status === 'pendencia_tecnica').length;
    const approved = analyses.filter(a => a.status === 'aprovado').length;
    const permitsIssued = analyses.filter(a => a.status === 'alvara_emitido').length;
    
    const semMovimentacao = analyses.filter(a => {
      const diff = Date.now() - new Date(a.updated_at).getTime();
      return diff > (15 * 24 * 60 * 60 * 1000);
    }).length;

    return {
      inProgress,
      pending: docPending + techPending,
      approved,
      permitsIssued,
      docPending,
      techPending,
      semMovimentacao
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

  const recentAnalyses = analyses.slice(0, 8);

  if (loading && analyses.length === 0) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

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
                  <th className="pb-3 pr-4 font-medium">Documento</th>
                  <th className="pb-3 pr-4 font-medium">Categoria</th>
                  <th className="pb-3 pr-4 font-medium">Endereço</th>
                  <th className="pb-3 pr-4 font-medium">Status</th>
                  <th className="pb-3 pr-4 font-medium">Última Mov.</th>
                  <th className="pb-3 text-right font-medium">Ação</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-50">
                {recentAnalyses.map((item) => (
                  <tr
                    key={item.id}
                    className="group transition-colors hover:bg-slate-50/50"
                  >
                    <td className="py-4 pr-4 font-medium text-slate-900 whitespace-nowrap">
                      {item.process_number}
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
                        {item.request_type}
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
                      {format(new Date(item.updated_at), "dd/MM/yyyy", {
                        locale: ptBR,
                      })}
                    </td>

                    <td className="py-4 text-right">
                      <Link to={`/analises/${item.id}`}>
                        <Button variant="outline" size="sm" className="gap-1">
                          Visualizar
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}

                {recentAnalyses.length === 0 && !loading && (
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
          color="bg-slate-100 text-slate-700"
        />
      </div>
    </div>
  );
};

export default Dashboard;