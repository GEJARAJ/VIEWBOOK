'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useEscrow } from '@/context/EscrowContext';
import { formatCurrency } from '@/lib/utils';
import { MilestoneCard } from './MilestoneCard';
import {
  ShieldCheck,
  Building2,
  UserCheck,
  FileCheck,
  Clock,
  Lock,
  CheckCircle2,
  FileText,
  Share2,
  ExternalLink,
  Copy,
  Check,
} from 'lucide-react';

export const ContractDetail: React.FC = () => {
  const { selectedContract } = useEscrow();
  const [copiedLink, setCopiedLink] = useState(false);

  if (!selectedContract) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-12 bg-slate-900/40 border border-slate-800 rounded-2xl text-center">
        <ShieldCheck className="w-12 h-12 text-slate-600 mb-3" />
        <h3 className="text-base font-semibold text-white">No Contract Selected</h3>
        <p className="text-xs text-slate-400 mt-1">
          Select an active escrow contract from the left list to view milestone deliverables.
        </p>
      </div>
    );
  }

  const releasedAmount = selectedContract.milestones
    .filter((m) => m.status === 'released')
    .reduce((sum, m) => sum + m.amount, 0);

  const inEscrowAmount = selectedContract.milestones
    .filter((m) => m.status === 'in_progress' || m.status === 'in_vault_review')
    .reduce((sum, m) => sum + m.amount, 0);

  const awaitingAmount = selectedContract.milestones
    .filter((m) => m.status === 'awaiting_funds')
    .reduce((sum, m) => sum + m.amount, 0);

  return (
    <div className="space-y-6">
      {/* Contract Header Card */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                {selectedContract.id}
              </span>
              <span className="text-xs font-medium text-slate-400">
                Created: {selectedContract.createdAt}
              </span>
              <span className="text-xs text-slate-600">•</span>
              <span className="text-xs font-medium text-slate-300">
                {selectedContract.category}
              </span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-white">
              {selectedContract.title}
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {/* Shareable Client Portal Quick Link */}
            <div className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
              <button
                onClick={() => {
                  const url = `${window.location.origin}/c/${selectedContract.id}`;
                  navigator.clipboard.writeText(url);
                  setCopiedLink(true);
                  setTimeout(() => setCopiedLink(false), 2000);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium text-slate-300 hover:text-white hover:bg-slate-900 transition"
                title="Copy shareable link for client onboarding and milestone escrow funding"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied Link</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>Copy Client Link</span>
                  </>
                )}
              </button>

              <Link
                href={`/c/${selectedContract.id}`}
                target="_blank"
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg font-medium text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 transition"
                title="Open client-facing portal in new tab"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Open Portal</span>
              </Link>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-xs text-slate-400">Total Contract Value</span>
              <div className="text-2xl font-bold font-mono text-white">
                {formatCurrency(selectedContract.totalAmount)}
              </div>
            </div>
          </div>
        </div>

        {/* Parties Cards (Client & Freelancer) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {/* Client Info */}
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-slate-200">
                    {selectedContract.clientName}
                  </span>
                  <span className="text-[10px] text-blue-400 bg-blue-500/10 border border-blue-500/20 px-1.5 py-0.2 rounded font-mono">
                    Client
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">{selectedContract.clientCompany}</p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verified</span>
            </div>
          </div>

          {/* Freelancer Info */}
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <UserCheck className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-slate-200">
                    {selectedContract.freelancerName}
                  </span>
                  <span className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.2 rounded font-mono">
                    Provider
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">{selectedContract.freelancerTitle}</p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Top Rated</span>
            </div>
          </div>
        </div>

        {/* Financial Flow Tracker */}
        <div className="grid grid-cols-3 gap-3 pt-1">
          <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800/80">
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Settled / Released
            </span>
            <p className="mt-1 text-base font-bold font-mono text-emerald-300">
              {formatCurrency(releasedAmount)}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800/80">
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <Lock className="w-3 h-3 text-amber-400" /> Currently in Escrow
            </span>
            <p className="mt-1 text-base font-bold font-mono text-amber-300">
              {formatCurrency(inEscrowAmount)}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800/80">
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-400" /> Awaiting Funding
            </span>
            <p className="mt-1 text-base font-bold font-mono text-slate-300">
              {formatCurrency(awaitingAmount)}
            </p>
          </div>
        </div>

        {/* Contract Terms Box */}
        <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/60 text-xs text-slate-400 flex items-start gap-2">
          <FileText className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="text-slate-300">Escrow Agreement Terms: </strong>
            {selectedContract.termsSummary}
          </div>
        </div>
      </div>

      {/* Milestones Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>Milestones & Theft-Proof Deliverables</span>
            <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
              {selectedContract.milestones.length}
            </span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Deliverables are protected by dynamic forensic watermarks until milestone payment release.
          </p>
        </div>
      </div>

      {/* Milestones Cards */}
      <div className="space-y-4">
        {selectedContract.milestones.map((milestone, idx) => (
          <MilestoneCard
            key={milestone.id}
            milestone={milestone}
            contract={selectedContract}
            index={idx}
          />
        ))}
      </div>
    </div>
  );
};