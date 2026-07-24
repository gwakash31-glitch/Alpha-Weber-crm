export type Role = 'owner' | 'admin' | 'manager' | 'agent' | 'client';
export type LeadStatus = 'new' | 'qualified' | 'meeting' | 'proposal' | 'won' | 'lost';

export interface LeadRecord {
  id: string;
  tenantId: string;
  name: string;
  number: string;
  email: string;
  companyName: string;
  industry: string;
  country: string;
  address: string;
  tags: string[];
  notes: string[];
  leadSource: string;
  status: LeadStatus;
  followUpDate: string;
  meetingDate?: string;
  budget: number;
  revenue: number;
  score: number;
}

export const boundedContexts = ['identity', 'crm', 'campaigns', 'whatsapp', 'analytics', 'client-portal', 'admin', 'billing', 'ai-automation'] as const;
