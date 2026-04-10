import { Plus, Search, Filter, Eye, Edit2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { mockAnalyses } from "@/data/mockData";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Link } from "react-router-dom";
import { format } from "date-fns";

const AnalysisList = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <Input 
            placeholder="Buscar por processo, requerente ou documento..." 
            className="pl-10 bg-white border-slate-200"
          />
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2 border-slate-200">
            <Filter size={18} /> Filtros
          </Button>
          <Link to="/analises/nova">
            <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700">
              <Plus size={18} /> Nova Análise
            </Button>
          </Link>
        </div>
      </div>

      <Card className="border-none shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="text-slate-400 border-b border-slate-100 bg-slate-50/50">
                  <th className="px-6 py-4 font-medium">Processo / Protocolo</th>
                  <th className="px-6 py-4 font-medium">Requerente</th>
                  <th className="px-6 py-4 font-medium">Responsável Técnico</th>
                  <th className="px-6 py-4 font-medium">Analista</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {mockAnalyses.map((item) => (
                  <tr key={item.id} className="group hover:bg-slate-50/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-900">{item.processNumber}</div>
                      <div className="text-xs text-slate-500">{item.protocolNumber}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-slate-900 font-medium">{item.requester}</div>
                      <div className="text-xs text-slate-500">{item.document}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{item.technicalResponsible}</td>
                    <td className="px-6 py-4 text-slate-600">{item.analystName}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link to={`/analises/${item.id}`}>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-indigo-600">
                            <Eye size={16} />
                          </Button>
                        </Link>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-indigo-600">
                          <Edit2 size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between text-slate-500 text-xs">
            <p>Mostrando {mockAnalyses.length} de 124 resultados</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled className="h-8 px-3">Anterior</Button>
              <Button variant="outline" size="sm" className="h-8 px-3">Próximo</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalysisList;