'use client';

import { type FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Bell, ChevronLeft, ChevronRight, Home, Loader2, LogOut, MessageSquareText, Plus, Search, Settings, Shield, Trash2, UsersRound } from 'lucide-react';
import type { Session } from '@supabase/supabase-js';
import { modules, nav, pipeline, roadmap } from '@/lib/data';
import { emptyLeadInput, leadStatuses, normalizeLeadInput, statusLabels, validateLeadInput, type LeadInput, type LeadWithLatestNote } from '@/lib/leads';
import { isSupabaseConfigured, supabase } from '@/lib/integrations/supabase';
import type { ActivityType, LeadStatus } from '@/lib/supabase/database.types';

const fade = { initial: { opacity: 0, y: 22 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.65 } };
const pageSize = 10;

type Notice = { type: 'success' | 'error'; message: string } | null;
type SortKey = 'created_at' | 'updated_at' | 'name' | 'business_name' | 'status';
type SortDirection = 'asc' | 'desc';
type Activity = { id: string; description: string; type: ActivityType; created_at: string };
type Notification = { id: string; title: string; message: string; read_at: string | null; created_at: string };

export function AppShell() {
  const [session, setSession] = useState<Session | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [notice, setNotice] = useState<Notice>(null);

  useEffect(() => {
    if (!supabase) {
      setAuthLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data, error }) => {
      if (error) setNotice({ type: 'error', message: error.message });
      setSession(data.session);
      setAuthLoading(false);
    });

    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setAuthLoading(false);
    });

    return () => data.subscription.unsubscribe();
  }, []);

  async function handleLogout() {
    if (!supabase) return;
    const { error } = await supabase.auth.signOut();
    setNotice(error ? { type: 'error', message: error.message } : { type: 'success', message: 'Logged out successfully.' });
  }

  if (authLoading) return <main className="premium-grid grid min-h-screen place-items-center"><Loader2 className="animate-spin text-aqua" size={36} aria-label="Loading dashboard" /></main>;
  if (!session) return <LoginScreen notice={notice} setNotice={setNotice} />;

  return <ProtectedCrm session={session} notice={notice} setNotice={setNotice} onLogout={handleLogout} />;
}

function LoginScreen({ notice, setNotice }: { notice: Notice; setNotice: (notice: Notice) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice(null);
    if (!supabase || !isSupabaseConfigured) {
      setNotice({ type: 'error', message: 'Supabase is not configured. Add the required environment variables.' });
      return;
    }
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim().toLowerCase(), password });
    if (!error && data.user) {
      await supabase.from('activities').insert({ actor_id: data.user.id, type: 'login', description: 'Admin signed in.' });
    }
    setLoading(false);
    setNotice(error ? { type: 'error', message: error.message } : { type: 'success', message: 'Welcome back.' });
  }

  return <main className="premium-grid min-h-screen flex items-center justify-center bg-background px-5">
    <section className="premium-card max-w-md w-full shadow-2xl glass" aria-labelledby="login-heading">
      <div className="text-center space-y-4">
        <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-gold text-obsidian font-black">AW</div>
        <h1 id="login-heading" className="text-4xl font-bold text-gradient">Admin Login</h1>
        <p className="text-slate-400">Sign in to access the protected CRM dashboard.</p>
      </div>
      <form onSubmit={handleLogin} className="mt-8 space-y-4" noValidate>
        <label className="sr-only" htmlFor="admin-email">Admin email</label>
        <input id="admin-email" className="field" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Admin email" autoComplete="email" required />
        <label className="sr-only" htmlFor="admin-password">Password</label>
        <input id="admin-password" className="field" type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Password" autoComplete="current-password" required />
        <button className="w-full rounded-2xl bg-aqua px-6 py-4 font-bold text-obsidian shadow-glow disabled:opacity-60" disabled={loading} type="submit">{loading ? 'Signing in...' : 'Login'}</button>
      </form>
      <NoticeBanner notice={notice} inline />
    </section>
  </main>;
}

