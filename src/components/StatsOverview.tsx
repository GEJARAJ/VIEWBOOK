'use client';

import React, { useState } from 'react';
import { useEscrow } from '@/context/EscrowContext';
import { useAuth } from '@/context/AuthContext';
import { formatCurrency } from '@/lib/utils';
import {
  ShieldCheck,
  Lock,
  Coins,
  Percent,
  Layers,
  ArrowRight,
  Info,
  Building2,
  Briefcase,
  Scale,
  Sparkles,
} from 'lucide-react';
import { PlatformEconomicsModal } from './PlatformEconomicsModal';

export const StatsOverview: React.FC = () => {
  const { contracts, auditEvents } = useEscrow();
  const { currentUser, setIsAuthModalOpen } = useAuth();
  const [isEconomicsOpen, setIsEconomicsOpen] = useState(false);

  const totalValue = contracts.reduce((acc, c) => acc + c.totalAmount, 0);

  const totalInEscrow = contracts.reduce((acc, c) => {
    return (
      acc +
      c.milestones
        .filter((m) => m.status === 'in_progress' || m.status === 'in_vault_review')
        .reduce((sum, m) => sum + m.amount, 0)
    );
  }, 0);

  const releasedVolume = contracts.reduce((acc, c) => {
    return (
      acc +
      c.milestones
        .filter((m) => m.status === 'released')
        .reduce((sum, m) => sum + m.amount, 0)
    );
  }, 0);

  const platformFeesEarned = releasedVolume * 0.025; // 2.5% Developer Take-Rate

  const role = currentUser?.role || 'CLIENT';

  return (
    <div className="space-y-4">
      {/* Perspective & Active User Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
            {role === 'CLIENT' && <Building2 className="w-5 h-5" />}
            {role === 'FREELANCER' && <Briefcase className="w-5 h-5" />}
            {role === 'ARBITRATOR' && <Scale className="w-5 h-5" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-sm">
                Signed in as: <span className="text-emerald-400">{currentUser?.name || 'Active User'}</span>
              </span>
              <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border ${
                role === 'CLIENT'
                  ? 'text-blue-400 bg-blue-500/10 border-blue-500/20'
                  : role === 'FREELANCER'
                  ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                  : 'text-purple-400 bg-purple-500/10 border-purple-500/20'
              }`}>
                {role}
              </span>
            </div>
            <p className="text-slate-400 mt-0.5">
              {role === 'CLIENT' &&
                'Your account can fund milestones into smart escrow, inspect watermarked deliverables in the vault, and release payments.'}
              {role === 'FREELANCER' &&
                'You are protected by smart escrow. Upload deliverables into the theft-proof vault and receive instant disbursements.'}
              {role === 'ARBITRATOR' &&
                'Neutral jurisdiction: Review disputed deliverables, inspect cryptographic SHA-256 evidence, and issue binding rulings.'}
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAuthModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition self-start sm:self-auto shrink-0"
        >
          <span>Switch Identity</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 4 Commercial Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Locked in Escrow */}
        <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800/80 shadow-sm relative overflow-hidden group hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Escrow in Custody</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Lock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tracking-tight text-white">
              {formatCurrency(totalInEscrow)}
            </span>
            <span className="text-[11px] text-amber-400 font-medium font-mono">100% Sealed</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">
            Funds cannot be reversed while in development
          </p>
        </div>

        {/* Metric 2: Developer Platform Revenue (2.5%) */}
        <div
          onClick={() => setIsEconomicsOpen(true)}
          className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-900/40 shadow-sm relative overflow-hidden group hover:border-emerald-500/40 cursor-pointer transition"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-emerald-300">Developer Fee Earned</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tracking-tight text-emerald-300">
              {formatCurrency(platformFeesEarned)}
            </span>
            <span className="text-[11px] text-emerald-400 font-medium font-mono">2.5% Take-Rate</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Click to inspect treasury model</span>
            <ArrowRight className="w-3 h-3 text-emerald-400" />
          </p>
        </div>

        {/* Metric 3: Total Platform GMV */}
        <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800/80 shadow-sm relative overflow-hidden group hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Total Secured Volume</span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tracking-tight text-white">
              {formatCurrency(totalValue)}
            </span>
            <span className="text-[11px] text-cyan-400 font-mono">
              {contracts.length} Agreements
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">
            Total gross merchandise value across all contracts
          </p>
        </div>

        {/* Metric 4: Theft Prevention */}
        <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800/80 shadow-sm relative overflow-hidden group hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Theft Prevention</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tracking-tight text-white">
              100.0%
            </span>
            <span className="text-[11px] text-purple-400 font-medium">Zero Leaks</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">
            Dynamic forensic watermarks & server gating
          </p>
        </div>
      </div>

      {/* Economics Modal */}
      <PlatformEconomicsModal
        isOpen={isEconomicsOpen}
        onClose={() => setIsEconomicsOpen(false)}
      />
    </div>
  );
};