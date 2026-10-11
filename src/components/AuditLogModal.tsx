'use client';

import React, { useState } from 'react';
import { useEscrow } from '@/context/EscrowContext';
import {
  ScrollText,
  X,
  ShieldCheck,
  Cpu,
  Copy,
  Check,
  Lock,
  Eye,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

export const AuditLogModal: React.FC = () => {
  const { isAuditLogOpen, setIsAuditLogOpen, auditEvents } = useEscrow();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isAuditLogOpen) return null;

  const handleCopy = (sig: string, id: string) => {
    navigator.clipboard.writeText(sig);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getActionBadge = (action: string) => {
    if (action.includes('RELEASED') || action.includes('SETTLED')) {
      return (
        <span className="flex items-center gap-1 text-[10px] font-medium font-mono text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
          <CheckCircle2 className="w-3 h-3" /> {action}
        </span>
      );
    }
    if (action.includes('LOCKED') || action.includes('DEPOSIT')) {
      return (
        <span className="flex items-center gap-1 text-[10px] font-medium font-mono text-amber-400 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
          <Lock className="w-3 h-3" /> {action}
        </span>
      );
    }
    if (action.includes('VAULT') || action.includes('INSPECTED')) {
      return (
        <span className="flex items-center gap-1 text-[10px] font-medium font-mono text-purple-400 px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/20">
          <Eye className="w-3 h-3" /> {action}
        </span>
      );
    }
    if (action.includes('DISPUTE')) {
      return (
        <span className="flex items-center gap-1 text-[10px] font-medium font-mono text-rose-400 px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/20">
          <AlertTriangle className="w-3 h-3" /> {action}
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1 text-[10px] font-medium font-mono text-cyan-400 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
        <Cpu className="w-3 h-3" /> {action}
      </span>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="w-full max-w-4xl max-h-[85vh] flex flex-col bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <ScrollText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-white">
                  Cryptographic Audit Trail
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/60">
                  Immutable
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Timestamped, SHA-256 fingerprinted records of all escrow & deliverable lifecycle events
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsAuditLogOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Security Guarantee Bar */}
        <div className="px-6 py-3 bg-cyan-950/20 border-b border-cyan-900/30 flex items-center justify-between text-xs text-cyan-200">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>
              All signatures are generated using standardized 256-bit hashing and tamper seals.
            </span>
          </div>
          <span className="font-mono text-[11px] text-cyan-300">
            {auditEvents.length} Verified Entries
          </span>
        </div>

        {/* Event List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3.5">
          {auditEvents.map((evt) => (
            <div
              key={evt.id}
              className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2.5 transition hover:border-slate-700"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-slate-400">{evt.id}</span>
                  <span className="text-slate-600">•</span>
                  {getActionBadge(evt.action)}
                  {evt.milestoneId && (
                    <span className="text-[10px] font-mono text-slate-500 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                      {evt.milestoneId}
                    </span>
                  )}
                </div>
                <span className="text-[11px] font-mono text-slate-500">{evt.timestamp}</span>
              </div>

              {/* Details & Contract Title */}
              <div className="space-y-1">
                <p className="text-xs font-medium text-slate-200">{evt.details}</p>
                <div className="text-[11px] text-slate-400 flex items-center gap-2">
                  <span>Contract: {evt.contractTitle}</span>
                  <span>•</span>
                  <span>
                    Actor: <strong className="text-slate-300">{evt.actor}</strong> ({evt.actorRole})
                  </span>
                </div>
              </div>

              {/* Cryptographic SHA-256 Signature */}
              <div className="flex items-center justify-between gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 font-mono text-[11px] text-slate-400">
                <div className="flex items-center gap-2 truncate">
                  <span className="text-slate-500 text-[10px] uppercase font-bold">SHA-256:</span>
                  <span className="truncate text-slate-300">{evt.sha256Signature}</span>
                </div>
                <button
                  onClick={() => handleCopy(evt.sha256Signature, evt.id)}
                  className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-white shrink-0 ml-2"
                  title="Copy Signature"
                >
                  {copiedId === evt.id ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-6 py-3 border-t border-slate-800 bg-slate-950/80">
          <button
            onClick={() => setIsAuditLogOpen(false)}
            className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl transition"
          >
            Close Audit Trail
          </button>
        </div>
      </div>
    </div>
  );
};