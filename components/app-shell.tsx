'use client';

import { type FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { motion } from 'framer-motion';
import {
  BarChart3,
  Home,
  Loader2,
  LogOut,
  Plus,
  Search,
  Shield,
  Trash2,
  UsersRound,
} from 'lucide-react';
import { nav, pipeline } from '@/lib/data';
import {
  emptyLeadInput,
  leadStatuses,
  normalizeLeadInput,
  type Lead,
  type LeadInput,
  type LeadStatus,
} from '@/lib/leads';
import { isSupabaseConfigured, supabase } from '@/lib/integrations/supabase';

const fade = {
  initial: { opacity: 0, y: 22 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.65 },
};

const mobileNavItems = [
  { href: '#dashboard', label: 'Dashboard', icon: Home },
  { href: '#leads', label: 'Leads', icon: UsersRound },
  { href: '#leads', label: 'Add lead', icon: Plus, primary: true },
  { href: '#pipeline', label: 'Pipeline', icon: BarChart3 },
];

type Notice = { type: 'success' | 'error'; message: string } | null;

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

    if (error) {
      setNotice({ type: 'error', message: error.message });
      return;
    }

    setNotice({ type: 'success', message: 'Logged out successfully.' });
  }

  if (authLoading) {
    return (
      <main className="premium-grid grid min-h-screen place-items-center">
        <Loader2 className="animate-spin text-aqua" size={36} aria-label="Loading dashboard" />
      </main>
    );
  }

  if (!session) {
    return <LoginScreen notice={notice} setNotice={setNotice} />;
  }

  return (
    <main className="premium-grid min-h-screen overflow-hidden pb-24 lg:pb-0">
      <DesktopSidebar onLogout={handleLogout} />
      <section className="lg:pl-72">
        <Hero userEmail={session.user.email ?? 'Admin'} />
        <Dashboard />
        <LeadsManager setNotice={setNotice} />
        <PipelineOverview />
      </section>
      <NoticeBanner notice={notice} />
      <MobileNav onLogout={handleLogout} />
    </main>
  );
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
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (error) {
      setNotice({ type: 'error', message: error.message });
      return;
    }

    setNotice({ type: 'success', message: 'Welcome back.' });
  }

  return (
    <main className="premium-grid flex min-h-screen items-center justify-center bg-background px-5">
      <section className="premium-card glass w-full max-w-md shadow-2xl">
        <div className="space-y-4 text-center">
          <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-gold font-black text-obsidian">AW</div>
          <h1 className="text-gradient text-4xl font-bold">Admin Login</h1>
          <p className="text-slate-400">Sign in to access the protected CRM dashboard.</p>
        </div>
        <form onSubmit={handleLogin} className="mt-8 space-y-4">
          <input
            className="field"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Admin email"
            autoComplete="email"
            required
          />
          <input
            className="field"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Password"
            autoComplete="current-password"
            required
          />
          <button
            className="w-full rounded-2xl bg-aqua px-6 py-4 font-bold text-obsidian shadow-glow disabled:opacity-60"
            disabled={loading}
            type="submit"
          >
            {loading ? 'Signing in...' : 'Login'}
          </button>
        </form>
        <NoticeBanner notice={notice} inline />
      </section>
    </main>
  );
}

