import {
  Bot,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  Cloud,
  Code2,
  CreditCard,
  FileText,
  FolderOpen,
  HeartHandshake,
  Inbox,
  KanbanSquare,
  LifeBuoy,
  LockKeyhole,
  Mail,
  MessageCircle,
  Receipt,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Target,
  UsersRound,
  WalletCards,
} from 'lucide-react';

export type WorkItem = {
  id: string;
  title: string;
  company: string;
  owner: string;
  status: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  value: string;
  date: string;
  tags: string[];
};

export const kpis = [
  { label: 'Revenue pipeline', value: '$482K', delta: '+18.6%', icon: CircleDollarSign },
  { label: 'Qualified leads', value: '326', delta: '+11.2%', icon: Target },
  { label: 'Active clients', value: '148', delta: '+7.4%', icon: BriefcaseBusiness },
  { label: 'Open deals', value: '64', delta: '+9.1%', icon: KanbanSquare },
  { label: 'Tasks due', value: '28', delta: '-6.5%', icon: CheckCircle2 },
  { label: 'Meetings today', value: '12', delta: '+3', icon: CalendarDays },
];

export const leads: WorkItem[] = [
  { id: 'LD-1048', title: 'Enterprise automation assessment', company: 'Northstar Logistics', owner: 'Maya Chen', status: 'Qualified', priority: 'High', value: '$64,000', date: 'Aug 04, 2026', tags: ['B2B', 'Automation'] },
  { id: 'LD-1049', title: 'Regional CRM rollout', company: 'Summit Retail Group', owner: 'Ethan Brooks', status: 'Proposal', priority: 'Critical', value: '$128,000', date: 'Aug 08, 2026', tags: ['Retail', 'Expansion'] },
  { id: 'LD-1050', title: 'Client success workflow', company: 'HarborPoint Finance', owner: 'Olivia Grant', status: 'Contacted', priority: 'Medium', value: '$38,500', date: 'Aug 12, 2026', tags: ['Finance', 'Support'] },
  { id: 'LD-1051', title: 'Marketing operations upgrade', company: 'BluePeak Software', owner: 'Noah Patel', status: 'Negotiation', priority: 'High', value: '$91,750', date: 'Aug 18, 2026', tags: ['SaaS', 'Marketing'] },
];

export const clients: WorkItem[] = [
  { id: 'CL-2201', title: 'Growth operations retainer', company: 'Evergreen Manufacturing', owner: 'Sophia Turner', status: 'Active', priority: 'High', value: '$22,400/mo', date: 'Renewal Sep 01', tags: ['Manufacturing', 'Retainer'] },
  { id: 'CL-2202', title: 'Sales enablement platform', company: 'Atlas Property Group', owner: 'Liam Carter', status: 'Onboarding', priority: 'Medium', value: '$86,000', date: 'Kickoff Aug 06', tags: ['Real Estate', 'Enablement'] },
  { id: 'CL-2203', title: 'Support transformation', company: 'Cedar Health Partners', owner: 'Ava Morgan', status: 'At Risk', priority: 'Critical', value: '$118,000', date: 'Review Aug 09', tags: ['Healthcare', 'Support'] },
];

export const activities = [
  'Maya Chen qualified Northstar Logistics after discovery call.',
  'Summit Retail Group requested a revised implementation timeline.',
  'Evergreen Manufacturing uploaded signed security questionnaire.',
  'Cedar Health Partners escalated response-time requirements.',
];

export const productivity = {
  tasks: [
    { title: 'Prepare proposal for Summit Retail Group', status: 'In Progress', priority: 'Critical', date: 'Today 3:00 PM' },
    { title: 'Review Cedar Health support workflow', status: 'Review', priority: 'High', date: 'Tomorrow 10:30 AM' },
    { title: 'Update onboarding checklist for Atlas', status: 'To Do', priority: 'Medium', date: 'Aug 02, 2026' },
  ],
  meetings: [
    { title: 'Northstar executive alignment', status: 'Upcoming', priority: 'High', date: 'Today 11:00 AM' },
    { title: 'Evergreen monthly business review', status: 'Completed', priority: 'Medium', date: 'Yesterday 2:00 PM' },
    { title: 'Cedar retention plan', status: 'Cancelled', priority: 'Critical', date: 'Rescheduling' },
  ],
  projects: [
    { title: 'Atlas CRM workspace launch', status: '62%', priority: 'High', date: 'Deadline Sep 12' },
    { title: 'Evergreen reporting migration', status: '84%', priority: 'Medium', date: 'Deadline Aug 28' },
    { title: 'BluePeak sales pipeline redesign', status: '41%', priority: 'High', date: 'Deadline Oct 03' },
  ],
};

