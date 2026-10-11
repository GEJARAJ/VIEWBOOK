'use client';

import React, { useState } from 'react';
import { useEscrow } from '@/context/EscrowContext';
import { useAuth } from '@/context/AuthContext';
import { formatCurrency } from '@/lib/utils';
import { HowItWorksModal } from './HowItWorksModal';
import {
  ShieldCheck,
  Lock,
  Wallet,
  ScrollText,
  PlusCircle,
  RotateCcw,
  User,
  Briefcase,
  Scale,
  ExternalLink,
  HelpCircle,
  Globe,
} from 'lucide-react';

interface NavbarProps {
  onToggleLanding?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleLanding }) => {
  const {
    wallet,
    setIsNewContractOpen,
    setIsAuditLogOpen,
    resetDemo,
  } = useEscrow();

  const { currentUser, setIsAuthModalOpen } = useAuth();
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            {onToggleLanding ? (
              <button
                onClick={onToggleLanding}
                className="flex items-center gap-3 text-left group"
                title="Return to Landing Page"
              >
                <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 shadow-lg shadow-emerald-950/40 text-white font-bold group-hover:scale-105 transition-transform">
                  <ShieldCheck className="w-6 h-6" />
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-slate-950 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold tracking-tight text-white font-mono">
                      View<span className="text-emerald-400">Book</span>
                    </span>
                    <span className="px-2 py-0.5 text-[10px] uppercase font-mono tracking-wider font-semibold rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800/60">
                      Escrow Vault
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 hidden sm:block">
                    Theft-Proof Deliverables & Milestone Protection
                  </p>
                </div>
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 shadow-lg shadow-emerald-950/40 text-white font-bold">
                  <ShieldCheck className="w-6 h-6" />
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-slate-950 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold tracking-tight text-white font-mono">
                      View<span className="text-emerald-400">Book</span>
                    </span>
                    <span className="px-2 py-0.5 text-[10px] uppercase font-mono tracking-wider font-semibold rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800/60">
                      Escrow Vault
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 hidden sm:block">
                    Theft-Proof Deliverables & Milestone Protection
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Authenticated User Identity Chip */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="flex items-center gap-2.5 px-3 py-1.5 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl transition group"
              title="Click to switch between Client, Freelancer, and Arbitrator accounts"
            >
              <img
                src={
                  currentUser?.avatarUrl ||
                  `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(currentUser?.name || 'User')}`
                }
                alt={currentUser?.name || 'User'}
                className="w-7 h-7 rounded-full border border-slate-700 object-cover bg-slate-800"
              />
              <div className="text-left hidden md:block">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-white group-hover:text-emerald-400 transition">
                    {currentUser?.name || 'User'}
                  </span>
                  <span
                    className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border ${
                      currentUser?.role === 'CLIENT'
                        ? 'text-blue-400 bg-blue-500/10 border-blue-500/20'
                        : currentUser?.role === 'FREELANCER'
                        ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                        : 'text-purple-400 bg-purple-500/10 border-purple-500/20'
                    }`}
                  >
                    {currentUser?.role || 'CLIENT'}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 truncate max-w-[140px]">
                  {currentUser?.company || currentUser?.email || 'Active Identity'}
                </p>
              </div>
              <span className="text-[11px] text-slate-500 group-hover:text-slate-300 ml-1">▼ Switch</span>
            </button>

            {/* Wallet Info Badge */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-slate-900/90 border border-slate-800 rounded-xl text-xs">
              <Wallet className="w-4 h-4 text-emerald-400" />
              {currentUser?.role === 'CLIENT' && (
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">
                    Wallet:{' '}
                    <strong className="text-emerald-300 font-mono">
                      {formatCurrency(currentUser?.balance || wallet.clientAvailable)}
                    </strong>
                  </span>
                  <span className="text-slate-600">|</span>
                  <span className="text-slate-400 flex items-center gap-1">
                    <Lock className="w-3 h-3 text-amber-400" />
                    In Escrow:{' '}
                    <strong className="text-amber-300 font-mono">
                      {formatCurrency(wallet.clientInEscrow)}
                    </strong>
                  </span>
                </div>
              )}

              {currentUser?.role === 'FREELANCER' && (
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Lock className="w-3 h-3 text-cyan-400" />
                    In Escrow:{' '}
                    <strong className="text-cyan-300 font-mono">
                      {formatCurrency(wallet.freelancerPendingEscrow)}
                    </strong>
                  </span>
                  <span className="text-slate-600">|</span>
                  <span className="text-slate-400">
                    Withdrawable:{' '}
                    <strong className="text-emerald-300 font-mono">
                      {formatCurrency(currentUser?.withdrawable || wallet.freelancerWithdrawable)}
                    </strong>
                  </span>
                </div>
              )}

              {currentUser?.role === 'ARBITRATOR' && (
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">
                    Neutral Bureau:{' '}
                    <strong className="text-purple-300 font-mono">Binding Arbitration</strong>
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Action Tools & Navigation */}
          <div className="flex items-center gap-2.5">
            {/* Toggle Landing Page Button */}
            {onToggleLanding && (
              <button
                onClick={onToggleLanding}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl transition"
                title="Switch back to Landing Page presentation"
              >
                <Globe className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden md:inline">Landing Page</span>
              </button>
            )}

            {/* How It Works Guide Button */}
            <button
              onClick={() => setIsHowItWorksOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-xl transition"
              title="Learn how ViewBook escrow and anti-theft works"
            >
              <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">How It Works</span>
            </button>

            {/* Audit Log Ledger Button */}
            <button
              onClick={() => setIsAuditLogOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-xl transition"
              title="Inspect Cryptographic Audit Trail"
            >
              <ScrollText className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden md:inline">Audit Trail</span>
            </button>

            {/* New Contract Button */}
            <button
              onClick={() => setIsNewContractOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl shadow-sm transition"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>New Contract</span>
            </button>

            {/* Reset Seed Data */}
            <button
              onClick={resetDemo}
              className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 rounded-lg transition"
              title="Reset Demo Data to Initial State"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* How It Works Explainer Modal */}
      <HowItWorksModal
        isOpen={isHowItWorksOpen}
        onClose={() => setIsHowItWorksOpen(false)}
      />
    </header>
  );
};