import { useParams, useNavigate } from "react-router-dom";
import { mockAnalyses } from "@/data/mockData";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  FileText, 
  User, 
  MapPin, 
  History, 
  AlertCircle,
  Download,
  Printer
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const AnalysisDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const analysis = mockAnalyses.find(a => a.id === id) || mockAnalyses[0];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="text-slate-500">
            <ArrowLeft size={20} />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-slate-900">{analysis.processNumber}</h2>
              <StatusBadge status={analysis.status} />
            </div>
            <p className="text-sm text-slate-500">Protocolo: {analysis.protocolNumber}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2 border-slate-200">
            <Printer size={18} /> Imprimir
          </Button>
          <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700">
            <Download size={18} /> Exportar PDF
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Informações Principais */}
          <Card className="border-none shadow-sm">
            <CardHeader className="border-b border-slate-50">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <FileText size={18} className="text-indigo-600" /> Dados da Solicitação
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
              <div>
                <p className="text-xs text-slate-400 uppercase font-semibold tracking-wider mb-1">Tipo de Solicitação</p>
                <p className="text-sm text-slate-900 font-medium">{analysis.requestType}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase font-semibold tracking-wider mb-1">Data de Entrada</p>
                <p className="text-sm text-slate-900 font-medium">
                  {format(new Date(analysis.createdAt), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                </p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-xs text-slate-400 uppercase font-semibold tracking-wider mb-1">Observações Internas</p>
                <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                  {analysis.observations || "Nenhuma observação registrada até o momento."}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Localização e Dados Técnicos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Card className="border-none shadow-sm">
              <CardHeader className="border-b border-slate-50">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <MapPin size={18} className="text-indigo-600" /> Localização
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div>
                  <p className="text-xs text-slate-400 uppercase font-semibold tracking-wider mb-1">Endereço</p>
                  <p className="text-sm text-slate-900 font-medium">{analysis.address}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase font-semibold tracking-wider mb-1">Cadastro Imobiliário</p>
                  <p className="text-sm text-slate-900 font-medium">{analysis.realEstateId}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase font-semibold tracking-wider mb-1">Zoneamento</p>
                  <p className="text-sm text-slate-900 font-medium">{analysis.zoning}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm">
              <CardHeader className="border-b border-slate-50">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <User size={18} className="text-indigo-600" /> Envolvidos
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div>
                  <p className="text-xs text-slate-400 uppercase font-semibold tracking-wider mb-1">Requerente</p>
                  <p className="text-sm text-slate-900 font-medium">{analysis.requester}</p>
                  <p className="text-xs text-slate-500">{analysis.document}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase font-semibold tracking-wider mb-1">Responsável Técnico</p>
                  <p className="text-sm text-slate-900 font-medium">{analysis.technicalResponsible}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase font-semibold tracking-wider mb-1">Analista Responsável</p>
                  <p className="text-sm text-slate-900 font-medium">{analysis.analystName}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="space-y-6">
          {/* Histórico */}
          <Card className="border-none shadow-sm">
            <CardHeader className="border-b border-slate-50">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <History size={18} className="text-indigo-600" /> Histórico
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6 relative before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-px before:bg-slate-100">
                <div className="relative pl-6">
                  <div className="absolute left-0 top-1.5 w-3.5 h-3.5 rounded-full bg-indigo-600 border-2 border-white shadow-sm"></div>
                  <p className="text-sm font-semibold text-slate-900">Status alterado para {analysis.status.replace('_', ' ')}</p>
                  <p className="text-xs text-slate-500 mt-0.5">Hoje às 14:30 • Por Ricardo Oliveira</p>
                </div>
                <div className="relative pl-6">
                  <div className="absolute left-0 top-1.5 w-3.5 h-3.5 rounded-full bg-slate-300 border-2 border-white shadow-sm"></div>
                  <p className="text-sm font-medium text-slate-600">Processo recebido para análise</p>
                  <p className="text-xs text-slate-500 mt-0.5">Ontem às 09:15 • Por Sistema</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pendências Futuras */}
          <Card className="border-none shadow-sm bg-amber-50/30 border border-amber-100">
            <CardHeader>
              <CardTitle className="text-base font-semibold flex items-center gap-2 text-amber-800">
                <AlertCircle size={18} /> Pendências
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-amber-700 italic">Nenhuma pendência ativa registrada.</p>
              <Button variant="outline" className="w-full mt-4 border-amber-200 text-amber-700 hover:bg-amber-100">
                Registrar Pendência
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AnalysisDetails;