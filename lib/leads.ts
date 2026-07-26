import type { LeadStatus } from '@/lib/supabase/database.types';

export const leadStatuses = ['new', 'qualified', 'meeting', 'proposal', 'won', 'lost'] as const satisfies readonly LeadStatus[];

export const statusLabels: Record<LeadStatus, string> = {
  new: 'New',
  qualified: 'Qualified',
  meeting: 'Meeting',
  proposal: 'Proposal',
  won: 'Won',
  lost: 'Lost',
};

export interface LeadWithLatestNote {
  id: string;
  owner_id: string;
  name: string;
  phone: string;
  business_name: string;
  email: string;
  status: LeadStatus;
  created_at: string;
  updated_at: string;
  lead_notes?: Array<{ id: string; body: string; created_at: string }>;
}

export interface LeadInput {
  name: string;
  phone: string;
  business_name: string;
  email: string;
  status: LeadStatus;
  note: string;
}

export const emptyLeadInput: LeadInput = {
  name: '',
  phone: '',
  business_name: '',
  email: '',
  status: 'new',
  note: '',
};

export function normalizeLeadInput(input: LeadInput): LeadInput {
  return {
    name: input.name.trim(),
    phone: input.phone.trim(),
    business_name: input.business_name.trim(),
    email: input.email.trim().toLowerCase(),
    status: input.status,
    note: input.note.trim(),
  };
}

export function validateLeadInput(input: LeadInput): Partial<Record<keyof LeadInput, string>> {
  const errors: Partial<Record<keyof LeadInput, string>> = {};
  const normalized = normalizeLeadInput(input);

  if (!normalized.name) errors.name = 'Lead name is required.';
  if (!normalized.business_name) errors.business_name = 'Business name is required.';
  if (!normalized.phone) errors.phone = 'Phone number is required.';
  if (!/^\+?[0-9 ().-]{7,}$/.test(normalized.phone)) errors.phone = 'Enter a valid phone number.';
  if (!normalized.email) errors.email = 'Email is required.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized.email)) errors.email = 'Enter a valid email address.';
  if (!leadStatuses.includes(normalized.status)) errors.status = 'Choose a valid status.';

  return errors;
}
