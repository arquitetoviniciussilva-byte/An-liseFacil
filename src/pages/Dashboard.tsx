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
    <div className="space-y-8">
      {/* Header com alinhamento refinado */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-slate-200 shadow-sm w-fit">
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
          className="h-11 gap-2 bg-indigo-600 px-6 text-sm font-bold text-white hover:bg-indigo-700 shadow-md shadow-indigo-200 transition-all hover:-translate-y-0.5 active:translate-y-0"
        >
          <Link to="/analises/nova">
            <Plus size={18} strokeWidth={3} />
            Nova Análise
          </Link>
        </Button>
      </div>

      {/* Grid de Cards Principais */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        {cardsData.map((card) => (
          <SummaryCard key={card.title} {...card} />
        ))}
      </div>

      {/* Tabela de Análises Recentes */}
      <Card className="border-none shadow-sm overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50 bg-white px-6 py-5">
          <CardTitle className="text-base font-bold text-slate-800">
            Análises Recentes
          </CardTitle>
          <Link to="/analises">
            <Button
              variant="ghost"
              size="sm"
              className="text-xs font-bold text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700"
            >
              Ver todas <ArrowUpRight size={14} className="ml-1" />
            </Button>
          </Link>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] text-left text-sm">
              <thead>
                <tr className="bg-slate-50/50 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="px-6 py-4">Processo</th>
                  <th className="px-6 py-4">Requerente / Documento</th>
                  <th className="px-6 py-4">Categoria</th>
                  <th className="px-6 py-4">Endereço</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Última Mov.</th>
                  <th className="px-6 py-4 text-right">Ação</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-50">
                {recentAnalyses.map((item) => (
                  <tr
                    key={item.id}
                    className="group transition-colors hover:bg-slate-50/30"
                  >
                    <td className="px-6 py-4 font-bold text-slate-900">
                      {item.process_number}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-700 line-clamp-1">{item.requester}</span>
                        <span className="text-[11px] text-slate-400">{item.document}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      <span className="line-clamp-1">{item.request_type}</span>
                    </td>

                    <td className="px-6 py-4 text-slate-500">
                      <span className="line-clamp-1 text-xs">{item.address}</span>
                    </td>

                    <td className="px-6 py-4">
                      <StatusBadge status={item.status} />
                    </td>

                    <td className="px-6 py-4 text-slate-500 font-medium">
                      {format(new Date(item.updated_at), "dd MMM yyyy", {
                        locale: ptBR,
                      })}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <Link to={`/analises/${item.id}`}>
                        <Button variant="outline" size="sm" className="h-8 px-3 text-xs font-bold border-slate-200 hover:bg-slate-50 hover:text-indigo-600 transition-all">
                          Detalhes
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}

                {recentAnalyses.length === 0 && !loading && (
                  <tr>
                    <td
                      colSpan={7}
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

      {/* Bloco Inferior de Pendências */}
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