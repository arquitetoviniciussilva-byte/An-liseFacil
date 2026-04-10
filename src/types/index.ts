export type AnalysisStatus = 
  | 'em_andamento' 
  | 'pendencia_documental' 
  | 'pendencia_tecnica' 
  | 'aprovado' 
  | 'alvara_emitido' 
  | 'arquivado';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'analista';
  avatar?: string;
}

export interface Analysis {
  id: string;
  processNumber: string;
  protocolNumber: string;
  requester: string;
  technicalResponsible: string;
  document: string; // CPF/CNPJ
  requestType: string;
  address: string;
  realEstateId: string; // Cadastro Imobiliário
  zoning: string;
  analystId: string;
  analystName: string;
  status: AnalysisStatus;
  observations?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardSummary {
  inProgress: number;
  docPending: number;
  techPending: number;
  approved: number;
  permitsIssued: number;
}

export interface RecentActivity {
  id: string;
  type: 'status_change' | 'new_analysis' | 'new_observation';
  description: string;
  user: string;
  timestamp: string;
  analysisId: string;
}