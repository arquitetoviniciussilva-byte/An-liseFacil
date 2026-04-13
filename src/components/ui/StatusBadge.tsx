import { cn } from "@/lib/utils";
import { AnalysisStatus } from "@/types";

interface StatusBadgeProps {
  status: AnalysisStatus;
  className?: string;
}

const statusConfig: Record<AnalysisStatus, { label: string; color: string }> = {
  em_andamento: { label: 'Em Andamento', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  pendencia_documental: { label: 'Pend. Documental', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  pendencia_tecnica: { label: 'Pend. Técnica', color: 'bg-orange-50 text-orange-700 border-orange-200' },
  aprovado: { label: 'Aprovado', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  alvara_emitido: { label: 'Alvará Emitido', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  arquivado: { label: 'Arquivado', color: 'bg-slate-50 text-slate-700 border-slate-200' },
};

export const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const config = statusConfig[status];
  
  return (
    <span className={cn(
      "px-2.5 py-0.5 rounded-full text-xs font-medium border",
      config.color,
      className
    )}>
      {config.label}
    </span>
  );
};