function DesktopSidebar({ onLogout }: { onLogout: () => void }) {
  return (
    <aside className="glass fixed left-6 top-6 z-40 hidden h-[calc(100vh-3rem)] w-60 rounded-[2rem] p-5 lg:block">
      <div className="mb-8 flex items-center gap-3">
        <div className="grid size-11 place-items-center rounded-2xl bg-gold font-black text-obsidian">AW</div>
        <div>
          <p className="font-semibold">Alpha Weber</p>
          <p className="text-xs text-white/50">Growth OS</p>
        </div>
      </div>
      <nav className="space-y-2" aria-label="Primary navigation">
        {nav.map((item, index) => {
          const Icon = index === 0 ? Home : index === 1 ? UsersRound : BarChart3;
          return (
            <a
              key={item.label}
              className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition hover:bg-white/10 ${
                index === 0 ? 'bg-white/[.12] text-aqua' : 'text-white/[.68]'
              }`}
              href={item.href}
            >
              <Icon size={17} /> {item.label}
            </a>
          );
        })}
      </nav>
      <button
        onClick={onLogout}
        className="mt-4 flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm text-white/[.68] transition hover:bg-white/10"
      >
        <LogOut size={17} /> Logout
      </button>
      <div className="absolute bottom-5 left-5 right-5 rounded-3xl bg-white/[.08] p-4">
        <Shield className="mb-3 text-aqua" />
        <p className="text-sm font-semibold">Enterprise-ready</p>
        <p className="text-xs text-white/50">RBAC, 2FA, modular data boundaries, and scalable integrations.</p>
      </div>
    </aside>
  );
}

function Hero({ userEmail }: { userEmail: string }) {
  return (
    <section id="dashboard" className="mx-auto max-w-7xl px-4 pb-8 pt-5 sm:px-6 lg:px-8 lg:pt-8">
      <motion.div {...fade} className="glass rounded-[2rem] p-5 sm:p-8 lg:p-10">
        <div className="mb-8 flex items-center justify-between">
          <div className="rounded-full border border-aqua/30 bg-aqua/10 px-4 py-2 text-xs font-semibold text-aqua">
            Protected Admin Dashboard
          </div>
          <span className="hidden text-sm text-white/55 sm:block">{userEmail}</span>
        </div>
        <div className="grid gap-8 lg:grid-cols-[1.1fr_.9fr] lg:items-center">
          <div>
            <h1 className="text-4xl font-black tracking-tight sm:text-6xl lg:text-7xl">
              Alpha Weber CRM is your complete <span className="text-aqua">Business Growth OS</span>.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-white/[.68] sm:text-lg">
              A premium dark, touch-optimized operating system for authentication, lead tracking, dashboard metrics,
              search, filters, and realtime pipeline visibility.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <a href="#leads" className="rounded-2xl bg-aqua px-6 py-4 text-center font-bold text-obsidian shadow-glow">
                Manage Leads
              </a>
              <a href="#pipeline" className="rounded-2xl border border-white/15 px-6 py-4 text-center font-bold text-white">
                View Pipeline
              </a>
            </div>
          </div>
          <PhonePreview />
        </div>
      </motion.div>
    </section>
  );
}

function PhonePreview() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94, rotate: 2 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ duration: 0.8 }}
      className="mx-auto w-full max-w-sm rounded-[2.5rem] border border-white/15 bg-black p-3 shadow-2xl"
    >
      <div className="rounded-[2rem] bg-panel p-4">
        <div className="mb-5 flex items-center justify-between">
          <span className="text-xs text-white/50">Today</span>
          <span className="rounded-full bg-gold/20 px-3 py-1 text-xs text-gold">Live</span>
        </div>
        <p className="text-2xl font-black">Leads CRM</p>
        <p className="text-sm text-white/50">Real-time Supabase pipeline</p>
        <div className="mt-5 h-32 rounded-3xl bg-gradient-to-br from-aqua/30 to-gold/20 p-4">
          <div className="flex h-full items-end gap-2">
            {[35, 62, 48, 82, 58, 92, 74].map((height, index) => (
              <div key={index} className="flex-1 rounded-t-xl bg-white/70" style={{ height: `${height}%` }} />
            ))}
          </div>
        </div>
        <div className="mt-4 space-y-3">
          {pipeline.slice(0, 3).map((item, index) => (
            <div key={item.label} className="flex items-center justify-between rounded-2xl bg-white/[.08] p-3">
              <span className="text-sm">{item.label}</span>
              <span className="text-aqua">{index + 1}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function Dashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);

  useEffect(() => {
    if (!supabase) return;

    supabase.from('leads').select('*').then(({ data }) => setLeads((data ?? []) as Lead[]));
  }, []);

  const dashboardMetrics = [
    { label: 'Total Leads', value: String(leads.length), delta: 'Live' },
    { label: 'Qualified', value: String(leads.filter((lead) => lead.status === 'qualified').length), delta: 'Supabase' },
    { label: 'Meetings', value: String(leads.filter((lead) => lead.status === 'meeting').length), delta: 'Pipeline' },
    { label: 'Proposals', value: String(leads.filter((lead) => lead.status === 'proposal').length), delta: 'Pipeline' },
    { label: 'Won', value: String(leads.filter((lead) => lead.status === 'won').length), delta: 'Revenue' },
    { label: 'Lost', value: String(leads.filter((lead) => lead.status === 'lost').length), delta: 'Archive' },
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8" aria-label="Dashboard metrics">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {dashboardMetrics.map((metric, index) => (
          <motion.div
            {...fade}
            transition={{ ...fade.transition, delay: index * 0.05 }}
            key={metric.label}
            className="glass rounded-3xl p-5"
          >
            <p className="text-sm text-white/55">{metric.label}</p>
            <div className="mt-3 flex items-end justify-between">
              <h3 className="text-3xl font-black">{metric.value}</h3>
              <span className="rounded-full bg-aqua/10 px-3 py-1 text-xs text-aqua">{metric.delta}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function LeadsManager({ setNotice }: { setNotice: (notice: Notice) => void }) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [form, setForm] = useState<LeadInput>(emptyLeadInput);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<'all' | LeadStatus>('all');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const filteredLeads = useMemo(
    () =>
      leads.filter((lead) => {
        const matchesStatus = status === 'all' || lead.status === status;
        const term = search.toLowerCase().trim();
        const matchesSearch =
          !term ||
          [lead.name, lead.phone, lead.business_name, lead.email, lead.notes].some((value) => value.toLowerCase().includes(term));

        return matchesStatus && matchesSearch;
      }),
    [leads, search, status],
  );

  const fetchLeads = useCallback(
    async (showLoader = true) => {
      if (!supabase) {
        setNotice({ type: 'error', message: 'Supabase is not configured.' });
        setLoading(false);
        return;
      }

      if (showLoader) setLoading(true);

      const { data, error } = await supabase.from('leads').select('*').order('created_at', { ascending: false });

      if (error) {
        setNotice({ type: 'error', message: error.message });
      } else {
        setLeads((data ?? []) as Lead[]);
      }

      setLoading(false);
    },
    [setNotice],
  );

  useEffect(() => {
    void fetchLeads();

    if (!supabase) return undefined;

    const client = supabase;
    const channel = client
      .channel('leads-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'leads' }, () => {
        void fetchLeads(false);
      })
      .subscribe();

    return () => {
      void client.removeChannel(channel);
    };
  }, [fetchLeads]);

  async function saveLead(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase) return;

    const payload = normalizeLeadInput(form);
    setSaving(true);
    const result = editingId
      ? await supabase.from('leads').update(payload).eq('id', editingId)
      : await supabase.from('leads').insert(payload);
    setSaving(false);

    if (result.error) {
      setNotice({ type: 'error', message: result.error.message });
      return;
    }

    setNotice({ type: 'success', message: editingId ? 'Lead updated.' : 'Lead added.' });
    setForm(emptyLeadInput);
    setEditingId(null);
    await fetchLeads(false);
  }

  function editLead(lead: Lead) {
    setEditingId(lead.id);
    setForm({
      name: lead.name,
      phone: lead.phone,
      business_name: lead.business_name,
      email: lead.email,
      status: lead.status,
      notes: lead.notes,
    });
  }

  async function deleteLead(id: string) {
    if (!supabase) return;

    const { error } = await supabase.from('leads').delete().eq('id', id);

    if (error) {
      setNotice({ type: 'error', message: error.message });
      return;
    }

    setNotice({ type: 'success', message: 'Lead deleted.' });
    await fetchLeads(false);
  }

  return (
    <section id="leads" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Header eyebrow="Leads" title="Real-time Supabase lead command center." />
      <div className="grid gap-4 xl:grid-cols-[.9fr_1.1fr]">
        <form onSubmit={saveLead} className="glass space-y-4 rounded-[2rem] p-6">
          <h3 className="text-xl font-bold">{editingId ? 'Edit Lead' : 'Add Lead'}</h3>
          <input
            className="field"
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
            placeholder="Lead name"
            autoComplete="name"
            required
          />
          <input
            className="field"
            value={form.phone}
            onChange={(event) => setForm({ ...form, phone: event.target.value })}
            placeholder="Phone"
            autoComplete="tel"
            required
          />
          <input
            className="field"
            value={form.business_name}
            onChange={(event) => setForm({ ...form, business_name: event.target.value })}
            placeholder="Business name"
            autoComplete="organization"
            required
          />
          <input
            className="field"
            type="email"
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
            placeholder="Email"
            autoComplete="email"
            required
          />
          <select
            className="field"
            value={form.status}
            onChange={(event) => setForm({ ...form, status: event.target.value as LeadStatus })}
            aria-label="Lead status"
          >
            {leadStatuses.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <textarea
            className="field min-h-28"
            value={form.notes}
            onChange={(event) => setForm({ ...form, notes: event.target.value })}
            placeholder="Notes"
          />
          <div className="flex flex-wrap gap-3">
            <button
              disabled={saving}
              className="rounded-2xl bg-aqua px-6 py-4 font-bold text-obsidian shadow-glow disabled:opacity-60"
              type="submit"
            >
              {saving ? 'Saving...' : editingId ? 'Update Lead' : 'Add Lead'}
            </button>
            {editingId ? (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setForm(emptyLeadInput);
                }}
                className="rounded-2xl border border-white/15 px-6 py-4 font-bold text-white"
              >
                Cancel
              </button>
            ) : null}
          </div>
        </form>
        <div className="glass rounded-[2rem] p-6">
          <div className="grid gap-3 md:grid-cols-[1fr_220px]">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
              <input
                className="field pl-11"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search leads"
                aria-label="Search leads"
              />
            </div>
            <select
              className="field"
              value={status}
              onChange={(event) => setStatus(event.target.value as 'all' | LeadStatus)}
              aria-label="Filter leads by status"
            >
              <option value="all">All statuses</option>
              {leadStatuses.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
          <div className="no-scrollbar mt-5 max-h-[38rem] space-y-3 overflow-y-auto pr-1">
            {loading ? (
              <div className="grid place-items-center py-16">
                <Loader2 className="animate-spin text-aqua" aria-label="Loading leads" />
              </div>
            ) : filteredLeads.length ? (
              filteredLeads.map((lead) => (
                <article key={lead.id} className="rounded-3xl bg-white/[.08] p-4">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="font-bold">{lead.name}</h4>
                        <span className="rounded-full bg-aqua/10 px-3 py-1 text-xs text-aqua">{lead.status}</span>
                      </div>
                      <p className="mt-1 text-sm text-white/55">
                        {lead.business_name} · {lead.phone} · {lead.email}
                      </p>
                      <p className="mt-3 text-sm leading-6 text-white/65">{lead.notes || 'No notes yet.'}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => editLead(lead)} className="rounded-2xl border border-white/15 px-4 py-2 text-sm font-bold">
                        Edit
                      </button>
                      <button
                        onClick={() => void deleteLead(lead.id)}
                        className="rounded-2xl bg-red-500/15 px-3 py-2 text-red-200"
                        aria-label={`Delete ${lead.name}`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <p className="py-16 text-center text-white/50">No leads found.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function PipelineOverview() {
  const [leads, setLeads] = useState<Lead[]>([]);

  useEffect(() => {
    if (!supabase) return;

    supabase.from('leads').select('*').then(({ data }) => setLeads((data ?? []) as Lead[]));
  }, []);

  const pipelineCounts = pipeline.map((item) => leads.filter((lead) => item.statuses.includes(lead.status)).length);

  return (
    <section id="pipeline" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="glass rounded-[2rem] p-6">
        <Header eyebrow="Pipeline" title="Lead tracking from source to closed revenue." compact />
        <div className="no-scrollbar mt-6 flex gap-3 overflow-x-auto">
          {pipeline.map((item, index) => (
            <div key={item.label} className="min-w-48 rounded-3xl bg-white/[.08] p-4">
              <p className="font-bold">{item.label}</p>
              <p className="mt-8 text-3xl font-black">{pipelineCounts[index]}</p>
              <p className="text-xs text-white/50">active opportunities</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Header({ eyebrow, title, compact = false }: { eyebrow: string; title: string; compact?: boolean }) {
  return (
    <div className={compact ? '' : 'mb-6'}>
      <p className="mb-2 text-xs font-bold uppercase tracking-[.24em] text-gold">{eyebrow}</p>
      <h2 className={`${compact ? 'text-2xl' : 'text-3xl sm:text-4xl'} font-black tracking-tight`}>{title}</h2>
    </div>
  );
}

function NoticeBanner({ notice, inline = false }: { notice: Notice; inline?: boolean }) {
  if (!notice) return null;

  return (
    <div
      className={`${inline ? 'mt-5' : 'fixed right-4 top-4 z-[60]'} rounded-2xl border px-4 py-3 text-sm ${
        notice.type === 'success' ? 'border-aqua/30 bg-aqua/10 text-aqua' : 'border-red-300/30 bg-red-500/10 text-red-100'
      }`}
      role="status"
    >
      {notice.message}
    </div>
  );
}

function MobileNav({ onLogout }: { onLogout: () => void }) {
  return (
    <nav
      className="fixed bottom-4 left-4 right-4 z-50 grid grid-cols-6 rounded-[1.7rem] border border-white/15 bg-black/70 p-2 backdrop-blur-xl lg:hidden"
      aria-label="Mobile navigation"
    >
      {mobileNavItems.map((item) => {
        const Icon = item.icon;

        return (
          <a
            key={item.label}
            href={item.href}
            aria-label={item.label}
            className={`grid place-items-center rounded-2xl py-3 ${item.primary ? 'bg-aqua text-obsidian' : 'text-white/70'}`}
          >
            <Icon size={20} />
          </a>
        );
      })}
      <button onClick={onLogout} className="grid place-items-center rounded-2xl py-3 text-white/70" aria-label="Logout">
        <LogOut size={20} />
      </button>
    </nav>
  );
}
