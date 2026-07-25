'use client';

import { motion } from 'framer-motion';
import {
  AlertCircle,
  Archive,
  ArrowDownUp,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Columns3,
  Download,
  Edit3,
  Filter,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
  Upload,
} from 'lucide-react';
import {
  activities,
  adminModules,
  analyticsCards,
  clients,
  finalTools,
  integrations,
  kpis,
  leads,
  pipelineStages,
  productivity,
  reports,
  tableFeatures,
  type WorkItem,
} from '@/lib/workspace-data';

const fade = { initial: { opacity: 0, y: 18 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.45 } };

type WorkspaceKind = 'dashboard' | 'leads' | 'clients' | 'productivity' | 'pipeline' | 'reports' | 'analytics' | 'admin' | 'integrations' | 'final';

export function WorkspacePage({ kind, title, subtitle }: { kind: WorkspaceKind; title: string; subtitle: string }) {
  return (
    <main className="premium-grid min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <motion.section {...fade} className="mx-auto max-w-7xl space-y-6">
        <WorkspaceHeader title={title} subtitle={subtitle} />
        {kind === 'dashboard' && <DashboardWorkspace />}
        {kind === 'leads' && <EntityWorkspace type="lead" items={leads} />}
        {kind === 'clients' && <EntityWorkspace type="client" items={clients} />}
        {kind === 'productivity' && <ProductivityWorkspace />}
        {kind === 'pipeline' && <PipelineWorkspace />}
        {kind === 'reports' && <ReportsWorkspace />}
        {kind === 'analytics' && <AnalyticsWorkspace />}
        {kind === 'admin' && <AdminWorkspace />}
        {kind === 'integrations' && <IntegrationsWorkspace />}
        {kind === 'final' && <FinalWorkspace />}
        <ApplicationStates />
      </motion.section>
    </main>
  );
}

function WorkspaceHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <section className="glass rounded-[2rem] p-5 sm:p-7">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.24em] text-gold">Alpha Weber CRM Workspace</p>
          <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">{title}</h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-white/60 sm:text-base">{subtitle}</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <button className="rounded-2xl bg-aqua px-5 py-3 font-bold text-obsidian shadow-glow"><Plus className="mr-2 inline" size={18} />Create</button>
          <button className="rounded-2xl border border-white/15 px-5 py-3 font-bold text-white"><Download className="mr-2 inline" size={18} />Export</button>
        </div>
      </div>
      <SearchToolbar />
    </section>
  );
}