function ProtectedCrm({ session, notice, setNotice, onLogout }: { session: Session; notice: Notice; setNotice: (notice: Notice) => void; onLogout: () => void }) {
  const [leads, setLeads] = useState<LeadWithLatestNote[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshData = useCallback(async (showLoader = true) => {
    if (!supabase) return;
    if (showLoader) setLoading(true);
    const [leadResult, activityResult, notificationResult] = await Promise.all([
      supabase.from('leads').select('*, lead_notes(id, body, created_at)').order('created_at', { ascending: false }).order('created_at', { foreignTable: 'lead_notes', ascending: false }),
      supabase.from('activities').select('id, description, type, created_at').order('created_at', { ascending: false }).limit(8),
      supabase.from('notifications').select('id, title, message, read_at, created_at').order('created_at', { ascending: false }).limit(6),
    ]);

    if (leadResult.error) setNotice({ type: 'error', message: leadResult.error.message });
    else setLeads((leadResult.data ?? []) as unknown as LeadWithLatestNote[]);
    if (!activityResult.error) setActivities((activityResult.data ?? []) as Activity[]);
    if (!notificationResult.error) setNotifications((notificationResult.data ?? []) as Notification[]);
    setLoading(false);
  }, [setNotice]);

  useEffect(() => {
    void refreshData();
    if (!supabase) return undefined;
    const client = supabase;
    const channel = client.channel('crm-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'leads' }, () => void refreshData(false))
      .on('postgres_changes', { event: '*', schema: 'public', table: 'lead_notes' }, () => void refreshData(false))
      .on('postgres_changes', { event: '*', schema: 'public', table: 'activities' }, () => void refreshData(false))
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notifications' }, () => void refreshData(false))
      .subscribe();
    return () => { void client.removeChannel(channel); };
  }, [refreshData]);

  async function recordActivity(type: ActivityType, description: string, leadId?: string) {
    if (!supabase) return;
    await supabase.from('activities').insert({ actor_id: session.user.id, lead_id: leadId ?? null, type, description });
  }

  return <main className="premium-grid min-h-screen overflow-hidden pb-24 lg:pb-0">
    <DesktopSidebar onLogout={onLogout} />
    <section className="lg:pl-72">
      <Hero userEmail={session.user.email ?? 'Admin'} leads={leads} />
      <Dashboard leads={leads} loading={loading} />
      <LeadsManager session={session} leads={leads} loading={loading} setNotice={setNotice} refreshData={refreshData} recordActivity={recordActivity} />
      <CrmActivity activities={activities} notifications={notifications} />
      <Modules />
      <Operations leads={leads} />
      <Future />
    </section>
    <NoticeBanner notice={notice} />
    <MobileNav onLogout={onLogout} />
  </main>;
}

function DesktopSidebar({ onLogout }: { onLogout: () => void }) { return <aside className="fixed left-6 top-6 z-40 hidden h-[calc(100vh-3rem)] w-60 rounded-[2rem] glass p-5 lg:block">
  <div className="mb-8 flex items-center gap-3"><div className="grid size-11 place-items-center rounded-2xl bg-gold text-obsidian font-black">AW</div><div><p className="font-semibold">Alpha Weber</p><p className="text-xs text-white/50">Growth OS</p></div></div>
  <nav className="space-y-2">{nav.map((item, i)=><a key={item} className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition hover:bg-white/10 ${i===0?'bg-white/[.12] text-aqua':'text-white/[.68]'}`} href={`#${item.toLowerCase()}`}>{i===0?<Home size={17}/>:i===1?<UsersRound size={17}/>:i===3?<MessageSquareText size={17}/>:<BarChart3 size={17}/>} {item}</a>)}</nav>
  <button onClick={onLogout} className="mt-4 flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm text-white/[.68] transition hover:bg-white/10"><LogOut size={17}/> Logout</button>
  <div className="absolute bottom-5 left-5 right-5 rounded-3xl bg-white/[.08] p-4"><Shield className="mb-3 text-aqua"/><p className="text-sm font-semibold">Enterprise-ready</p><p className="text-xs text-white/50">RBAC, RLS, modular data boundaries, and scalable Supabase integrations.</p></div>
</aside>; }

function Hero({ userEmail, leads }: { userEmail: string; leads: LeadWithLatestNote[] }) { return <section className="mx-auto max-w-7xl px-4 pb-8 pt-5 sm:px-6 lg:px-8 lg:pt-8"><motion.div {...fade} className="glass rounded-[2rem] p-5 sm:p-8 lg:p-10">
  <div className="mb-8 flex items-center justify-between"><div className="rounded-full border border-aqua/30 bg-aqua/10 px-4 py-2 text-xs font-semibold text-aqua">Protected Admin Dashboard</div><span className="hidden text-sm text-white/55 sm:block">{userEmail}</span></div>
  <div className="grid gap-8 lg:grid-cols-[1.1fr_.9fr] lg:items-center"><div><h1 className="text-4xl font-black tracking-tight sm:text-6xl lg:text-7xl">Alpha Weber CRM is your complete <span className="text-aqua">Business Growth OS</span>.</h1><p className="mt-5 max-w-2xl text-base leading-8 text-white/[.68] sm:text-lg">A premium dark, touch-optimized operating system for authentication, leads, client conversations, pipeline analytics, admin reporting, and business operations.</p><div className="mt-7 flex flex-col gap-3 sm:flex-row"><a href="#leads" className="rounded-2xl bg-aqua px-6 py-4 text-center font-bold text-obsidian shadow-glow">Manage Leads</a><a href="#analytics" className="rounded-2xl border border-white/15 px-6 py-4 text-center font-bold text-white">View Analytics</a></div></div><PhonePreview leads={leads} /></div>
</motion.div></section>; }

function PhonePreview({ leads }: { leads: LeadWithLatestNote[] }){ const topStatuses = leadStatuses.slice(0,3); return <motion.div initial={{opacity:0, scale:.94, rotate:2}} animate={{opacity:1, scale:1, rotate:0}} transition={{duration:.8}} className="mx-auto w-full max-w-sm rounded-[2.5rem] border border-white/15 bg-black p-3 shadow-2xl"><div className="rounded-[2rem] bg-panel p-4"><div className="mb-5 flex items-center justify-between"><span className="text-xs text-white/50">Today</span><span className="rounded-full bg-gold/20 px-3 py-1 text-xs text-gold">Live</span></div><p className="text-2xl font-black">{leads.length}</p><p className="text-sm text-white/50">Total active CRM leads</p><div className="mt-5 h-32 rounded-3xl bg-gradient-to-br from-aqua/30 to-gold/20 p-4"><div className="flex h-full items-end gap-2">{leadStatuses.map((status)=><div key={status} className="flex-1 rounded-t-xl bg-white/70" style={{height:`${Math.max(12, leads.filter((lead)=>lead.status===status).length / Math.max(1, leads.length) * 100)}%`}} />)}</div></div><div className="mt-4 space-y-3">{topStatuses.map((status)=><div key={status} className="flex items-center justify-between rounded-2xl bg-white/[.08] p-3"><span className="text-sm">{statusLabels[status]}</span><span className="text-aqua">{leads.filter((lead)=>lead.status===status).length}</span></div>)}</div></div></motion.div>; }

function Dashboard({ leads, loading }: { leads: LeadWithLatestNote[]; loading: boolean }){
  const dashboardMetrics = [
    { label: 'Total Leads', value: String(leads.length), delta: 'Live' },
    { label: 'Qualified', value: String(leads.filter((lead) => lead.status === 'qualified').length), delta: 'Supabase' },
    { label: 'Meetings', value: String(leads.filter((lead) => lead.status === 'meeting').length), delta: 'Pipeline' },
    { label: 'Proposals', value: String(leads.filter((lead) => lead.status === 'proposal').length), delta: 'Pipeline' },
    { label: 'Won', value: String(leads.filter((lead) => lead.status === 'won').length), delta: 'Revenue' },
    { label: 'Lost', value: String(leads.filter((lead) => lead.status === 'lost').length), delta: 'Archive' },
  ];
  return <section id="dashboard" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{dashboardMetrics.map((m,i)=><motion.div {...fade} transition={{...fade.transition, delay:i*.05}} key={m.label} className="glass rounded-3xl p-5"><p className="text-sm text-white/55">{m.label}</p><div className="mt-3 flex items-end justify-between"><h3 className="text-3xl font-black">{loading ? <Loader2 className="animate-spin" /> : m.value}</h3><span className="rounded-full bg-aqua/10 px-3 py-1 text-xs text-aqua">{m.delta}</span></div></motion.div>)}</div></section>;
}

function LeadsManager({ session, leads, loading, setNotice, refreshData, recordActivity }: { session: Session; leads: LeadWithLatestNote[]; loading: boolean; setNotice: (notice: Notice) => void; refreshData: (showLoader?: boolean) => Promise<void>; recordActivity: (type: ActivityType, description: string, leadId?: string) => Promise<void> }) {
  const [form, setForm] = useState<LeadInput>(emptyLeadInput);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<'all' | LeadStatus>('all');
  const [sortKey, setSortKey] = useState<SortKey>('created_at');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [page, setPage] = useState(1);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof LeadInput, string>>>({});

  const filteredLeads = useMemo(() => leads.filter((lead) => {
    const latestNote = lead.lead_notes?.[0]?.body ?? '';
    const term = search.toLowerCase().trim();
    return (status === 'all' || lead.status === status) && (!term || [lead.name, lead.phone, lead.business_name, lead.email, latestNote].some((value) => value.toLowerCase().includes(term)));
  }).sort((a, b) => {
    const aValue = String(a[sortKey]);
    const bValue = String(b[sortKey]);
    return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
  }), [leads, search, status, sortDirection, sortKey]);
  const pageCount = Math.max(1, Math.ceil(filteredLeads.length / pageSize));
  const visibleLeads = filteredLeads.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => setPage(1), [search, status, sortKey, sortDirection]);

  async function saveLead(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase) return;
    const payload = normalizeLeadInput(form);
    const nextErrors = validateLeadInput(payload);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSaving(true);
    const leadPayload = { owner_id: session.user.id, name: payload.name, phone: payload.phone, business_name: payload.business_name, email: payload.email, status: payload.status };
    const result = editingId
      ? await supabase.from('leads').update(leadPayload).eq('id', editingId).select('id').single()
      : await supabase.from('leads').insert(leadPayload).select('id').single();

    if (result.error || !result.data) {
      setSaving(false);
      setNotice({ type: 'error', message: result.error?.message ?? 'Unable to save lead.' });
      return;
    }

    if (payload.note) {
      const noteResult = await supabase.from('lead_notes').insert({ lead_id: result.data.id, author_id: session.user.id, body: payload.note });
      if (noteResult.error) setNotice({ type: 'error', message: noteResult.error.message });
    }

    await recordActivity(editingId ? 'lead_updated' : 'lead_created', editingId ? `Updated lead ${payload.name}.` : `Created lead ${payload.name}.`, result.data.id);
    setSaving(false);
    setNotice({ type: 'success', message: editingId ? 'Lead updated.' : 'Lead added.' });
    setForm(emptyLeadInput);
    setEditingId(null);
    await refreshData(false);
  }

  function editLead(lead: LeadWithLatestNote) {
    setEditingId(lead.id);
    setForm({ name: lead.name, phone: lead.phone, business_name: lead.business_name, email: lead.email, status: lead.status, note: '' });
  }

  async function deleteLead(lead: LeadWithLatestNote) {
    if (!supabase || !window.confirm(`Delete ${lead.name}? This cannot be undone.`)) return;
    const { error } = await supabase.from('leads').delete().eq('id', lead.id);
    if (error) {
      setNotice({ type: 'error', message: error.message });
      return;
    }
    await recordActivity('lead_deleted', `Deleted lead ${lead.name}.`);
    setNotice({ type: 'success', message: 'Lead deleted.' });
    await refreshData(false);
  }

  return <section id="leads" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
    <Header eyebrow="Leads" title="Real-time Supabase lead command center." />
    <div className="grid gap-4 xl:grid-cols-[.9fr_1.1fr]">
      <form onSubmit={saveLead} className="glass rounded-[2rem] p-6 space-y-4" noValidate>
        <h3 className="text-xl font-bold">{editingId ? 'Edit Lead' : 'Add Lead'}</h3>
        <LeadField id="lead-name" label="Lead name" error={errors.name}><input id="lead-name" className="field" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Lead name" required /></LeadField>
        <LeadField id="lead-phone" label="Phone" error={errors.phone}><input id="lead-phone" className="field" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} placeholder="Phone" required /></LeadField>
        <LeadField id="lead-business" label="Business name" error={errors.business_name}><input id="lead-business" className="field" value={form.business_name} onChange={(event) => setForm({ ...form, business_name: event.target.value })} placeholder="Business name" required /></LeadField>
        <LeadField id="lead-email" label="Email" error={errors.email}><input id="lead-email" className="field" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="Email" required /></LeadField>
        <LeadField id="lead-status" label="Status" error={errors.status}><select id="lead-status" className="field" value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value as LeadStatus })}>{leadStatuses.map((item) => <option key={item} value={item}>{statusLabels[item]}</option>)}</select></LeadField>
        <LeadField id="lead-note" label="Note"><textarea id="lead-note" className="field min-h-28" value={form.note} onChange={(event) => setForm({ ...form, note: event.target.value })} placeholder="Add a note" /></LeadField>
        <div className="flex flex-wrap gap-3"><button disabled={saving} className="rounded-2xl bg-aqua px-6 py-4 font-bold text-obsidian shadow-glow disabled:opacity-60" type="submit">{saving ? 'Saving...' : editingId ? 'Update Lead' : 'Add Lead'}</button>{editingId ? <button type="button" onClick={() => { setEditingId(null); setForm(emptyLeadInput); setErrors({}); }} className="rounded-2xl border border-white/15 px-6 py-4 font-bold text-white">Cancel</button> : null}</div>
      </form>
      <div className="glass rounded-[2rem] p-6">
        <div className="grid gap-3 md:grid-cols-[1fr_170px_170px_130px]"><div className="relative"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18}/><label className="sr-only" htmlFor="lead-search">Search leads</label><input id="lead-search" className="field pl-11" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search leads" /></div><select className="field" aria-label="Filter by status" value={status} onChange={(event) => setStatus(event.target.value as 'all' | LeadStatus)}><option value="all">All statuses</option>{leadStatuses.map((item) => <option key={item} value={item}>{statusLabels[item]}</option>)}</select><select className="field" aria-label="Sort leads" value={sortKey} onChange={(event) => setSortKey(event.target.value as SortKey)}><option value="created_at">Created</option><option value="updated_at">Updated</option><option value="name">Name</option><option value="business_name">Business</option><option value="status">Status</option></select><button type="button" className="rounded-2xl border border-white/15 px-4 py-3 font-bold" onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}>{sortDirection.toUpperCase()}</button></div>
        <div className="mt-5 space-y-3 max-h-[38rem] overflow-y-auto pr-1 no-scrollbar">{loading ? <div className="grid place-items-center py-16"><Loader2 className="animate-spin text-aqua" /></div> : visibleLeads.length ? visibleLeads.map((lead) => <article key={lead.id} className="rounded-3xl bg-white/[.08] p-4"><div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div><div className="flex flex-wrap items-center gap-2"><h4 className="font-bold">{lead.name}</h4><span className="rounded-full bg-aqua/10 px-3 py-1 text-xs text-aqua">{statusLabels[lead.status]}</span></div><p className="mt-1 text-sm text-white/55">{lead.business_name} · {lead.phone} · {lead.email}</p><p className="mt-3 text-sm leading-6 text-white/65">{lead.lead_notes?.[0]?.body ?? 'No notes yet.'}</p><p className="mt-2 text-xs text-white/40">Updated {new Date(lead.updated_at).toLocaleString()}</p></div><div className="flex gap-2"><button onClick={() => editLead(lead)} className="rounded-2xl border border-white/15 px-4 py-2 text-sm font-bold">Edit</button><button onClick={() => void deleteLead(lead)} className="rounded-2xl bg-red-500/15 px-3 py-2 text-red-200" aria-label={`Delete ${lead.name}`}><Trash2 size={16}/></button></div></div></article>) : <p className="py-16 text-center text-white/50">No leads found.</p>}</div>
        <div className="mt-5 flex items-center justify-between text-sm text-white/60"><span>Page {page} of {pageCount}</span><div className="flex gap-2"><button className="rounded-xl border border-white/15 p-2 disabled:opacity-40" disabled={page === 1} onClick={() => setPage((value) => Math.max(1, value - 1))} aria-label="Previous page"><ChevronLeft size={18}/></button><button className="rounded-xl border border-white/15 p-2 disabled:opacity-40" disabled={page === pageCount} onClick={() => setPage((value) => Math.min(pageCount, value + 1))} aria-label="Next page"><ChevronRight size={18}/></button></div></div>
      </div>
    </div>
  </section>;
}

