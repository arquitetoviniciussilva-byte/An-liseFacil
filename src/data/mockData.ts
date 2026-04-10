import { Analysis, User, RecentActivity, DashboardSummary } from '../types';

export const currentUser: User = {
  id: '1',
  name: 'Ricardo Oliveira',
  email: 'ricardo.analista@sistema.gov.br',
  role: 'analista',
  avatar: 'https://github.com/shadcn.png'
};

export const mockAnalyses: Analysis[] = [
  {
    id: '1',
    processNumber: '2024/00125',
    protocolNumber: 'PROT-88291',
    requester: 'Construtora Horizonte Ltda',
    technicalResponsible: 'Eng. Marcos Silva',
    document: '12.345.678/0001-90',
    requestType: 'Alvará de Construção',
    address: 'Av. das Nações, 1500 - Centro',
    realEstateId: '01.02.003.0445',
    zoning: 'ZUR-1',
    analystId: '1',
    analystName: 'Ricardo Oliveira',
    status: 'em_andamento',
    createdAt: '2024-03-10T10:00:00Z',
    updatedAt: '2024-03-12T14:30:00Z',
  },
  {
    id: '2',
    processNumber: '2024/00132',
    protocolNumber: 'PROT-88310',
    requester: 'Ana Maria de Souza',
    technicalResponsible: 'Arq. Juliana Costa',
    document: '123.456.789-00',
    requestType: 'Reforma com Ampliação',
    address: 'Rua das Flores, 45 - Jardim América',
    realEstateId: '05.12.010.0120',
    zoning: 'ZR-2',
    analystId: '1',
    analystName: 'Ricardo Oliveira',
    status: 'pendencia_documental',
    createdAt: '2024-03-11T09:15:00Z',
    updatedAt: '2024-03-11T16:45:00Z',
  },
  {
    id: '3',
    processNumber: '2024/00098',
    protocolNumber: 'PROT-87950',
    requester: 'Shopping Center Norte',
    technicalResponsible: 'Eng. Roberto Mendes',
    document: '98.765.432/0001-11',
    requestType: 'Habite-se',
    address: 'Rodovia BR-101, KM 20',
    realEstateId: '10.01.005.9999',
    zoning: 'ZCS',
    analystId: '2',
    analystName: 'Fernanda Lima',
    status: 'aprovado',
    createdAt: '2024-02-25T11:00:00Z',
    updatedAt: '2024-03-05T10:20:00Z',
  },
  {
    id: '4',
    processNumber: '2024/00085',
    protocolNumber: 'PROT-87800',
    requester: 'Indústria Metalúrgica S.A.',
    technicalResponsible: 'Eng. Paulo Guedes',
    document: '11.222.333/0001-44',
    requestType: 'Alvará de Funcionamento',
    address: 'Distrito Industrial, Lote 12',
    realEstateId: '20.50.001.0001',
    zoning: 'ZI',
    analystId: '1',
    analystName: 'Ricardo Oliveira',
    status: 'alvara_emitido',
    createdAt: '2024-02-15T08:00:00Z',
    updatedAt: '2024-03-01T15:00:00Z',
  }
];

export const dashboardSummary: DashboardSummary = {
  inProgress: 12,
  docPending: 5,
  techPending: 8,
  approved: 45,
  permitsIssued: 38
};

export const recentActivities: RecentActivity[] = [
  {
    id: 'a1',
    type: 'status_change',
    description: 'Alterou status para Pendência Documental',
    user: 'Ricardo Oliveira',
    timestamp: '2024-03-12T14:30:00Z',
    analysisId: '2'
  },
  {
    id: 'a2',
    type: 'new_analysis',
    description: 'Novo processo protocolado',
    user: 'Sistema',
    timestamp: '2024-03-12T10:00:00Z',
    analysisId: '1'
  }
];