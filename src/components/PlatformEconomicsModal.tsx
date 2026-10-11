'use client';

import React from 'react';
import { useEscrow } from '@/context/EscrowContext';
import { formatCurrency } from '@/lib/utils';
import {
  Coins,
  X,
  ShieldCheck,
  TrendingUp,
  Percent,
  Layers,
  ArrowUpRight,
  CheckCircle2,
  XCircle,
  Zap,
} from 'lucide-react';

interface PlatformEconomicsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PlatformEconomicsModal: React.FC<PlatformEconomicsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { contracts } = useEscrow();

  if (!isOpen) return null;

  // Calculate live volume and platform fees
  const totalVolume = contracts.reduce((sum, c) => sum + c.totalAmount, 0);

  const releasedVolume = contracts.reduce((sum, c) => {
    return (
      sum +
      c.milestones
        .filter((m) => m.status === 'released')
        .reduce((mSum, m) => mSum + m.amount, 0)
    );
  }, 0);

  const inEscrowVolume = contracts.reduce((sum, c) => {
    return (
      sum +
      c.milestones
        .filter((m) => m.status === 'in_progress' || m.status === 'in_vault_review')
        .reduce((mSum, m) => mSum + m.amount, 0)
    );
  }, 0);

  const platformFeeRate = 0.025; // 2.5%
  const totalFeesEarned = releasedVolume * platformFeeRate;
  const pendingFeesInEscrow = inEscrowVolume * platformFeeRate;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-white">Platform Economics & Developer Treasury</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/60 font-bold">
                  2.5% Take-Rate
                </span>
              </div>
              <p className="text-xs text-slate-400">
                How ViewBook generates sustainable cash flow while saving clients and creators thousands
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Live Treasury Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-medium">Total Platform GMV</span>
                <Layers className="w-3.5 h-3.5 text-slate-500" />
              </div>
              <p className="mt-1 text-xl font-bold font-mono text-white">
                {formatCurrency(totalVolume)}
              </p>
              <span className="text-[10px] text-slate-500">Across {contracts.length} active agreements</span>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-900/40">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-emerald-300 font-medium">Developer Revenue</span>
                <Percent className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <p className="mt-1 text-xl font-bold font-mono text-emerald-300">
                {formatCurrency(totalFeesEarned)}
              </p>
              <span className="text-[10px] text-emerald-400/80 font-mono">
                +{formatCurrency(pendingFeesInEscrow)} pending in escrow
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-medium">Escrow in Custody</span>
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <p className="mt-1 text-xl font-bold font-mono text-amber-300">
                {formatCurrency(inEscrowVolume)}
              </p>
              <span className="text-[10px] text-amber-400/80 font-mono">100% Cryptographically Sealed</span>
            </div>
          </div>

          {/* Value Proposition Callout */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/30 via-slate-900 to-slate-950 border border-emerald-800/40 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-300">
              <Zap className="w-4 h-4 text-emerald-400" />
              <span>Why High-Ticket Agencies & Clients Choose ViewBook</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Traditional marketplaces like Upwork and Fiverr penalize success by seizing <strong>10% to 20%</strong> of every payment without providing deliverable theft protection. ViewBook charges a minimal <strong>2.5% fee</strong> strictly upon successful milestone settlement, saving high-ticket creators thousands while delivering ironclad anti-theft vaults.
            </p>
          </div>

          {/* Comparison Matrix */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-white">Marketplace Fee & Protection Comparison</h4>
            <div className="rounded-2xl border border-slate-800 overflow-hidden text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/80 text-[11px] text-slate-400 font-mono uppercase">
                    <th className="p-3">Platform</th>
                    <th className="p-3">Creator Fee</th>
                    <th className="p-3">Client Fee</th>
                    <th className="p-3">Theft-Proof Vault</th>
                    <th className="p-3">Dispute Speed</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                  <tr className="bg-emerald-950/10 text-emerald-300 font-medium">
                    <td className="p-3 flex items-center gap-1.5 font-bold text-white">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> ViewBook
                    </td>
                    <td className="p-3">2.5% Flat</td>
                    <td className="p-3 text-emerald-400 font-bold">0.0%</td>
                    <td className="p-3 text-emerald-400">Forensic Dynamic Watermark</td>
                    <td className="p-3 text-emerald-400">Instant SHA-256 Logs</td>
                  </tr>
                  <tr className="text-slate-400">
                    <td className="p-3 font-semibold text-slate-300">Upwork</td>
                    <td className="p-3 text-rose-400">10% - 20%</td>
                    <td className="p-3 text-rose-400">3% - 5%</td>
                    <td className="p-3 text-slate-500">None (Raw Downloads)</td>
                    <td className="p-3 text-slate-500">2-4 Weeks</td>
                  </tr>
                  <tr className="text-slate-400">
                    <td className="p-3 font-semibold text-slate-300">Fiverr Pro</td>
                    <td className="p-3 text-rose-400">20.0%</td>
                    <td className="p-3 text-rose-400">5.5%</td>
                    <td className="p-3 text-slate-500">Basic Watermark (Images only)</td>
                    <td className="p-3 text-slate-500">1-3 Weeks</td>
                  </tr>
                  <tr className="text-slate-400">
                    <td className="p-3 font-semibold text-slate-300">Direct Invoicing</td>
                    <td className="p-3">0.0%</td>
                    <td className="p-3">0.0%</td>
                    <td className="p-3 text-rose-400">Zero Protection (100% Theft Risk)</td>
                    <td className="p-3 text-rose-400">Small Claims Court</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Revenue Projection Example */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="text-[11px] font-semibold text-slate-300 flex items-center gap-1.5 font-mono">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> Platform Revenue Scalability Model
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center pt-1 font-mono text-xs">
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800/80">
                <span className="text-[10px] text-slate-500 block">10 Active Agencies</span>
                <span className="text-sm font-bold text-white">$500k Monthly GMV</span>
                <span className="text-[10px] text-emerald-400 block font-bold mt-0.5">$12,500/mo Revenue</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800/80">
                <span className="text-[10px] text-slate-500 block">50 Active Agencies</span>
                <span className="text-sm font-bold text-white">$2.5M Monthly GMV</span>
                <span className="text-[10px] text-emerald-400 block font-bold mt-0.5">$62,500/mo Revenue</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800/80">
                <span className="text-[10px] text-slate-500 block">100 Active Agencies</span>
                <span className="text-sm font-bold text-white">$10.0M Monthly GMV</span>
                <span className="text-[10px] text-emerald-400 block font-bold mt-0.5">$250,000/mo Revenue</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-slate-800 bg-slate-950/80">
          <span className="text-xs text-slate-400 font-mono">
            Automated double-entry smart escrow accounting
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold bg-emerald-400 hover:bg-emerald-300 text-slate-950 rounded-xl transition shadow-sm"
          >
            Close Overview
          </button>
        </div>
      </div>
    </div>
  );
};