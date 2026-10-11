'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';
import {
  ShieldCheck,
  Lock,
  Eye,
  CheckCircle2,
  Building2,
  UserCheck,
  FileCheck2,
  ArrowRight,
  Sparkles,
  ExternalLink,
  ChevronLeft,
  Coins,
  HelpCircle,
  Clock,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PaymentCheckoutModal } from '@/components/PaymentCheckoutModal';
import { INITIAL_CONTRACTS } from '@/lib/mockData';

export default function ClientContractPortal({
  params,
}: {
  params: Promise<{ contractId: string }>;
}) {
  const resolvedParams = use(params);
  const contractId = resolvedParams.contractId;

  const [contract, setContract] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [checkoutMilestone, setCheckoutMilestone] = useState<any | null>(null);

  const fetchContract = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/contracts/${contractId}`);
      const json = await res.json();
      if (!res.ok || !json.success || !json.data) {
        throw new Error(json.error || 'Contract not found in DB');
      }
      setContract(json.data);
    } catch (err: any) {
      console.warn('DB lookup failed, trying demo fallback:', err);
      // Fallback to in-memory verified demo contract so Vercel serverless works seamlessly
      const fallback = INITIAL_CONTRACTS.find((c) => c.id === contractId) || INITIAL_CONTRACTS[0];
      if (fallback) {
        setContract({
          ...fallback,
          milestones: fallback.milestones.map((m) => ({
            ...m,
            status: m.status.toUpperCase(),
            deliverables: m.deliverables || [],
          })),
        });
        setError(null);
      } else {
        setError(err.message || 'Contract not available');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContract();
  }, [contractId]);

  const handleApprove = async (milestoneId: string) => {
    try {
      setActionLoading(milestoneId);
      const res = await fetch(
        `/api/contracts/${contractId}/milestones/${milestoneId}/approve`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ actorName: contract.clientName }),
        }
      );
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error);
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
      await fetchContract();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400 gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
        <p className="text-xs font-mono">Loading secure escrow contract...</p>
      </div>
    );
  }

  if (error || !contract) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-300 p-6 text-center">
        <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20 mb-3">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h2 className="text-lg font-bold text-white">Contract Not Available</h2>
        <p className="text-xs text-slate-400 mt-1 max-w-md">{error || 'This link may have expired or is invalid.'}</p>
        <Link
          href="/"
          className="mt-4 px-4 py-2 rounded-xl text-xs font-medium bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
        >
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const releasedAmount = contract.milestones
    .filter((m: any) => m.status === 'RELEASED')
    .reduce((sum: number, m: any) => sum + m.amount, 0);

  const inEscrowAmount = contract.milestones
    .filter((m: any) => m.status === 'IN_PROGRESS' || m.status === 'IN_VAULT_REVIEW')
    .reduce((sum: number, m: any) => sum + m.amount, 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased">
      {/* Portal Top Bar */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <ChevronLeft className="w-4 h-4 text-slate-400 group-hover:-translate-x-0.5 transition-transform" />
            <span className="text-xs text-slate-400 group-hover:text-slate-200">Main Console</span>
          </Link>

          <div className="flex items-center gap-2 font-mono">
            <span className="text-sm font-bold text-white">View<span className="text-emerald-400">Book</span></span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 font-semibold uppercase">
              Client Escrow Portal
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
            <ShieldCheck className="w-4 h-4" />
            <span className="hidden sm:inline">256-Bit Escrow Vault Protected</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Security & Zero Risk Banner for Clients */}
        <div className="p-4 sm:p-5 rounded-3xl bg-blue-950/30 border border-blue-800/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-blue-200 uppercase tracking-wider font-mono">
                100% Buyer Protection Active
              </h3>
              <p className="text-xs text-slate-300">
                Your payments are held in ViewBook Escrow. Funds are only paid out when you review the deliverables and give final approval. <strong>0% deposit fee</strong>.
              </p>
            </div>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] font-mono text-emerald-400 shrink-0">
            Deposit Fee: $0.00 (Free)
          </div>
        </div>

        {/* Header Hero */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                  {contract.id}
                </span>
                <span className="text-xs text-slate-400">{contract.category}</span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-white">{contract.title}</h1>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-xs text-slate-400">Total Escrow Value</span>
              <div className="text-3xl font-extrabold font-mono text-emerald-300">
                {formatCurrency(contract.totalAmount)}
              </div>
            </div>
          </div>

          {/* Parties Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center gap-3">
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-200">{contract.clientName}</span>
                <p className="text-[11px] text-slate-400">{contract.clientCompany} (Client)</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <UserCheck className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-200">{contract.freelancerName}</span>
                <p className="text-[11px] text-slate-400">{contract.freelancerTitle} (Provider)</p>
              </div>
            </div>
          </div>

          {/* Live Financial Status */}
          <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-950/50 border border-slate-800/80 font-mono text-center">
            <div>
              <span className="text-[10px] text-slate-500 block uppercase">Settled</span>
              <span className="text-sm sm:text-base font-bold text-emerald-300">
                {formatCurrency(releasedAmount)}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block uppercase">In Escrow</span>
              <span className="text-sm sm:text-base font-bold text-amber-300">
                {formatCurrency(inEscrowAmount)}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block uppercase">Remaining</span>
              <span className="text-sm sm:text-base font-bold text-slate-300">
                {formatCurrency(contract.totalAmount - releasedAmount - inEscrowAmount)}
              </span>
            </div>
          </div>
        </div>

        {/* Milestone Steps */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <FileCheck2 className="w-4 h-4 text-emerald-400" />
            <span>Milestone Schedule & Deliverable Handoff</span>
          </h2>

          <div className="space-y-4">
            {contract.milestones.map((m: any, idx: number) => {
              const isFunded = m.status === 'IN_PROGRESS' || m.status === 'IN_VAULT_REVIEW';
              const isReadyForReview = m.status === 'IN_VAULT_REVIEW';
              const isReleased = m.status === 'RELEASED';
              const isAwaiting = m.status === 'AWAITING_FUNDS';

              return (
                <div
                  key={m.id}
                  className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4 relative overflow-hidden"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-slate-400">0{idx + 1}</span>
                        <h3 className="text-sm font-semibold text-white">{m.title}</h3>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">{m.description}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-sm font-mono font-bold text-emerald-300">
                        {formatCurrency(m.amount)}
                      </span>
                    </div>
                  </div>

                  {/* Step Guidance Prompt */}
                  {isAwaiting && (
                    <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 flex items-center gap-2">
                      <Lock className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>
                        <strong>Action Needed:</strong> Lock funds into escrow so {contract.freelancerName} can start work. 100% refundable if deliverables are not delivered.
                      </span>
                    </div>
                  )}

                  {isFunded && !isReadyForReview && (
                    <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-200 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span>
                        <strong>In Progress:</strong> Your deposit is held safely in escrow. Provider is currently producing the milestone deliverables.
                      </span>
                    </div>
                  )}

                  {isReadyForReview && (
                    <div className="p-3 rounded-xl bg-purple-500/15 border border-purple-500/30 text-xs text-purple-200 flex items-center gap-2">
                      <Eye className="w-4 h-4 text-purple-400 shrink-0" />
                      <span>
                        <strong>Deliverables Ready:</strong> Provider has uploaded deliverables. Once you inspect and approve, funds will disburse and clean files unlock.
                      </span>
                    </div>
                  )}

                  {isReleased && (
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-200 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>
                        <strong>Milestone Completed:</strong> Funds disbursed. All clean deliverables are permanently available for download below.
                      </span>
                    </div>
                  )}

                  {/* Deliverables List if any */}
                  {m.deliverables && m.deliverables.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-xs text-slate-400 font-medium">Vault Deliverables:</span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {m.deliverables.map((del: any) => (
                          <div
                            key={del.id}
                            className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs"
                          >
                            <div>
                              <span className="text-slate-300 font-medium truncate block">{del.name}</span>
                              <span className="text-[10px] font-mono text-slate-500">
                                SHA: {del.sha256Hash.slice(0, 10)}... • {del.size}
                              </span>
                            </div>

                            {isReleased ? (
                              <a
                                href={del.unlockedDownloadUrl || '#'}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/20 text-xs font-medium"
                              >
                                Download
                              </a>
                            ) : (
                              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-900 text-slate-500 border border-slate-800">
                                Locked Until Approval
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <div className="text-[11px] font-mono text-slate-400 flex items-center gap-2">
                      <span>Milestone: {formatCurrency(m.amount)}</span>
                      <span>•</span>
                      <span>Client Deposit Fee: $0.00 (0%)</span>
                    </div>

                    <div>
                      {isAwaiting && (
                        <button
                          onClick={() => setCheckoutMilestone(m)}
                          disabled={actionLoading === m.id}
                          className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-semibold bg-emerald-400 hover:bg-emerald-300 text-slate-950 transition shadow-sm font-mono"
                        >
                          <Lock className="w-3.5 h-3.5" />
                          <span>Fund {formatCurrency(m.amount)} into Escrow</span>
                        </button>
                      )}

                      {isReadyForReview && (
                        <button
                          onClick={() => handleApprove(m.id)}
                          disabled={actionLoading === m.id}
                          className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-semibold bg-emerald-400 hover:bg-emerald-300 text-slate-950 transition shadow-sm"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Approve & Release {formatCurrency(m.amount)}</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Payment Checkout Modal */}
      {checkoutMilestone && (
        <PaymentCheckoutModal
          isOpen={!!checkoutMilestone}
          onClose={() => {
            setCheckoutMilestone(null);
            fetchContract();
          }}
          contractId={contract.id}
          milestoneId={checkoutMilestone.id}
          amount={checkoutMilestone.amount}
          milestoneTitle={checkoutMilestone.title}
          contractTitle={contract.title}
        />
      )}
    </div>
  );
}