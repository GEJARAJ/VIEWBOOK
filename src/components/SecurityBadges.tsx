'use client';

import React, { useState } from 'react';
import { ShieldCheck, Eye, CheckCircle2, ArrowRight, Coins, Lock, Sparkles } from 'lucide-react';
import { PlatformEconomicsModal } from './PlatformEconomicsModal';

export const SecurityBadges: React.FC = () => {
  const [isEconomicsOpen, setIsEconomicsOpen] = useState(false);

  return (
    <div className="space-y-3">
      {/* 3-Step Zero-Theft Lifecycle Stepper */}
      <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-b from-slate-900/90 via-slate-900/60 to-slate-950 border border-slate-800 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-white font-mono">
                The ViewBook Zero-Theft Protocol
              </h3>
              <p className="text-xs text-slate-400">
                How every milestone is guaranteed in 3 simple, tamper-proof steps
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsEconomicsOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 border border-emerald-500/30 transition shadow-sm font-mono self-start sm:self-auto"
          >
            <Coins className="w-3.5 h-3.5" />
            <span>Developer Fee Model (2.5%)</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* The 3 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {/* Step 1 */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-2 relative overflow-hidden group hover:border-emerald-500/30 transition">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                STEP 01
              </span>
              <Lock className="w-4 h-4 text-amber-400" />
            </div>
            <h4 className="text-xs font-semibold text-white">Client Locks Escrow</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Client funds the milestone via Card or Wallet. Funds enter the ViewBook Smart Escrow before work begins. Creator is <strong>100% guaranteed</strong> to get paid.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-2 relative overflow-hidden group hover:border-purple-500/30 transition">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">
                STEP 02
              </span>
              <Eye className="w-4 h-4 text-purple-400" />
            </div>
            <h4 className="text-xs font-semibold text-white">Theft-Proof Vault Preview</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Creator uploads deliverables. Client inspects work with <strong>dynamic forensic watermarks</strong> and right-click blocks. Raw downloads strictly return <code className="text-purple-300 bg-purple-950/80 px-1 py-0.2 rounded font-mono">403 Locked</code>.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-2 relative overflow-hidden group hover:border-emerald-500/30 transition">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                STEP 03
              </span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <h4 className="text-xs font-semibold text-white">Approve & Atomic Release</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Client approves milestone. Escrow disburses <strong>97.5% net cash</strong> to creator, <strong>2.5% platform fee</strong> to treasury, and decrypts clean unwatermarked files.
            </p>
          </div>
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