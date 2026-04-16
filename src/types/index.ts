export type UserRole = 'admin' | 'analista';
export type UserStatus = 'pendente' | 'ativo' | 'recusado' | 'inativo';

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
  role: UserRole;
  avatar?: string;
}

export interface UserProfile {
  id: string;
  nome: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  avatar_url?: string;
  created_at: string;
}

export interface Analysis {
  id: string;
  processNumber: string;
  protocolNumber: string;
  requester: string;
  technicalResponsible: string;
  document: string;
  requestType: string;
  address: string;
  realEstateId: string;
  zoning: string;
  analystId: string;
  analystName: string;
  status: AnalysisStatus;
  observations?: string;
  assigned_analyst_id: string;
  created_by: string;
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

export interface AuthState {
  profile: UserProfile | null;
  loading: boolean;
  isAuthenticated: boolean;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  description: string;
  is_read: boolean;
  created_at: string;
}