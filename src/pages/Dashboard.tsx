import { 
  FileText, 
  AlertCircle, 
  CheckCircle2, 
  FileBadge, 
  Clock,
  ArrowUpRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { dashboardSummary, mockAnalyses, recentActivities } from "@/data/mockData";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const SummaryCard = ({ title, value, icon: Icon, color }: any) => (
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

import { cn } from "@/lib/utils";

const Dashboard = () => {
  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <SummaryCard 
          title="Em Andamento" 
          value={dashboardSummary.inProgress} 
          icon={Clock} 
          color="bg-blue-50 text-blue-600" 
        />
        <SummaryCard 
          title="Pend. Documental" 
          value={dashboardSummary.docPending} 
          icon={AlertCircle} 
          color="bg-amber-50 text-amber-600" 
        />
        <SummaryCard 
          title="Pend. Técnica" 
          value={dashboardSummary.techPending} 
          icon={AlertCircle} 
          color="bg-orange-50 text-orange-600" 
        />
        <SummaryCard 
          title="Aprovados" 
          value={dashboardSummary.approved} 
          icon={CheckCircle2} 
          color="bg-emerald-50 text-emerald-600" 
        />
        <SummaryCard 
          title="Alvarás Emitidos" 
          value={dashboardSummary.permitsIssued} 
          icon={FileBadge} 
          color="bg-indigo-50 text-indigo-600" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Analyses Table */}
        <Card className="lg:col-span-2 border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-semibold">Análises Recentes</CardTitle>
            <button className="text-xs font-medium text-indigo-600 hover:underline flex items-center gap-1">
              Ver todas <ArrowUpRight size={14} />
            </button>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="text-slate-400 border-b border-slate-100">
                    <th className="pb-3 font-medium">Processo</th>
                    <th className="pb-3 font-medium">Requerente</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium text-right">Atualização</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {mockAnalyses.slice(0, 5).map((item) => (
                    <tr key={item.id} className="group hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 font-medium text-slate-900">{item.processNumber}</td>
                      <td className="py-4 text-slate-600">{item.requester}</td>
                      <td className="py-4">
                        <StatusBadge status={item.status} />
                      </td>
                      <td className="py-4 text-right text-slate-500">
                        {format(new Date(item.updatedAt), "dd/MM/yyyy", { locale: ptBR })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Atividade Recente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex gap-4">
                  <div className={cn(
                    "w-2 h-2 rounded-full mt-1.5 shrink-0",
                    activity.type === 'status_change' ? "bg-amber-500" : "bg-blue-500"
                  )} />
                  <div>
                    <p className="text-sm text-slate-900 font-medium leading-tight">{activity.description}</p>
                    <p className="text-xs text-slate-500 mt-1">
                      Por {activity.user} • {format(new Date(activity.timestamp), "HH:mm", { locale: ptBR })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;