'use client';

import { motion } from 'framer-motion';
import { BarChart3, Home, MessageSquareText, Plus, Search, Settings, Shield, UsersRound } from 'lucide-react';
import { metrics, modules, nav, pipeline, roadmap } from '@/lib/data';

const fade = { initial: { opacity: 0, y: 22 }, animate: { opacity: 1, y: 0 }, transition: { duration: .65, ease: 'easeOut' } };

export function AppShell() {
  return <main className="premium-grid min-h-screen overflow-hidden pb-24 lg:pb-0">
    <DesktopSidebar />
    <section className="lg:pl-72">
      <Hero />
      <Dashboard />
      <Modules />
      <Operations />
      <Future />
    </section>
    <MobileNav />
  </main>;
}

function DesktopSidebar() { return <aside className="fixed left-6 top-6 z-40 hidden h-[calc(100vh-3rem)] w-60 rounded-[2rem] glass p-5 lg:block">
  <div className="mb-8 flex items-center gap-3"><div className="grid size-11 place-items-center rounded-2xl bg-gold text-obsidian font-black">AW</div><div><p className="font-semibold">Alpha Weber</p><p className="text-xs text-white/50">Growth OS</p></div></div>
  <nav className="space-y-2">{nav.map((item, i)=><a key={item} className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition hover:bg-white/10 ${i===0?'bg-white/[.12] text-aqua':'text-white/68'}`} href={`#${item.toLowerCase()}`}>{i===0?<Home size={17}/>:i===1?<UsersRound size={17}/>:i===3?<MessageSquareText size={17}/>:<BarChart3 size={17}/>} {item}</a>)}</nav>
  <div className="absolute bottom-5 left-5 right-5 rounded-3xl bg-white/8 p-4"><Shield className="mb-3 text-aqua"/><p className="text-sm font-semibold">Enterprise-ready</p><p className="text-xs text-white/50">RBAC, 2FA, modular data boundaries, and scalable integrations.</p></div>
</aside> }

function Hero() { return <section className="mx-auto max-w-7xl px-4 pb-8 pt-5 sm:px-6 lg:px-8 lg:pt-8"><motion.div {...fade} className="glass rounded-[2rem] p-5 sm:p-8 lg:p-10">
  <div className="mb-8 flex items-center justify-between"><div className="rounded-full border border-aqua/30 bg-aqua/10 px-4 py-2 text-xs font-semibold text-aqua">Mobile-first SaaS CRM</div><button className="rounded-full bg-white/10 p-3"><Search size={18}/></button></div>
  <div className="grid gap-8 lg:grid-cols-[1.1fr_.9fr] lg:items-center"><div><h1 className="text-4xl font-black tracking-tight sm:text-6xl lg:text-7xl">Alpha Weber CRM is your complete <span className="text-aqua">Business Growth OS</span>.</h1><p className="mt-5 max-w-2xl text-base leading-8 text-white/68 sm:text-lg">A premium dark, touch-optimized operating system for authentication, leads, clients, campaigns, WhatsApp Business workflows, analytics, admin reporting, and future AI automation.</p><div className="mt-7 flex flex-col gap-3 sm:flex-row"><button className="rounded-2xl bg-aqua px-6 py-4 font-bold text-obsidian shadow-glow">Launch Dashboard</button><button className="rounded-2xl border border-white/15 px-6 py-4 font-bold text-white">View Architecture</button></div></div><PhonePreview /></div>
</motion.div></section> }

function PhonePreview(){ return <motion.div initial={{opacity:0, scale:.94, rotate:2}} animate={{opacity:1, scale:1, rotate:0}} transition={{duration:.8}} className="mx-auto w-full max-w-sm rounded-[2.5rem] border border-white/15 bg-black p-3 shadow-2xl"><div className="rounded-[2rem] bg-panel p-4"><div className="mb-5 flex items-center justify-between"><span className="text-xs text-white/50">Today</span><span className="rounded-full bg-gold/20 px-3 py-1 text-xs text-gold">Live</span></div><p className="text-2xl font-black">$482K</p><p className="text-sm text-white/50">Monthly revenue pipeline</p><div className="mt-5 h-32 rounded-3xl bg-gradient-to-br from-aqua/30 to-gold/20 p-4"><div className="flex h-full items-end gap-2">{[35,62,48,82,58,92,74].map((h,i)=><div key={i} className="flex-1 rounded-t-xl bg-white/70" style={{height:`${h}%`}} />)}</div></div><div className="mt-4 space-y-3">{pipeline.slice(0,3).map((p,i)=><div key={p} className="flex items-center justify-between rounded-2xl bg-white/8 p-3"><span className="text-sm">{p}</span><span className="text-aqua">{[428,306,182][i]}</span></div>)}</div></div></motion.div> }

function Dashboard(){ return <section id="dashboard" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{metrics.map((m,i)=><motion.div {...fade} transition={{...fade.transition, delay:i*.05}} key={m.label} className="glass rounded-3xl p-5"><p className="text-sm text-white/55">{m.label}</p><div className="mt-3 flex items-end justify-between"><h3 className="text-3xl font-black">{m.value}</h3><span className="rounded-full bg-aqua/10 px-3 py-1 text-xs text-aqua">{m.delta}</span></div></motion.div>)}</div></section> }

function Modules(){ return <section id="leads" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"><Header eyebrow="Core modules" title="Every business workflow, engineered as independent scalable modules."/><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{modules.map((m,i)=>{const Icon=m.icon; return <motion.article {...fade} transition={{...fade.transition, delay:i*.04}} className="glass rounded-3xl p-6" key={m.title}><Icon className="mb-5 text-gold" size={30}/><h3 className="text-xl font-bold">{m.title}</h3><p className="mt-3 text-sm leading-7 text-white/60">{m.text}</p></motion.article>})}</div></section> }

function Operations(){ return <section id="campaigns" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"><div className="grid gap-4 lg:grid-cols-2"><div className="glass rounded-[2rem] p-6"><Header eyebrow="Pipeline" title="Lead tracking from source to closed revenue." compact/><div className="mt-6 flex gap-3 overflow-x-auto no-scrollbar">{pipeline.map((p,i)=><div key={p} className="min-w-48 rounded-3xl bg-white/8 p-4"><p className="font-bold">{p}</p><p className="mt-8 text-3xl font-black">{[248,184,92,61,37][i]}</p><p className="text-xs text-white/50">active opportunities</p></div>)}</div></div><div id="whatsapp" className="glass rounded-[2rem] p-6"><Header eyebrow="WhatsApp" title="Policy-compliant business messaging command center." compact/><div className="mt-6 space-y-3">{['Template approval queue','Scheduled meeting reminders','Reply and delivery reports','Client conversation timeline'].map(x=><div key={x} className="flex items-center gap-3 rounded-2xl bg-white/8 p-4"><MessageSquareText className="text-aqua" size={18}/><span className="text-sm">{x}</span></div>)}</div></div></div></section> }

function Future(){ return <section id="analytics" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"><Header eyebrow="Future-ready" title="Built for AI, automation, subscriptions, APIs, and vertical CRM expansion."/><div className="grid grid-cols-2 gap-3 md:grid-cols-3">{roadmap.map(r=>{const Icon=r.icon; return <div className="glass rounded-3xl p-5" key={r.title}><Icon className="mb-4 text-aqua"/><p className="text-sm font-semibold">{r.title}</p></div>})}</div></section> }

function Header({eyebrow,title,compact=false}:{eyebrow:string; title:string; compact?:boolean}){ return <div className={compact?'':'mb-6'}><p className="mb-2 text-xs font-bold uppercase tracking-[.24em] text-gold">{eyebrow}</p><h2 className={`${compact?'text-2xl':'text-3xl sm:text-4xl'} font-black tracking-tight`}>{title}</h2></div> }
function MobileNav(){ return <nav className="fixed bottom-4 left-4 right-4 z-50 grid grid-cols-5 rounded-[1.7rem] border border-white/15 bg-black/70 p-2 backdrop-blur-xl lg:hidden">{[Home,UsersRound,Plus,MessageSquareText,Settings].map((Icon,i)=><a key={i} href="#dashboard" className={`grid place-items-center rounded-2xl py-3 ${i===2?'bg-aqua text-obsidian':'text-white/70'}`}><Icon size={20}/></a>)}</nav> }
