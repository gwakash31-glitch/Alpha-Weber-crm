import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js';

export const leadStatuses = ['new', 'qualified', 'meeting', 'proposal', 'won', 'lost'] as const;

export type LeadStatus = (typeof leadStatuses)[number];

export interface Lead {
  id: string;
  name: string;
  phone: string;
  business_name: string;
  email: string;
  status: LeadStatus;
  notes: string;
  created_at: string;
}

export type LeadInput = Pick<Lead, 'name' | 'phone' | 'business_name' | 'email' | 'status' | 'notes'>;

export type LeadRealtimePayload = RealtimePostgresChangesPayload<Lead>;

export const emptyLeadInput: LeadInput = {
  name: '',
  phone: '',
  business_name: '',
  email: '',
  status: 'new',
  notes: '',
};

export function normalizeLeadInput(input: LeadInput): LeadInput {
  return {
    name: input.name.trim(),
    phone: input.phone.trim(),
    business_name: input.business_name.trim(),
    email: input.email.trim().toLowerCase(),
    status: input.status,
    notes: input.notes.trim(),
  };
}
