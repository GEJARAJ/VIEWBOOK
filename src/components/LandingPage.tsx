'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';
import {
  ShieldCheck,
  Lock,
  Eye,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Calculator,
  Fingerprint,
  ExternalLink,
  Play,
  Code2,
  Image as ImageIcon,
  CheckCheck,
  ChevronDown,
  XCircle,
  Shield,
  ArrowUpRight,
  AlertOctagon,
  TrendingUp,
  Users,
  BadgeCheck,
  Wallet,
  Star,
  Zap,
  Globe,
  Coins,
  Scale,
  FileCheck2,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface LandingPageProps {
  onLaunchApp: () => void;
}

function useScrollReveal(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

function Reveal({ children, className = '', delay = 0, from = 'bottom' }: {
  children: React.ReactNode; className?: string; delay?: number; from?: 'bottom' | 'left' | 'right';
}) {
  const { ref, visible } = useScrollReveal();
  const transforms: Record<string, string> = {
    bottom: 'translateY(40px)', left: 'translateX(-40px)', right: 'translateX(40px)',
  };
  return (
    <div ref={ref} className={className} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'translate(0,0)' : transforms[from],
      transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
    }}>
      {children}
    </div>
  );
}

const TICKER_ITEMS = [
  'CTR-8942: $12,400 locked in smart escrow',
  'Mila A. received $7,320 — milestone verified',
  'Forensic watermark blocked unauthorized download attempt',
  'Daniel P. retained $2,100 extra vs traditional 20% platform tax',
  'CTR-7734: $5,500 held in multi-sig custody',
  'Priya K. received $14,625 net settlement on approval',
  'Beneficiary routing verified — payout secured to creator wallet',
  'Vault DRM active — right-click asset protection enforced',
  'Zero theft incidents recorded across all escrow milestones',
];

