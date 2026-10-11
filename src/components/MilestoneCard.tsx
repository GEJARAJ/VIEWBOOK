'use client';

import React, { useState } from 'react';
import { Milestone, Contract, DeliverableFile } from '@/types/escrow';
import { useEscrow } from '@/context/EscrowContext';
import { useAuth } from '@/context/AuthContext';
import { formatCurrency } from '@/lib/utils';
import { PaymentCheckoutModal } from './PaymentCheckoutModal';
import {
  Lock,
  ShieldCheck,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Upload,
  ArrowDownToLine,
  FileCode,
  FileImage,
  FileText,
  Binary,
  Fingerprint,
  Scale,
  Coins,
  Info,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

interface MilestoneCardProps {
  milestone: Milestone;
  contract: Contract;
  index: number;
}

export const MilestoneCard: React.FC<MilestoneCardProps> = ({
  milestone,
  contract,
  index,
}) => {
  const { currentUser } = useAuth();
  const {
    approveMilestone,
    openVault,
    openUploadModal,
    openDisputeModal,
    resolveDispute,
  } = useEscrow();

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [showFeeDetails, setShowFeeDetails] = useState(false);

  const role = currentUser?.role?.toLowerCase() || 'client';

  const platformFee = milestone.amount * 0.025;
  const creatorNet = milestone.amount * 0.975;

  const getFileIcon = (type: DeliverableFile['type']) => {
    switch (type) {
      case 'code':
        return <FileCode className="w-4 h-4 text-cyan-400" />;
      case 'image':
        return <FileImage className="w-4 h-4 text-emerald-400" />;
      case 'document':
        return <FileText className="w-4 h-4 text-purple-400" />;
      default:
        return <Binary className="w-4 h-4 text-slate-400" />;
    }
  };

  // Plain-English, role-tailored workflow status advice
  const renderWorkflowGuidance = () => {
    if (role === 'client') {
      switch (milestone.status) {
        case 'awaiting_funds':
          return (
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs flex items-start gap-2.5">
              <span className="p-1 rounded-md bg-amber-500/20 text-amber-300 font-mono text-[10px] font-bold shrink-0 mt-0.5">
                STEP 1
              </span>
              <div className="text-amber-200">
                <strong className="text-amber-100 font-semibold">Your Action Required:</strong> Deposit{' '}
                <span className="font-mono font-bold text-amber-300">{formatCurrency(milestone.amount)}</span> into smart escrow. Your funds are protected and refundable until you inspect and approve the work.
              </div>
            </div>
          );
        case 'in_progress':
          return (
            <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-xs flex items-start gap-2.5">
              <span className="p-1 rounded-md bg-cyan-500/20 text-cyan-300 font-mono text-[10px] font-bold shrink-0 mt-0.5">
                STEP 2
              </span>
              <div className="text-cyan-200">
                <strong className="text-cyan-100 font-semibold">Escrow Secured:</strong> Freelancer {contract.freelancerName} is developing this milestone. Your money is locked in escrow and will not be touched.
              </div>
            </div>
          );
        case 'in_vault_review':
          return (
            <div className="p-3 rounded-xl bg-purple-500/15 border border-purple-500/30 text-xs flex items-start gap-2.5">
              <span className="p-1 rounded-md bg-purple-500/20 text-purple-300 font-mono text-[10px] font-bold shrink-0 mt-0.5">
                STEP 3
              </span>
              <div className="text-purple-200">
                <strong className="text-purple-100 font-semibold">Action Required:</strong> Deliverables submitted! Click <strong className="text-white">"Vault"</strong> to inspect with theft-proof watermarks. When fully satisfied, click <strong className="text-white">"Approve & Disburse"</strong> to unlock clean downloads.
              </div>
            </div>
          );
        case 'released':
          return (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div className="text-emerald-200">
                <strong className="text-emerald-100 font-semibold">Milestone Settled:</strong> Funds have been disbursed. You have full permanent access to download original clean files below.
              </div>
            </div>
          );
        case 'disputed':
          return (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div className="text-rose-200">
                <strong className="text-rose-100 font-semibold">Arbitration Active:</strong> ViewBook Trust Bureau is reviewing dispute evidence and project deliverables.
              </div>
            </div>
          );
      }
    }

    if (role === 'freelancer') {
      switch (milestone.status) {
        case 'awaiting_funds':
          return (
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs flex items-start gap-2.5">
              <Lock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div className="text-amber-200">
                <strong className="text-amber-100 font-semibold">Waiting for Client Escrow:</strong> Client has not deposited funds yet. Never begin work until escrow is locked so your payment is 100% guaranteed.
              </div>
            </div>
          );
        case 'in_progress':
          return (
            <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-xs flex items-start gap-2.5">
              <span className="p-1 rounded-md bg-cyan-500/20 text-cyan-300 font-mono text-[10px] font-bold shrink-0 mt-0.5">
                READY
              </span>
              <div className="text-cyan-200">
                <strong className="text-cyan-100 font-semibold">Escrow Guaranteed ({formatCurrency(milestone.amount)}):</strong> When your work is ready, click <strong className="text-white">"Upload Deliverable to Vault"</strong>. Files will be auto-watermarked to prevent client theft.
              </div>
            </div>
          );
        case 'in_vault_review':
          return (
            <div className="p-3 rounded-xl bg-purple-500/15 border border-purple-500/30 text-xs flex items-start gap-2.5">
              <Eye className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
              <div className="text-purple-200">
                <strong className="text-purple-100 font-semibold">Protected in Vault:</strong> Your deliverable is in client review. The client can inspect the watermarked preview, but cannot download raw files until payment is released.
              </div>
            </div>
          );
        case 'released':
          return (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div className="text-emerald-200">
                <strong className="text-emerald-100 font-semibold">Payout Settled!</strong> Net earnings of{' '}
                <span className="font-mono font-bold text-emerald-300">{formatCurrency(creatorNet)}</span> (after 2.5% fee) have been deposited to your withdrawable balance.
              </div>
            </div>
          );
        case 'disputed':
          return (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs flex items-start gap-2.5">
              <Scale className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div className="text-rose-200">
                <strong className="text-rose-100 font-semibold">In Dispute:</strong> Neutral arbitrator is evaluating deliverables and communication history.
              </div>
            </div>
          );
      }
    }

    if (role === 'arbitrator') {
      return (
        <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs flex items-start gap-2.5">
          <Scale className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
          <div className="text-purple-200">
            <strong className="text-purple-100 font-semibold">Arbitrator View:</strong> Milestone status: {milestone.status.toUpperCase()}. Use arbitration buttons below if dispute resolution is needed.
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4 relative overflow-hidden transition hover:border-slate-700/80">
      {/* Milestone Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-7 h-7 rounded-xl bg-slate-800 text-xs font-mono font-bold text-slate-300 border border-slate-700">
            0{index + 1}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-semibold text-white">{milestone.title}</h4>
              <span className="text-[11px] font-mono text-slate-400">({milestone.id})</span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Due: {milestone.dueDate}</p>
          </div>
        </div>

        {/* Milestone Status Badges */}
        <div className="flex items-center gap-2">
          {milestone.status === 'awaiting_funds' && (
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-amber-500/10 text-amber-300 border border-amber-500/20">
              <Lock className="w-3.5 h-3.5 text-amber-400" /> Awaiting Deposit
            </span>
          )}
          {milestone.status === 'in_progress' && (
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" /> Escrow Locked & In Progress
            </span>
          )}
          {milestone.status === 'in_vault_review' && (
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-purple-500/10 text-purple-300 border border-purple-500/20 animate-pulse">
              <Eye className="w-3.5 h-3.5 text-purple-400" /> In Vault Review
            </span>
          )}
          {milestone.status === 'released' && (
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Settled & Unlocked
            </span>
          )}
          {milestone.status === 'disputed' && (
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-rose-500/10 text-rose-300 border border-rose-500/20">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" /> In Arbitration
            </span>
          )}

          {/* Amount Badge */}
          <div className="px-3 py-1 rounded-lg bg-slate-950 font-mono text-sm font-bold text-emerald-300 border border-slate-800">
            {formatCurrency(milestone.amount)}
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-xs text-slate-300 leading-relaxed">{milestone.description}</p>

      {/* Dynamic Action Required Workflow Guidance Box */}
      {renderWorkflowGuidance()}

      {/* Dispute Reason Warning if present */}
      {milestone.status === 'disputed' && milestone.disputeReason && (
        <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-900/60 text-xs text-rose-200 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <div>
            <strong className="font-semibold text-rose-300">Arbitration Incident:</strong>{' '}
            {milestone.disputeReason}
          </div>
        </div>
      )}

      {/* Deliverables Section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-medium flex items-center gap-1">
            <Fingerprint className="w-3.5 h-3.5 text-slate-500" /> Vault Deliverables
          </span>
          {milestone.deliverables && milestone.deliverables.length > 0 ? (
            <span className="text-[11px] text-emerald-400 font-mono">
              {milestone.deliverables.length} item(s) protected by ViewBook Vault
            </span>
          ) : (
            <span className="text-[11px] text-slate-500">No deliverables uploaded yet</span>
          )}
        </div>

        {milestone.deliverables && milestone.deliverables.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {milestone.deliverables.map((del) => (
              <div
                key={del.id}
                className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 shrink-0">
                    {getFileIcon(del.type)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-slate-200 truncate">{del.name}</p>
                    <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono">
                      <span>{del.size}</span>
                      <span>•</span>
                      <span className="truncate" title={del.sha256Hash}>
                        SHA: {del.sha256Hash.slice(0, 10)}...
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {/* Inspect in ViewBook Vault */}
                  <button
                    onClick={() => openVault(contract, milestone, del)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 border border-emerald-500/30 transition"
                    title="Open ViewBook Theft-Proof Vault Preview"
                  >
                    <Eye className="w-3 h-3" />
                    <span>Vault</span>
                  </button>

                  {/* Raw Unlocked Download Button */}
                  {milestone.status === 'released' ? (
                    <a
                      href={del.unlockedDownloadUrl || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border border-blue-500/30 transition"
                      title="Download clean original unwatermarked file"
                    >
                      <ArrowDownToLine className="w-3.5 h-3.5" />
                    </a>
                  ) : (
                    <div
                      className="p-1.5 rounded-lg bg-slate-900 text-slate-600 border border-slate-800 cursor-not-allowed"
                      title="Download Gated: Releases upon milestone approval"
                    >
                      <Lock className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Transparent Financial & Fee Breakdown Accordion */}
      <div className="pt-1">
        <button
          onClick={() => setShowFeeDetails(!showFeeDetails)}
          className="text-[11px] text-slate-400 hover:text-slate-300 flex items-center gap-1 font-mono transition"
        >
          <Coins className="w-3.5 h-3.5 text-emerald-400" />
          <span>Payment & Take-Rate Breakdown</span>
          <span className="text-[9px] text-slate-500">{showFeeDetails ? '▲ Hide' : '▼ View'}</span>
        </button>

        {showFeeDetails && (
          <div className="mt-2 p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div>
              <span className="text-[10px] text-slate-500">Gross Milestone</span>
              <p className="font-mono font-semibold text-slate-200">{formatCurrency(milestone.amount)}</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-500">Client Deposit Fee</span>
              <p className="font-mono font-semibold text-emerald-400">$0.00 (0%)</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-500">ViewBook Fee (2.5%)</span>
              <p className="font-mono font-semibold text-purple-300">{formatCurrency(platformFee)}</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-500">Creator Net Payout</span>
              <p className="font-mono font-semibold text-emerald-300">{formatCurrency(creatorNet)}</p>
            </div>
          </div>
        )}
      </div>

      {/* Action Footer depending on user role and milestone status */}
      <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
        {/* Timeline Metadata */}
        <div className="text-[11px] font-mono text-slate-500 flex items-center gap-3">
          {milestone.escrowFundedAt && (
            <span>Escrow Locked: {milestone.escrowFundedAt}</span>
          )}
          {milestone.releasedAt && <span>Settled: {milestone.releasedAt}</span>}
        </div>

        {/* Dynamic Buttons */}
        <div className="flex items-center gap-2 ml-auto">
          {/* CLIENT ACTIONS */}
          {role === 'client' && (
            <>
              {milestone.status === 'awaiting_funds' && (
                <>
                  <button
                    onClick={() => setIsCheckoutOpen(true)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-400 hover:bg-emerald-300 text-slate-950 transition shadow-sm font-mono"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Fund {formatCurrency(milestone.amount)} into Escrow</span>
                  </button>

                  <PaymentCheckoutModal
                    isOpen={isCheckoutOpen}
                    onClose={() => setIsCheckoutOpen(false)}
                    contractId={contract.id}
                    milestoneId={milestone.id}
                    amount={milestone.amount}
                    milestoneTitle={milestone.title}
                    contractTitle={contract.title}
                  />
                </>
              )}

              {milestone.status === 'in_vault_review' && (
                <>
                  <button
                    onClick={() => openDisputeModal(contract.id, milestone.id)}
                    className="px-3 py-1.5 rounded-xl text-xs font-medium bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 border border-rose-500/30 transition"
                  >
                    Raise Dispute
                  </button>
                  <button
                    onClick={() => approveMilestone(contract.id, milestone.id)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-400 hover:bg-emerald-300 text-slate-950 transition shadow-sm"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Approve & Disburse {formatCurrency(milestone.amount)}</span>
                  </button>
                </>
              )}
            </>
          )}

          {/* FREELANCER ACTIONS */}
          {role === 'freelancer' && (
            <>
              {milestone.status === 'awaiting_funds' && (
                <span className="text-xs text-amber-400 flex items-center gap-1 font-medium">
                  <Lock className="w-3.5 h-3.5" /> Awaiting client deposit before work begins
                </span>
              )}

              {milestone.status === 'in_progress' && (
                <button
                  onClick={() => openUploadModal(contract.id, milestone.id)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-cyan-400 hover:bg-cyan-300 text-slate-950 transition shadow-sm"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Deliverable to Vault</span>
                </button>
              )}

              {milestone.status === 'in_vault_review' && (
                <span className="text-xs text-purple-300 flex items-center gap-1 font-medium">
                  <Eye className="w-3.5 h-3.5" /> Deliverable submitted. Awaiting client approval.
                </span>
              )}
            </>
          )}

          {/* ARBITRATOR ACTIONS */}
          {role === 'arbitrator' && milestone.status === 'disputed' && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => resolveDispute(contract.id, milestone.id, 'client')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 border border-amber-500/30 transition"
              >
                <Scale className="w-3.5 h-3.5" />
                <span>Refund Client</span>
              </button>
              <button
                onClick={() => resolveDispute(contract.id, milestone.id, 'freelancer')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 border border-emerald-500/30 transition"
              >
                <Scale className="w-3.5 h-3.5" />
                <span>Disburse to Freelancer</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};