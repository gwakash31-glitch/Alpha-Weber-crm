import { BarChart3, Bot, Building2, CalendarClock, ContactRound, FileSpreadsheet, Gauge, LockKeyhole, MessageCircle, ShieldCheck, Sparkles, UsersRound, WalletCards, Workflow } from 'lucide-react';

export const modules = [
  { icon: LockKeyhole, title: 'Enterprise Authentication', text: 'Google, email, OTP, forgot password, two-factor authentication, and role-based access for admins, teams, and clients.' },
  { icon: ContactRound, title: 'Lead & Client Command Center', text: 'Track every lead with company, industry, country, address, source, tags, notes, score, budget, revenue, and follow-up intelligence.' },
  { icon: FileSpreadsheet, title: 'Campaign Manager', text: 'Import CSV/Excel contacts, organize groups and tags, schedule approved business communications, and monitor reports.' },
  { icon: MessageCircle, title: 'WhatsApp Business Workflows', text: 'Template management, compliant scheduling, conversations, reply tracking, delivery reports, and client messaging analytics.' },
  { icon: BarChart3, title: 'Growth Analytics', text: 'Lead, revenue, campaign, conversion, weekly, monthly, reply, and client reports designed for executive decisions.' },
  { icon: ShieldCheck, title: 'Admin & Client Portals', text: 'Separate mobile-first dashboards for administrators, internal teams, and clients with scoped data visibility.' },
];

export const roadmap = [
  { icon: Bot, title: 'AI Assistant & Chatbot' }, { icon: Workflow, title: 'Email Automation & APIs' }, { icon: CalendarClock, title: 'Google Calendar Booking' }, { icon: WalletCards, title: 'Subscriptions & Payments' }, { icon: Building2, title: 'Real Estate CRM Mode' }, { icon: Sparkles, title: 'Voice AI' },
];

export const nav = ['Dashboard', 'Leads', 'Campaigns', 'WhatsApp', 'Analytics', 'Admin'];
export const pipeline = ['New Lead', 'Qualified', 'Meeting', 'Proposal', 'Closed'];
export const icons = { Gauge, UsersRound };