function LeadField({ id, label, error, children }: { id: string; label: string; error?: string; children: React.ReactNode }) { return <div><label className="sr-only" htmlFor={id}>{label}</label>{children}{error ? <p className="mt-2 text-sm text-red-200">{error}</p> : null}</div>; }
function CrmActivity({ activities, notifications }: { activities: Activity[]; notifications: Notification[] }) { return <section id="admin" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"><div className="grid gap-4 lg:grid-cols-2"><div className="glass rounded-[2rem] p-6"><Header eyebrow="Activity" title="Recent CRM activity." compact/><div className="mt-6 space-y-3">{activities.length ? activities.map((activity)=><div key={activity.id} className="rounded-2xl bg-white/[.08] p-4"><p className="text-sm font-semibold">{activity.description}</p><p className="text-xs text-white/45">{new Date(activity.created_at).toLocaleString()}</p></div>) : <p className="py-8 text-sm text-white/50">Activity will appear after CRM actions.</p>}</div></div><div className="glass rounded-[2rem] p-6"><Header eyebrow="Notifications" title="Admin notifications." compact/><div className="mt-6 space-y-3">{notifications.length ? notifications.map((notification)=><div key={notification.id} className="flex gap-3 rounded-2xl bg-white/[.08] p-4"><Bell className="mt-1 text-aqua" size={18}/><div><p className="text-sm font-semibold">{notification.title}</p><p className="text-xs leading-5 text-white/55">{notification.message}</p></div></div>) : <p className="py-8 text-sm text-white/50">No notifications yet.</p>}</div></div></div></section>; }
function Modules(){ return <section id="campaigns" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"><Header eyebrow="Core modules" title="Every business workflow, engineered as independent scalable modules."/><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{modules.map((m,i)=>{const Icon=m.icon; return <motion.article {...fade} transition={{...fade.transition, delay:i*.04}} className="glass rounded-3xl p-6" key={m.title}><Icon className="mb-5 text-gold" size={30}/><h3 className="text-xl font-bold">{m.title}</h3><p className="mt-3 text-sm leading-7 text-white/60">{m.text}</p></motion.article>})}</div></section>; }
function Operations({ leads }: { leads: LeadWithLatestNote[] }){ const pipelineCounts = pipeline.map((item) => { const normalized = item.toLowerCase().replace(' ', '_'); return leads.filter((lead) => lead.status === normalized || (item === 'Closed' && lead.status === 'won')).length; }); return <section id="whatsapp" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"><div className="grid gap-4 lg:grid-cols-2"><div className="glass rounded-[2rem] p-6"><Header eyebrow="Pipeline" title="Lead tracking from source to closed revenue." compact/><div className="mt-6 flex gap-3 overflow-x-auto no-scrollbar">{pipeline.map((p,i)=><div key={p} className="min-w-48 rounded-3xl bg-white/[.08] p-4"><p className="font-bold">{p}</p><p className="mt-8 text-3xl font-black">{pipelineCounts[i]}</p><p className="text-xs text-white/50">active opportunities</p></div>)}</div></div><div className="glass rounded-[2rem] p-6"><Header eyebrow="WhatsApp" title="Policy-compliant business messaging command center." compact/><div className="mt-6 space-y-3">{['Template approval queue','Scheduled meeting reminders','Reply and delivery reports','Client conversation timeline'].map(x=><div key={x} className="flex items-center gap-3 rounded-2xl bg-white/[.08] p-4"><MessageSquareText className="text-aqua" size={18}/><span className="text-sm">{x}</span></div>)}</div></div></div></section>; }
function Future(){ return <section id="analytics" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"><Header eyebrow="Future-ready" title="Built for AI, automation, subscriptions, APIs, and vertical CRM expansion."/><div className="grid grid-cols-2 gap-3 md:grid-cols-3">{roadmap.map(r=>{const Icon=r.icon; return <div className="glass rounded-3xl p-5" key={r.title}><Icon className="mb-4 text-aqua"/><p className="text-sm font-semibold">{r.title}</p></div>})}</div></section>; }
function Header({eyebrow,title,compact=false}:{eyebrow:string; title:string; compact?:boolean}){ return <div className={compact?'':'mb-6'}><p className="mb-2 text-xs font-bold uppercase tracking-[.24em] text-gold">{eyebrow}</p><h2 className={`${compact?'text-2xl':'text-3xl sm:text-4xl'} font-black tracking-tight`}>{title}</h2></div>; }
function NoticeBanner({ notice, inline = false }: { notice: Notice; inline?: boolean }) { if (!notice) return null; return <div role="status" className={`${inline ? 'mt-5' : 'fixed right-4 top-4 z-[60]'} rounded-2xl border px-4 py-3 text-sm ${notice.type === 'success' ? 'border-aqua/30 bg-aqua/10 text-aqua' : 'border-red-300/30 bg-red-500/10 text-red-100'}`}>{notice.message}</div>; }
function MobileNav({ onLogout }: { onLogout: () => void }){ return <nav className="fixed bottom-4 left-4 right-4 z-50 grid grid-cols-5 rounded-[1.7rem] border border-white/15 bg-black/70 p-2 backdrop-blur-xl lg:hidden" aria-label="Mobile navigation">{[Home,UsersRound,Plus,MessageSquareText,Settings].map((Icon,i)=><a key={i} href={i===1?'#leads':'#dashboard'} className={`grid place-items-center rounded-2xl py-3 ${i===2?'bg-aqua text-obsidian':'text-white/70'}`}><Icon size={20}/></a>)}<button onClick={onLogout} className="sr-only">Logout</button></nav>; }