export const LandingPage: React.FC<LandingPageProps> = ({ onLaunchApp }) => {
  const [heroApproved, setHeroApproved] = useState(false);
  const [heroLoading, setHeroLoading] = useState(false);
  const [sandboxTab, setSandboxTab] = useState<'design' | 'code' | 'video'>('design');
  const [sandboxUnlocked, setSandboxUnlocked] = useState(false);
  const [showRightClickWarn, setShowRightClickWarn] = useState(false);
  const [projectAmount, setProjectAmount] = useState(8000);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [heroVisible, setHeroVisible] = useState(false);

  useEffect(() => { const t = setTimeout(() => setHeroVisible(true), 60); return () => clearTimeout(t); }, []);

  const viewBookFee = projectAmount * 0.025;
  const viewBookTakeHome = projectAmount - viewBookFee;
  const upworkFee = projectAmount * 0.20;
  const upworkTakeHome = projectAmount - upworkFee;
  const extraCash = upworkFee - viewBookFee;

  const handleHeroApprove = () => {
    setHeroLoading(true);
    setTimeout(() => {
      setHeroLoading(false);
      setHeroApproved(true);
      confetti({ particleCount: 120, spread: 85, origin: { y: 0.55 }, colors: ['#a3e635', '#38bdf8', '#34d399'] });
    }, 1100);
  };

  return (
    <div className="min-h-screen bg-[#080808] text-white font-sans overflow-x-hidden selection:bg-lime-400/30 selection:text-lime-300">

      {/* === NOISE TEXTURE OVERLAY === */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.03]"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")", backgroundRepeat: 'repeat', backgroundSize: '128px' }} />

      {/* === AMBIENT BLOBS === */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-60 left-1/3 w-[800px] h-[700px] bg-violet-600/15 blur-[200px] rounded-full" />
        <div className="absolute top-[40%] right-[-200px] w-[600px] h-[500px] bg-lime-400/8 blur-[180px] rounded-full" />
        <div className="absolute bottom-[10%] left-[-150px] w-[500px] h-[400px] bg-emerald-600/10 blur-[160px] rounded-full" />
      </div>

      {/* ===== NAV ===== */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-[#080808]/85 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-5 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-lime-400 flex items-center justify-center text-zinc-950 shadow-md shadow-lime-400/20">
              <ShieldCheck className="w-4 h-4 stroke-[3]" />
            </div>
            <span className="font-black text-base tracking-tighter">
              View<span className="text-lime-400">Book</span>
            </span>
            <span className="hidden sm:flex items-center gap-1 ml-1 px-2 py-0.5 rounded-full bg-lime-400/10 border border-lime-400/20 text-lime-400 text-[9px] font-black tracking-widest uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-lime-400 animate-pulse" />
              live protocol
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-7 text-xs font-bold text-zinc-400">
            {['How it Works', 'Fee Calc', 'Vault', 'FAQ'].map((l) => (
              <a key={l} href={`#${l.toLowerCase().replace(' ', '-')}`} className="hover:text-white transition-colors">{l}</a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link href="/c/CTR-8942" className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 text-[11px] font-bold text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl border border-white/8 transition">
              Client Portal <ExternalLink className="w-2.5 h-2.5" />
            </Link>
            <button onClick={onLaunchApp} className="flex items-center gap-1.5 px-4 py-1.5 text-[11px] font-black text-zinc-950 bg-lime-400 hover:bg-lime-300 rounded-xl shadow-lg shadow-lime-400/20 transition hover:scale-[1.04] active:scale-95">
              Launch App <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </header>

      {/* === TICKER === */}
      <div className="relative z-10 overflow-hidden border-b border-white/5 bg-white/[0.02] py-2">
        <div className="pointer-events-none absolute left-0 top-0 h-full w-24 z-10 bg-gradient-to-r from-[#080808] to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 h-full w-24 z-10 bg-gradient-to-l from-[#080808] to-transparent" />
        <div className="animate-marquee">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <span key={i} className="shrink-0 text-[10px] font-bold text-zinc-400 px-5 border-r border-white/5 last:border-0 whitespace-nowrap tracking-wide">
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ===== HERO ===== */}
      <section className="relative z-10 pt-16 sm:pt-24 pb-10 px-5 max-w-6xl mx-auto">
        {/* Eyebrow */}
        <div style={{ opacity: heroVisible ? 1 : 0, transform: heroVisible ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.6s ease 0.05s' }}>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-zinc-300 text-[11px] font-bold uppercase tracking-widest mb-7">
            <ShieldCheck className="w-3.5 h-3.5 text-lime-400" />
            Zero-Theft Escrow &amp; Deliverable Protection
          </div>
        </div>

        {/* BIG HEADLINE */}
        <div style={{ opacity: heroVisible ? 1 : 0, transform: heroVisible ? 'translateY(0)' : 'translateY(28px)', transition: 'all 0.65s ease 0.15s' }}>
          <h1 className="text-[clamp(3rem,9vw,8rem)] font-black leading-[0.92] tracking-tighter mb-6">
            <span className="block text-white">Your client</span>
            <span className="block bg-gradient-to-r from-lime-300 via-emerald-300 to-cyan-300 bg-clip-text text-transparent">cannot ghost</span>
            <span className="block text-white">your payment.</span>
          </h1>
          <p className="text-zinc-400 text-base sm:text-xl max-w-xl leading-relaxed font-medium mb-8">
            Milestones locked in escrow <em>before</em> work starts. Deliverables protected with forensic DRM watermarks. Funds release in one click upon approval.
          </p>
        </div>

        {/* CTA Row */}
        <div
          className="flex flex-col sm:flex-row items-start gap-3 mb-12"
          style={{ opacity: heroVisible ? 1 : 0, transform: heroVisible ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.65s ease 0.28s' }}
        >
          <button onClick={onLaunchApp} className="group flex items-center gap-2.5 px-7 py-3.5 rounded-2xl text-sm font-black text-zinc-950 bg-lime-400 hover:bg-lime-300 shadow-xl shadow-lime-400/20 transition hover:-translate-y-0.5 active:scale-[0.97]">
            <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
            Launch Escrow Console
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
          <a href="#how-it-works" className="flex items-center gap-2 px-6 py-3.5 rounded-2xl text-sm font-bold bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/8 transition">
            <Play className="w-4 h-4 text-lime-400 fill-lime-400/50" />
            See How It Works
          </a>
        </div>

        {/* === BENTO GRID HERO === */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          style={{ opacity: heroVisible ? 1 : 0, transform: heroVisible ? 'translateY(0)' : 'translateY(32px)', transition: 'all 0.7s ease 0.42s' }}
        >
          {/* BIG HERO CARD — spans 2 cols */}
          <div className="sm:col-span-2 p-px rounded-3xl bg-gradient-to-br from-white/10 to-white/[0.03]">
            <div className="p-6 rounded-[23px] bg-[#0f0f0f] space-y-4 h-full">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-lime-400/10 border border-lime-400/20 flex items-center justify-center">
                    <Lock className="w-4 h-4 text-lime-400" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-zinc-500 block">CTR-8942 • Milestone 02</span>
                    <span className="text-sm font-bold text-white">Full Brand System &amp; Mobile App Master</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-zinc-500 block font-mono">Locked in Escrow</span>
                  <span className="text-xl font-black font-mono text-lime-300">$8,500</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { initials: 'AV', name: 'Alex Vance', role: 'Client (Verified Buyer)', color: 'text-sky-300', bg: 'bg-sky-500/10' },
                  { initials: 'ER', name: 'Elena Rostova', role: 'Creator (Agency Lead)', color: 'text-lime-300', bg: 'bg-lime-500/10' },
                ].map(({ initials, name, role, color, bg }) => (
                  <div key={initials} className="p-3 rounded-xl bg-white/[0.04] border border-white/5 flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-full ${bg} ${color} flex items-center justify-center font-black text-[10px]`}>{initials}</div>
                    <div><span className="text-zinc-200 font-bold block">{name}</span><span className="text-[10px] text-zinc-500">{role}</span></div>
                  </div>
                ))}
              </div>

              {/* Approval CTA */}
              <div className={`p-4 rounded-2xl border transition-all duration-500 ${heroApproved ? 'bg-lime-950/30 border-lime-500/30' : heroLoading ? 'bg-amber-950/20 border-amber-500/20' : 'bg-violet-950/20 border-violet-700/30'}`}>
                {!heroApproved && !heroLoading && (
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                      <div className="text-xs font-bold text-violet-300 flex items-center gap-1.5 mb-0.5">
                        <Eye className="w-3.5 h-3.5" /> Deliverables In Vault Review (Forensic DRM)
                      </div>
                      <p className="text-[11px] text-zinc-400">Client can inspect full resolution; downloads unlock only upon release.</p>
                    </div>
                    <button onClick={handleHeroApprove} className="px-4 py-2 rounded-xl text-xs font-black bg-lime-400 hover:bg-lime-300 text-zinc-950 transition hover:scale-[1.04] active:scale-95 whitespace-nowrap">
                      Approve &amp; Release Funds
                    </button>
                  </div>
                )}
                {heroLoading && (
                  <div className="flex items-center gap-3 text-xs text-amber-300 font-bold">
                    <div className="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                    Executing atomic multi-sig release...
                  </div>
                )}
                {heroApproved && (
                  <div className="flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2 text-lime-300 font-bold">
                      <CheckCheck className="w-4 h-4 text-lime-400" />
                      Disbursed: Elena received $8,287.50 (97.5% Net). Clean files unlocked.
                    </div>
                    <button onClick={() => setHeroApproved(false)} className="text-[11px] text-zinc-400 hover:text-zinc-200 font-mono hover:underline shrink-0 transition">Reset Demo</button>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-4 text-[10px] font-mono text-zinc-500">
                <span>Deposit Fee: <strong className="text-lime-400">$0.00</strong></span>
                <span>•</span>
                <span>Platform Cut: <strong className="text-zinc-300">2.5% Flat</strong></span>
                <span>•</span>
                <span>Payout Route: <strong className="text-zinc-300">Pre-Pinned</strong></span>
              </div>
            </div>
          </div>

          {/* MINI BENTO: Stats */}
          <div className="flex flex-col gap-4">
            <div className="p-5 rounded-3xl bg-[#0f0f0f] border border-white/5 flex flex-col justify-center space-y-1 flex-1">
              <TrendingUp className="w-5 h-5 text-lime-400 mb-1" />
              <div className="text-3xl font-black text-lime-300">$2.4M+</div>
              <div className="text-xs text-zinc-400 font-medium">Protected in Escrow</div>
            </div>
            <div className="p-5 rounded-3xl bg-[#0f0f0f] border border-white/5 flex flex-col justify-center space-y-1 flex-1">
              <BadgeCheck className="w-5 h-5 text-emerald-400 mb-1" />
              <div className="text-3xl font-black text-white">Zero</div>
              <div className="text-xs text-zinc-400 font-medium">Theft Incidents Verified</div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== THE PROBLEM SECTION ===== */}
      <Reveal>
        <section className="relative z-10 py-16 px-5 max-w-6xl mx-auto">
          <div className="mb-10">
            <span className="text-[11px] font-black uppercase tracking-widest text-zinc-400">Industry Comparison</span>
            <h2 className="text-4xl sm:text-6xl font-black tracking-tighter mt-2 leading-[1]">
              Legacy freelance platforms
              <span className="block bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent"> take too much.</span>
            </h2>
          </div>

          {/* Bento Problem Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: XCircle, title: '20% Platform Tax', desc: 'Marketplaces take up to $2,000 on every $10k milestone. That is your profit margin.', color: 'border-red-900/40 bg-red-950/10' },
              { icon: AlertOctagon, title: 'Unprotected File Delivery', desc: 'Sending deliverables via email or drive leaves creators vulnerable to unpaid usage and ghosting.', color: 'border-orange-900/40 bg-orange-950/10' },
              { icon: Wallet, title: 'Net-30 Invoice Delays', desc: 'Weeks waiting for wire approvals, account freezes, and unilateral chargeback disputes.', color: 'border-red-900/40 bg-red-950/10' },
            ].map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className={`p-6 rounded-3xl border ${color} space-y-3`}>
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-red-400" />
                </div>
                <h3 className="text-base font-black text-white">{title}</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          {/* VS Banner */}
          <div className="my-8 flex items-center gap-4">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/10" />
            <span className="text-xs font-black text-zinc-500 uppercase tracking-widest px-4">Versus ViewBook Standard</span>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/10" />
          </div>

          {/* ViewBook solution */}
          <div className="p-px rounded-3xl bg-gradient-to-br from-lime-400/20 via-emerald-400/10 to-cyan-400/10">
            <div className="p-7 sm:p-9 rounded-[23px] bg-[#0f0f0f] grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { icon: Coins, title: '2.5% Flat Protocol Fee', desc: 'Creators keep 97.5% net cash. Clients pay 0% deposit fees. Transparent economics without hidden deductions.' },
                { icon: Shield, title: 'Theft-Proof Vault Inspection', desc: 'Deliverables are forensically watermarked with client IP and cryptographic timestamps until approved.' },
                { icon: Zap, title: 'Guaranteed Atomic Payouts', desc: 'Approval instantly disburses funds directly to creator wallets while unwatermarked master files unlock for clients.' },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-lime-400/10 border border-lime-400/20 flex items-center justify-center mb-1">
                    <Icon className="w-5 h-5 text-lime-400" />
                  </div>
                  <h4 className="text-sm font-black text-white">{title}</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* ===== HOW IT WORKS ===== */}
      <section id="how-it-works" className="relative z-10 py-16 px-5 max-w-6xl mx-auto">
        <Reveal>
          <div className="mb-12">
            <span className="text-[11px] font-black uppercase tracking-widest text-zinc-400">Architecture Workflow</span>
            <h2 className="text-4xl sm:text-6xl font-black tracking-tighter mt-2 leading-[1]">
              Three steps.{' '}
              <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">Complete certainty.</span>
            </h2>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { num: '01', icon: Lock, iconColor: 'text-amber-400', bg: 'bg-amber-400/10 border-amber-400/20', title: 'Client Locks Escrow Funds', desc: 'Client funds the milestone via Card or Wire into an isolated trust ledger. The creator has 100% certainty payment is secured before commencing production.' },
            { num: '02', icon: Eye, iconColor: 'text-violet-400', bg: 'bg-violet-400/10 border-violet-400/20', title: 'Protected Vault Review', desc: 'Creator uploads deliverables directly to the Vault. Dynamic forensic watermarks protect designs and code, permitting complete client inspection without theft risk.' },
            { num: '03', icon: CheckCircle2, iconColor: 'text-lime-400', bg: 'bg-lime-400/10 border-lime-400/20', title: 'One-Click Atomic Settlement', desc: 'Client approves deliverable. Escrow releases 97.5% net cash to creator, unwatermarked master files unlock for client, and immutable audit logs record the transaction.' },
          ].map(({ num, icon: Icon, iconColor, bg, title, desc }, i) => (
            <Reveal key={i} delay={i * 80}>
              <div className="group p-7 rounded-3xl bg-[#0f0f0f] border border-white/5 hover:border-white/15 hover:-translate-y-1.5 transition-all duration-300 h-full space-y-4">
                <div className="flex items-center justify-between">
                  <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${iconColor}`} />
                  </div>
                  <span className="text-xs font-black text-zinc-500 font-mono">{num}</span>
                </div>
                <h3 className="text-base font-black text-white leading-tight">{title}</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">{desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ===== SECURITY BENTO ===== */}
      <Reveal>
        <section className="relative z-10 py-6 px-5 max-w-6xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { icon: Fingerprint, label: 'Forensic Watermarks', sub: 'IP and timestamp logged on every preview', color: 'text-cyan-400' },
              { icon: Shield, label: 'Pre-Pinned Routing', sub: 'Beneficiary destination locked on day one', color: 'text-violet-400' },
              { icon: Scale, label: '72hr Arbitration', sub: 'Certified neutral panel dispute resolution', color: 'text-fuchsia-400' },
              { icon: Zap, label: 'Instant Settlement', sub: 'Automated disbursement upon release', color: 'text-lime-400' },
            ].map(({ icon: Icon, label, sub, color }, i) => (
              <div key={i} className="p-5 rounded-2xl bg-[#0f0f0f] border border-white/5 hover:border-white/10 transition text-center space-y-2">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mx-auto">
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>
                <div className="text-xs font-black text-white">{label}</div>
                <div className="text-[10px] text-zinc-500">{sub}</div>
              </div>
            ))}
          </div>
        </section>
      </Reveal>

      {/* ===== FEE CALCULATOR ===== */}
      <Reveal>
        <section id="fee-calc" className="relative z-10 py-16 px-5 max-w-6xl mx-auto">
          <div className="p-8 sm:p-12 rounded-3xl bg-[#0f0f0f] border border-white/5 space-y-8">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
              <div className="space-y-2">
                <span className="text-[11px] font-black uppercase tracking-widest text-zinc-400 flex items-center gap-1.5">
                  <Calculator className="w-3.5 h-3.5" /> Protocol Fee Calculator
                </span>
                <h2 className="text-3xl sm:text-5xl font-black tracking-tighter leading-[1]">
                  Calculate your{' '}
                  <span className="bg-gradient-to-r from-lime-300 to-emerald-300 bg-clip-text text-transparent">net earnings</span>{' '}
                  advantage.
                </h2>
                <p className="text-sm text-zinc-400 max-w-sm">ViewBook takes 2.5% flat. Compare directly with legacy 20% platform commissions.</p>
              </div>

              <div className="p-5 rounded-2xl bg-black/50 border border-white/5 space-y-3 min-w-[280px]">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-zinc-400 font-bold">Project Value</span>
                  <span className="font-black text-lime-300 text-base">{formatCurrency(projectAmount)}</span>
                </div>
                <input type="range" min="1000" max="40000" step="500" value={projectAmount}
                  onChange={(e) => setProjectAmount(Number(e.target.value))}
                  className="w-full accent-lime-400 cursor-pointer" />
                <div className="flex justify-between text-[10px] font-mono text-zinc-500">
                  <span>$1k</span><span>$20k</span><span>$40k</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* ViewBook */}
              <div className="relative p-6 rounded-2xl bg-black/60 border-2 border-lime-400/40 space-y-3 overflow-hidden">
                <div className="absolute top-4 right-4 px-2 py-0.5 rounded-full bg-lime-400 text-zinc-950 text-[9px] font-black uppercase tracking-widest">Recommended</div>
                <span className="text-[10px] font-black tracking-widest text-lime-400 uppercase">ViewBook Protocol (2.5%)</span>
                <div>
                  <div className="text-xs text-zinc-400 font-mono mb-1">You Take Home:</div>
                  <div className="text-4xl font-black font-mono text-lime-300 tabular-nums">{formatCurrency(viewBookTakeHome)}</div>
                  <div className="text-xs text-zinc-500 font-mono mt-1">Platform fee: only {formatCurrency(viewBookFee)}</div>
                </div>
                <div className="text-xs font-black text-lime-400 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4" /> +{formatCurrency(extraCash)} additional income vs Upwork
                </div>
              </div>

              {/* Upwork */}
              <div className="p-6 rounded-2xl bg-black/40 border border-white/5 space-y-3">
                <span className="text-[10px] font-black tracking-widest text-red-400 uppercase">Legacy Platforms (20%)</span>
                <div>
                  <div className="text-xs text-zinc-500 font-mono mb-1">You Take Home:</div>
                  <div className="text-4xl font-black font-mono text-zinc-400 tabular-nums line-through">{formatCurrency(upworkTakeHome)}</div>
                  <div className="text-xs text-red-400 font-mono mt-1">Commission deducted: -{formatCurrency(upworkFee)}</div>
                </div>
                <div className="text-xs text-zinc-500 font-medium">Lost to marketplace commissions and withdrawal friction.</div>
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      {/* ===== VAULT DEMO ===== */}
      <Reveal>
        <section id="vault" className="relative z-10 py-16 px-5 max-w-6xl mx-auto">
          <div className="mb-8">
            <span className="text-[11px] font-black uppercase tracking-widest text-zinc-400">Vault Preview Sandbox</span>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tighter mt-2 leading-[1]">
              Test right-click DRM protection{' '}
              <span className="text-zinc-500">in real time.</span>
            </h2>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl bg-[#0f0f0f] border border-white/5 space-y-5">
            {/* Tabs */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/5">
              <div className="flex items-center gap-2">
                {([
                  { key: 'design', label: 'Figma UI Design', icon: ImageIcon, active: 'bg-violet-500/10 text-violet-300 border-violet-500/30' },
                  { key: 'code',   label: 'Source Code',     icon: Code2, active: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30' },
                  { key: 'video',  label: '4K Render File',  icon: Play, active: 'bg-fuchsia-500/10 text-fuchsia-300 border-fuchsia-500/30' },
                ] as const).map(({ key, label, icon: TabIcon, active }) => (
                  <button key={key} onClick={() => setSandboxTab(key)}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-[11px] font-bold border transition ${sandboxTab === key ? active : 'text-zinc-400 border-transparent hover:text-white'}`}>
                    <TabIcon className="w-3.5 h-3.5" />
                    <span>{label}</span>
                  </button>
                ))}
              </div>
              <span className="text-[10px] font-mono font-bold text-zinc-500">
                {sandboxUnlocked ? <span className="text-lime-400">Approved — Master Deliverables Unlocked</span> : <span className="text-violet-400">Vault Review — Forensic DRM Enforced</span>}
              </span>
            </div>

            {/* Canvas */}
            <div
              onContextMenu={(e) => { if (!sandboxUnlocked) { e.preventDefault(); setShowRightClickWarn(true); setTimeout(() => setShowRightClickWarn(false), 2500); } }}
              className="relative p-8 rounded-2xl bg-black border border-white/5 min-h-[180px] flex items-center justify-center overflow-hidden select-none cursor-not-allowed"
            >
              {!sandboxUnlocked && (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-20">
                  <div className="rotate-[-14deg] text-center opacity-[0.18] space-y-1">
                    <div className="text-2xl sm:text-4xl font-black text-red-400 tracking-widest uppercase">VIEWBOOK FORENSIC PREVIEW</div>
                    <div className="text-[10px] font-mono text-red-300 tracking-widest">UNLICENSED • CLIENT-ID: AV-8942 • SHA-256 HASH VERIFIED</div>
                  </div>
                </div>
              )}
              {showRightClickWarn && (
                <div className="absolute top-4 right-4 z-30 p-3 rounded-xl bg-red-950 border border-red-500/60 text-red-200 text-xs flex items-center gap-2 shadow-2xl">
                  <AlertOctagon className="w-4 h-4 text-red-400 shrink-0" />
                  Right-click disabled by ViewBook DRM until milestone approval.
                </div>
              )}
              <div className="text-center space-y-1.5 relative z-10 font-mono text-xs text-zinc-400">
                {sandboxTab === 'design' && (<><ImageIcon className="w-8 h-8 text-violet-400 mx-auto mb-2" /><p className="font-black text-white text-sm">Design_System_Master_v2.fig (142 MB)</p><p className="text-zinc-500 text-[11px]">32 screens • Auto-layout • Design tokens</p></>)}
                {sandboxTab === 'code' && (<><Code2 className="w-8 h-8 text-cyan-400 mx-auto mb-2" /><p className="font-black text-white text-sm">api-payment-gateway.ts (SHA-256: 7f83b1…)</p><p className="text-zinc-500 text-[11px]">Production TypeScript • 100% test coverage</p></>)}
                {sandboxTab === 'video' && (<><Play className="w-8 h-8 text-fuchsia-400 mx-auto mb-2 fill-fuchsia-400/20" /><p className="font-black text-white text-sm">3D_Commercial_4K.mov (1.2 GB)</p><p className="text-zinc-500 text-[11px]">ProRes 4444 • 60fps • Master audio</p></>)}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-zinc-400">Try right-clicking inside the preview box above to test protection.</span>
              {!sandboxUnlocked ? (
                <button onClick={() => { setSandboxUnlocked(true); confetti({ particleCount: 90, spread: 75, colors: ['#a3e635', '#38bdf8'] }); }}
                  className="px-5 py-2.5 rounded-xl text-xs font-black bg-lime-400 hover:bg-lime-300 text-zinc-950 transition hover:scale-[1.04] active:scale-95 font-mono">
                  Simulate Client Approval &amp; Release
                </button>
              ) : (
                <button onClick={() => setSandboxUnlocked(false)} className="text-xs text-zinc-400 hover:text-white font-mono hover:underline transition">Reset to Locked State</button>
              )}
            </div>
          </div>
        </section>
      </Reveal>

      {/* ===== TESTIMONIALS ===== */}
      <Reveal>
        <section className="relative z-10 py-16 px-5 max-w-6xl mx-auto">
          <div className="mb-10">
            <span className="text-[11px] font-black uppercase tracking-widest text-zinc-400">Verified User Feedback</span>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tighter mt-2 leading-[1]">
              Trusted by high-ticket
              <span className="bg-gradient-to-r from-amber-300 to-orange-400 bg-clip-text text-transparent"> freelancers &amp; agencies.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { quote: 'I used to chase clients for weeks on wire releases. ViewBook locks funds before work starts — complete peace of mind.', name: 'Ravi Mehta', role: 'Full-Stack Systems Architect' },
              { quote: 'Delivered our design sprint in the forensic vault. Client reviewed securely, approved within two hours, and payment was instant.', name: 'Sofia Álvarez', role: 'Product & Brand Design Director' },
              { quote: 'The 2.5% fee saves our studio thousands per quarter compared to legacy marketplaces. Beneficiary routing ensures payouts always reach our account.', name: 'James Okafor', role: '3D & Motion Agency Lead' },
            ].map(({ quote, name, role }, i) => (
              <div key={i} className="p-6 rounded-3xl bg-[#0f0f0f] border border-white/5 hover:border-white/10 hover:-translate-y-1 transition-all duration-300 space-y-4">
                <div className="flex gap-0.5 mb-2">
                  {[...Array(5)].map((_, j) => <Star key={j} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />)}
                </div>
                <p className="text-sm text-zinc-300 leading-relaxed">"{quote}"</p>
                <div>
                  <span className="text-xs font-black text-white block">{name}</span>
                  <span className="text-[10px] text-zinc-500">{role}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </Reveal>

      {/* ===== FAQ ===== */}
      <Reveal>
        <section id="faq" className="relative z-10 py-16 px-5 max-w-4xl mx-auto">
          <div className="mb-10">
            <span className="text-[11px] font-black uppercase tracking-widest text-zinc-400">Frequently Asked Questions</span>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tighter mt-2 leading-[1]">
              Protocol architecture
              <span className="text-zinc-500"> &amp; mechanics.</span>
            </h2>
          </div>

          <div className="space-y-2">
            {[
              { q: 'Where are client funds held during an active milestone?', a: 'Funds are held in an isolated FBO (For Benefit Of) multi-signature trust ledger. Neither client nor freelancer can unilaterally move funds until milestone deliverables are approved or resolved via certified arbitration.' },
              { q: 'Can a client screenshot or copy raw files without approving payment?', a: 'All deliverables in Vault Review are dynamically protected with forensic watermarks containing the viewer’s client ID, IP, and timestamp. Direct code copy, DOM extraction, and right-click downloading are blocked. Raw unwatermarked assets strictly return HTTP 403 until released.' },
              { q: 'Can an attacker divert payout funds to an external account?', a: 'No. ViewBook enforces Pre-Pinned Beneficiary Routing: the creator’s verified payout address is immutably set upon contract creation. Even if a client account is compromised, released funds can only settle to the verified creator destination.' },
              { q: 'Why is the platform fee only 2.5%?', a: 'Legacy platforms maintain massive sales organizations and customer lock-in algorithms. ViewBook functions as a high-efficiency escrow protocol focusing purely on smart custody, DRM preview hosting, and neutral dispute resolution.' },
              { q: 'How are milestone disputes resolved?', a: 'Either party can trigger dispute review. A certified arbitrator from the ViewBook Trust Bureau inspects deliverable versions and cryptographic logs within 72 hours to render a binding resolution.' },
            ].map((item, idx) => (
              <div key={idx} className="rounded-2xl border border-white/5 bg-[#0f0f0f] overflow-hidden">
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between text-sm font-black text-white hover:text-lime-300 transition"
                >
                  <span>{item.q}</span>
                  <ChevronDown className={`w-4 h-4 text-zinc-500 transition-transform duration-300 ${activeFaq === idx ? 'rotate-180 text-lime-400' : ''}`} />
                </button>
                <div style={{ maxHeight: activeFaq === idx ? '200px' : '0', overflow: 'hidden', transition: 'max-height 0.35s ease' }}>
                  <div className="px-5 pb-5 text-xs text-zinc-400 leading-relaxed pt-2 border-t border-white/5">{item.a}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </Reveal>

      {/* ===== FINAL CTA ===== */}
      <Reveal>
        <section className="relative z-10 py-20 px-5 max-w-6xl mx-auto">
          <div className="relative p-10 sm:p-20 rounded-3xl overflow-hidden text-center border border-white/5">
            {/* bg */}
            <div className="absolute inset-0 bg-[#0f0f0f]" />
            <div className="absolute inset-0 bg-gradient-to-br from-lime-400/10 via-transparent to-violet-500/10" />
            <div className="absolute -top-1/2 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-lime-400/8 blur-[120px] rounded-full" />

            <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
              <span className="text-[11px] font-black uppercase tracking-widest text-zinc-400">Launch Your Escrow Contract</span>
              <h2 className="text-4xl sm:text-7xl font-black tracking-tighter leading-[0.9]">
                Stop working without proof.{' '}
                <span className="block bg-gradient-to-r from-lime-300 to-emerald-300 bg-clip-text text-transparent">Stop paying without protection.</span>
              </h2>
              <p className="text-sm text-zinc-400 max-w-sm mx-auto">The zero-theft escrow platform built for professional creators and clients.</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button onClick={onLaunchApp} className="group w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl text-sm font-black text-zinc-950 bg-lime-400 hover:bg-lime-300 shadow-2xl shadow-lime-400/20 transition hover:-translate-y-0.5 active:scale-[0.97]">
                  <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
                  Open Escrow Console
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
                <Link href="/c/CTR-8942" className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-4 rounded-2xl text-sm font-bold bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/8 transition">
                  <Eye className="w-4 h-4 text-zinc-400" />
                  View Client Portal Demo
                  <ArrowUpRight className="w-3.5 h-3.5 text-zinc-500" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      {/* ===== FOOTER ===== */}
      <footer className="relative z-10 border-t border-white/5 py-8 px-5">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-lime-400 flex items-center justify-center text-zinc-950">
              <ShieldCheck className="w-3.5 h-3.5 stroke-[3]" />
            </div>
            <span className="text-sm font-black tracking-tighter">View<span className="text-lime-400">Book</span></span>
            <span className="text-zinc-500 font-mono text-xs">— Sovereign Escrow Protocol</span>
          </div>
          <div className="flex items-center gap-5 text-[10px] font-black uppercase tracking-widest text-zinc-500">
            <span>2.5% Flat Rate</span><span>·</span><span>Zero Deposit Fee</span><span>·</span><span>Forensic DRM Vault</span><span>·</span><span>72hr Arbitration</span>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-5 pt-5 border-t border-white/[0.03] text-center text-[10px] text-zinc-600 font-mono">
          ViewBook is a demonstration escrow protocol. All transactions are simulated for verification.
        </div>
      </footer>
    </div>
  );
};