function SearchToolbar() {
  return (
    <div className="mt-6 grid gap-3 lg:grid-cols-[1fr_auto]">
      <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
        <Search className="text-aqua" size={18} />
        <input className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-white/35" placeholder="Search companies, contacts, statuses, owners, tags..." />
      </label>
      <div className="grid grid-cols-2 gap-3 sm:flex">
        {['Advanced filters', 'Sort', 'Columns', 'Bulk actions'].map((item, index) => (
          <button key={item} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70">
            {index === 0 && <Filter className="mr-2 inline" size={16} />}
            {index === 1 && <ArrowDownUp className="mr-2 inline" size={16} />}
            {index === 2 && <Columns3 className="mr-2 inline" size={16} />}
            {index === 3 && <Archive className="mr-2 inline" size={16} />}
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}

function DashboardWorkspace() {
  return (
    <>
      <KpiGrid />
      <div className="grid gap-5 xl:grid-cols-[1.1fr_.9fr]">
        <ChartCard title="Monthly performance" />
        <PipelineWorkspace compact />
      </div>
      <div className="grid gap-5 lg:grid-cols-3">
        <ActivityPanel title="Recent activities" items={activities} />
        <MiniList title="Recent leads" items={leads} />
        <MiniList title="Recent clients" items={clients} />
      </div>
      <div className="grid gap-5 lg:grid-cols-3">
        <ScheduleCard title="Upcoming tasks" items={productivity.tasks} />
        <ScheduleCard title="Upcoming meetings" items={productivity.meetings} />
        <CalendarPreview />
      </div>
    </>
  );
}

function KpiGrid() {
  return <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">{kpis.map((kpi, index) => { const Icon = kpi.icon; return <motion.article {...fade} transition={{ duration: .45, delay: index * .04 }} whileHover={{ y: -4 }} className="glass rounded-3xl p-5" key={kpi.label}><Icon className="mb-4 text-aqua" /><p className="text-xs uppercase tracking-[.18em] text-white/40">{kpi.label}</p><div className="mt-3 flex items-end justify-between"><strong className="text-2xl font-black">{kpi.value}</strong><span className="rounded-full bg-aqua/10 px-2 py-1 text-xs text-aqua">{kpi.delta}</span></div></motion.article> })}</div>;
}

function EntityWorkspace({ type, items }: { type: 'lead' | 'client'; items: WorkItem[] }) {
  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_22rem]">
      <section className="space-y-5">
        <BulkActionToolbar />
        <CrmTable items={items} type={type} />
        <div className="grid gap-5 lg:grid-cols-2">
          <Timeline title={`${type === 'lead' ? 'Lead' : 'Client'} timeline`} />
          <InformationCard type={type} />
        </div>
      </section>
      <ProfileSidebar item={items[0]} type={type} />
    </div>
  );
}

function CrmTable({ items, type }: { items: WorkItem[]; type: 'lead' | 'client' }) {
  return (
    <section className="glass overflow-hidden rounded-[2rem]">
      <div className="flex flex-col gap-3 border-b border-white/10 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div><h2 className="text-xl font-black">{type === 'lead' ? 'Lead list' : 'Client list'}</h2><p className="text-sm text-white/50">Search, sort, filter, paginate, select rows, hide columns, import, export, and handle loading/error/empty states.</p></div>
        <div className="flex gap-2"><button className="rounded-xl bg-white/8 p-3"><Upload size={17} /></button><button className="rounded-xl bg-white/8 p-3"><Download size={17} /></button></div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-white/[.04] text-xs uppercase tracking-[.18em] text-white/40"><tr><th className="p-4"><input type="checkbox" aria-label="Select all" /></th><th className="p-4">Record</th><th className="p-4">Owner</th><th className="p-4">Status</th><th className="p-4">Priority</th><th className="p-4">Value</th><th className="p-4">Next date</th><th className="p-4">Actions</th></tr></thead>
          <tbody>{items.map((item) => <tr key={item.id} className="border-t border-white/10 transition hover:bg-white/[.04]"><td className="p-4"><input type="checkbox" aria-label={`Select ${item.id}`} /></td><td className="p-4"><p className="font-bold">{item.company}</p><p className="text-white/45">{item.title}</p><div className="mt-2 flex flex-wrap gap-1">{item.tags.map((tag) => <span key={tag} className="rounded-full bg-white/8 px-2 py-1 text-[11px] text-white/55">{tag}</span>)}</div></td><td className="p-4">{item.owner}</td><td className="p-4"><StatusBadge label={item.status} /></td><td className="p-4"><PriorityBadge priority={item.priority} /></td><td className="p-4 font-bold text-gold">{item.value}</td><td className="p-4">{item.date}</td><td className="p-4"><ActionMenu /></td></tr>)}</tbody>
        </table>
      </div>
      <div className="flex flex-col gap-3 border-t border-white/10 p-4 text-sm text-white/55 sm:flex-row sm:items-center sm:justify-between"><span>Showing 1-{items.length} of {items.length} records</span><div className="flex gap-2"><button className="rounded-xl bg-white/8 px-3 py-2">Previous</button><button className="rounded-xl bg-aqua px-3 py-2 text-obsidian">1</button><button className="rounded-xl bg-white/8 px-3 py-2">Next</button></div></div>
    </section>
  );
}

function StatusBadge({ label }: { label: string }) { return <span className="rounded-full bg-aqua/10 px-3 py-1 text-xs font-bold text-aqua">{label}</span>; }
function PriorityBadge({ priority }: { priority: WorkItem['priority'] }) { const tone = priority === 'Critical' ? 'bg-red-400/15 text-red-200' : priority === 'High' ? 'bg-gold/15 text-gold' : 'bg-white/10 text-white/65'; return <span className={`rounded-full px-3 py-1 text-xs font-bold ${tone}`}>{priority}</span>; }
function ActionMenu() { return <div className="flex gap-2"><button className="rounded-lg bg-white/8 p-2" aria-label="Edit"><Edit3 size={15} /></button><button className="rounded-lg bg-red-400/10 p-2 text-red-200" aria-label="Delete"><Trash2 size={15} /></button><button className="rounded-lg bg-white/8 p-2" aria-label="More"><MoreHorizontal size={15} /></button></div>; }
function BulkActionToolbar() { return <div className="glass flex flex-col gap-3 rounded-[2rem] p-4 sm:flex-row sm:items-center sm:justify-between"><p className="text-sm text-white/60">Bulk action toolbar: assign owner, update status, apply tags, import CSV, export selected, and delete confirmation modal.</p><button className="rounded-2xl bg-white/8 px-4 py-3 text-sm">Open confirmation modal</button></div>; }
function ProfileSidebar({ item, type }: { item: WorkItem; type: 'lead' | 'client' }) { return <aside className="glass h-fit rounded-[2rem] p-5"><div className="mb-5 grid size-16 place-items-center rounded-2xl bg-gold text-xl font-black text-obsidian">{item.company.slice(0, 2).toUpperCase()}</div><h2 className="text-2xl font-black">{item.company}</h2><p className="text-sm text-white/55">{item.title}</p><div className="mt-5 space-y-3">{['Company information', 'Contact person', 'Phone', 'Email', 'Address', 'Industry', 'Notes', 'Attachments', type === 'lead' ? 'Follow-up section' : 'Payments and invoices summary'].map((row) => <div key={row} className="rounded-2xl bg-white/8 p-3 text-sm text-white/65">{row}</div>)}</div></aside>; }
function InformationCard({ type }: { type: 'lead' | 'client' }) { return <section className="glass rounded-[2rem] p-5"><h2 className="text-xl font-black">{type === 'lead' ? 'Lead details' : 'Client details'}</h2><div className="mt-4 grid gap-3 sm:grid-cols-2">{['Source', 'Score', 'Owner', 'Tags', 'Notes', 'Activity history', 'Documents', 'Communication history'].map((x) => <div className="rounded-2xl bg-white/8 p-4 text-sm text-white/60" key={x}>{x} ready for future API data.</div>)}</div></section>; }
function Timeline({ title }: { title: string }) { return <section className="glass rounded-[2rem] p-5"><h2 className="text-xl font-black">{title}</h2><div className="mt-4 space-y-4">{activities.map((activity, index) => <div key={activity} className="flex gap-3"><span className="mt-1 size-3 rounded-full bg-aqua" /><p className="text-sm text-white/65"><strong className="text-white">Step {index + 1}:</strong> {activity}</p></div>)}</div></section>; }

function ProductivityWorkspace() { return <div className="grid gap-5 xl:grid-cols-3"><ModuleBoard title="Task management" items={productivity.tasks} details={['Checklist', 'Attachments', 'Comments', 'Activity timeline', 'Assign members', 'Due dates']} /><ModuleBoard title="Calendar and agenda" items={productivity.meetings} details={['Monthly calendar', 'Weekly calendar', 'Daily calendar', 'Agenda view', 'Reminder UI', 'Recurring event UI', 'Drag-and-drop placeholder']} /><ModuleBoard title="Project management" items={productivity.projects} details={['Milestones', 'Progress tracking', 'Assigned members', 'Deadlines', 'Files', 'Kanban and list views']} /></div>; }
function ModuleBoard({ title, items, details }: { title: string; items: { title: string; status: string; priority: string; date: string }[]; details: string[] }) { return <section className="glass rounded-[2rem] p-5"><h2 className="text-xl font-black">{title}</h2><div className="mt-4 space-y-3">{items.map((item) => <article className="rounded-3xl bg-white/8 p-4 transition hover:bg-white/10" key={item.title}><div className="flex items-start justify-between gap-3"><h3 className="font-bold">{item.title}</h3><StatusBadge label={item.status} /></div><p className="mt-2 text-sm text-white/50">{item.date}</p><PriorityBadge priority={item.priority as WorkItem['priority']} /></article>)}</div><div className="mt-4 flex flex-wrap gap-2">{details.map((detail) => <span className="rounded-full bg-white/8 px-3 py-2 text-xs text-white/55" key={detail}>{detail}</span>)}</div></section>; }

function PipelineWorkspace({ compact = false }: { compact?: boolean }) { return <section className="glass rounded-[2rem] p-5"><h2 className="text-xl font-black">Sales pipeline overview</h2><p className="mt-1 text-sm text-white/50">Kanban pipeline with drag-and-drop placeholder, expected revenue, probability, priority, tags, activities, and timeline.</p><div className={`mt-5 grid gap-3 ${compact ? 'md:grid-cols-2' : 'xl:grid-cols-7'}`}>{pipelineStages.map((stage, index) => <div key={stage} className="min-h-44 rounded-3xl bg-white/8 p-3"><div className="mb-3 flex items-center justify-between"><h3 className="font-bold">{stage}</h3><span className="text-xs text-aqua">{index + 2}</span></div>{leads.slice(0, compact ? 1 : 2).map((lead) => <article key={`${stage}-${lead.id}`} className="mb-3 rounded-2xl bg-black/20 p-3"><p className="text-sm font-bold">{lead.company}</p><p className="text-xs text-white/45">{lead.value} · {Math.max(15, 90 - index * 10)}%</p></article>)}</div>)}</div></section>; }
function ReportsWorkspace() { return <div className="grid gap-5 lg:grid-cols-3">{reports.map((report) => <article className="glass rounded-3xl p-5" key={report}><FileHeader title={report} /><p className="mt-3 text-sm text-white/55">Export report UI, print report UI, filters, date ranges, comparison cards, and future API bindings are prepared.</p></article>)}</div>; }
function AnalyticsWorkspace() { return <><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{analyticsCards.map((card) => <article className="glass rounded-3xl p-5" key={card.label}><p className="text-sm text-white/50">{card.label}</p><strong className="mt-3 block text-3xl font-black">{card.value}</strong><span className="text-aqua">{card.trend}</span></article>)}</div><div className="grid gap-5 lg:grid-cols-2"><ChartCard title="Revenue and sales growth" /><ChartCard title="Lead conversion and client growth" /><ChartCard title="Task and project progress" /><ChartCard title="Team performance and top performers" /></div></>; }
function AdminWorkspace() { return <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{adminModules.map((module) => { const Icon = module.icon; return <article className="glass rounded-3xl p-5" key={module.title}><Icon className="mb-4 text-aqua" /><h2 className="text-xl font-black">{module.title}</h2><p className="mt-3 text-sm leading-6 text-white/55">{module.text}</p></article>; })}</div>; }
function IntegrationsWorkspace() { return <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{integrations.map((name) => <article className="glass rounded-3xl p-5" key={name}><div className="flex items-center justify-between"><h2 className="text-lg font-black">{name}</h2><span className="rounded-full bg-gold/15 px-3 py-1 text-xs text-gold">Not connected</span></div><div className="mt-4 space-y-2 text-sm text-white/55"><p>Overview and documentation section.</p><p>API key form, configuration screen, test connection UI, and logs.</p></div></article>)}</div>; }
function FinalWorkspace() { return <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{finalTools.map((tool) => { const Icon = tool.icon; return <article className="glass rounded-3xl p-5" key={tool.title}><Icon className="mb-4 text-aqua" /><h2 className="text-xl font-black">{tool.title}</h2><p className="mt-3 text-sm leading-6 text-white/55">{tool.text}</p></article>; })}</div>; }

function ChartCard({ title }: { title: string }) { return <section className="glass rounded-[2rem] p-5"><h2 className="text-xl font-black">{title}</h2><div className="mt-5 flex h-52 items-end gap-3 rounded-3xl bg-white/5 p-4">{[46, 72, 55, 88, 64, 93, 78, 84].map((height, index) => <motion.div initial={{ height: 0 }} animate={{ height: `${height}%` }} transition={{ duration: .7, delay: index * .04 }} key={index} className="flex-1 rounded-t-2xl bg-gradient-to-t from-aqua/40 to-gold/80" />)}</div></section>; }
function ActivityPanel({ title, items }: { title: string; items: string[] }) { return <section className="glass rounded-[2rem] p-5"><h2 className="text-xl font-black">{title}</h2><div className="mt-4 space-y-3">{items.map((item) => <p key={item} className="rounded-2xl bg-white/8 p-4 text-sm text-white/60">{item}</p>)}</div></section>; }
function MiniList({ title, items }: { title: string; items: WorkItem[] }) { return <section className="glass rounded-[2rem] p-5"><h2 className="text-xl font-black">{title}</h2><div className="mt-4 space-y-3">{items.map((item) => <article key={item.id} className="rounded-2xl bg-white/8 p-4"><p className="font-bold">{item.company}</p><p className="text-sm text-white/50">{item.status} · {item.value}</p></article>)}</div></section>; }
function ScheduleCard({ title, items }: { title: string; items: { title: string; status: string; priority: string; date: string }[] }) { return <section className="glass rounded-[2rem] p-5"><h2 className="text-xl font-black">{title}</h2><div className="mt-4 space-y-3">{items.map((item) => <article key={item.title} className="rounded-2xl bg-white/8 p-4"><p className="font-bold">{item.title}</p><p className="text-sm text-white/50">{item.date}</p></article>)}</div></section>; }
function CalendarPreview() { return <section className="glass rounded-[2rem] p-5"><h2 className="flex items-center gap-2 text-xl font-black"><CalendarDays className="text-aqua" />Calendar preview</h2><div className="mt-4 grid grid-cols-7 gap-2 text-center text-xs">{Array.from({ length: 35 }).map((_, i) => <span key={i} className={`rounded-xl p-2 ${[3, 8, 15, 21].includes(i) ? 'bg-aqua text-obsidian' : 'bg-white/8 text-white/55'}`}>{i + 1}</span>)}</div></section>; }
function FileHeader({ title }: { title: string }) { return <div className="flex items-start justify-between gap-3"><h2 className="text-lg font-black">{title}</h2><button className="rounded-xl bg-white/8 p-2"><ChevronDown size={16} /></button></div>; }
function ApplicationStates() { return <section className="glass rounded-[2rem] p-5"><h2 className="text-xl font-black">Application states</h2><div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">{['Loading skeleton', 'Empty state', 'Success state', 'Error state', 'Offline', 'Permission denied'].map((state, index) => <div key={state} className="rounded-2xl bg-white/8 p-4 text-sm text-white/60">{index === 0 && <span className="mb-3 block h-3 w-20 animate-pulse rounded-full bg-white/20" />}{index === 2 && <CheckCircle2 className="mb-2 text-aqua" />}{index === 3 && <AlertCircle className="mb-2 text-red-200" />}{state}</div>)}</div><div className="mt-4 flex flex-wrap gap-2">{tableFeatures.map((feature) => <span key={feature} className="rounded-full bg-white/8 px-3 py-2 text-xs text-white/50">{feature}</span>)}</div></section>; }
