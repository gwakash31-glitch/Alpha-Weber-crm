import type { LeadStatus } from '@/lib/leads';

export const nav = [
  { label: 'Dashboard', href: '#dashboard' },
  { label: 'Leads', href: '#leads' },
  { label: 'Pipeline', href: '#pipeline' },
];

export const pipeline: Array<{ label: string; statuses: LeadStatus[] }> = [
  { label: 'New Lead', statuses: ['new'] },
  { label: 'Qualified', statuses: ['qualified'] },
  { label: 'Meeting', statuses: ['meeting'] },
  { label: 'Proposal', statuses: ['proposal'] },
  { label: 'Won', statuses: ['won'] },
  { label: 'Lost', statuses: ['lost'] },
];