export const pipelineStages = ['New', 'Contacted', 'Qualified', 'Proposal', 'Negotiation', 'Won', 'Lost'];

export const reports = [
  'Daily Sales Activity',
  'Weekly Pipeline Movement',
  'Monthly Revenue Forecast',
  'Yearly Growth Summary',
  'Lead Source Performance',
  'Client Retention Report',
  'Project Delivery Report',
  'Task Completion Report',
  'Meeting Outcomes Report',
];

export const analyticsCards = [
  { label: 'Lead conversion', value: '28.7%', trend: '+4.3%' },
  { label: 'Sales growth', value: '$1.82M', trend: '+21.8%' },
  { label: 'Project progress', value: '71%', trend: '+8.0%' },
  { label: 'Team performance', value: '93/100', trend: '+5 pts' },
];

export const adminModules = [
  { title: 'Team Management', icon: UsersRound, text: 'Members, departments, designations, invitations, organization chart, and member activity.' },
  { title: 'Roles & Permissions', icon: ShieldCheck, text: 'Owner, Admin, Manager, Sales, Support, Marketing, Employee, Viewer, custom roles, and matrix assignment.' },
  { title: 'Admin Panel', icon: Settings, text: 'Users, companies, organizations, health, logs, usage, features, plans, billing, tickets, feedback, announcements, and maintenance mode.' },
  { title: 'Files & Storage', icon: FolderOpen, text: 'File manager, folders, grid view, recent files, shared files, trash, upload, preview, and storage usage.' },
  { title: 'Invoices', icon: Receipt, text: 'Invoice dashboard, list, details, create/edit, preview, quotation, estimate, and PDF preview.' },
  { title: 'Payments', icon: CreditCard, text: 'Transactions, payment history, refunds, billing history, and payment methods.' },
  { title: 'Subscriptions', icon: WalletCards, text: 'Pricing, current plan, upgrade, downgrade, renewal, invoices, and usage limits.' },
  { title: 'Email Module', icon: Inbox, text: 'Inbox, compose, templates, sent, drafts, trash, and email preview.' },
  { title: 'WhatsApp Module', icon: MessageCircle, text: 'Chat list, conversation UI, contacts, templates, broadcast, and media gallery.' },
  { title: 'Marketing', icon: Mail, text: 'Campaign dashboards, campaign lists, details, email/WhatsApp campaigns, landing pages, and analytics.' },
  { title: 'AI Assistant', icon: Bot, text: 'AI dashboard, chat, prompt library, history, suggestions, summaries, email generator, and proposal generator.' },
  { title: 'Security', icon: LockKeyhole, text: 'Login history, sessions, devices, audit logs, API keys, access tokens, 2FA setup, and security activity.' },
  { title: 'Help Center', icon: LifeBuoy, text: 'Documentation, FAQs, support tickets, contact support, and release notes.' },
];

export const integrations = ['Supabase', 'Firebase', 'OpenAI', 'Gemini', 'Claude', 'Google', 'Google Calendar', 'Google Drive', 'Gmail', 'Google Maps', 'Meta', 'WhatsApp Business', 'Facebook', 'Instagram', 'Stripe', 'Razorpay', 'Twilio', 'SMTP', 'Slack', 'Zapier', 'Webhooks'];

export const finalTools = [
  { title: 'Command Palette', icon: Search, text: 'Keyboard-first navigation with recent actions, shortcuts, and quick create placeholders.' },
  { title: 'Global Search', icon: Cloud, text: 'Search across future CRM entities with loading, empty, offline, and permission-denied states.' },
  { title: 'Keyboard Shortcuts', icon: Code2, text: 'Accessible shortcut reference for navigation, creation, filtering, and command execution.' },
  { title: 'Quick Actions', icon: Sparkles, text: 'Create records, schedule actions, export data, and open support from one interface.' },
  { title: 'Feedback Dialog', icon: HeartHandshake, text: 'Collect product feedback and support context without wiring a backend.' },
  { title: 'About & Changelog', icon: FileText, text: 'Version, release notes, product ownership, and frontend completion notes.' },
];


export const tableFeatures = ['Search', 'Sorting', 'Filtering', 'Pagination', 'Bulk selection', 'Column visibility', 'Responsive layout', 'Loading', 'Empty state', 'Error state'];
export const workspaceNav = ['Dashboard', 'Leads', 'Clients', 'Tasks', 'Calendar', 'Meetings', 'Projects', 'Pipeline', 'Reports', 'Analytics'];
