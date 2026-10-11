'use client';

import React, { useState } from 'react';
import { useEscrow } from '@/context/EscrowContext';
import { AlertTriangle, X, ShieldAlert, Scale } from 'lucide-react';

export const DisputeModal: React.FC = () => {
  const { disputeModal, closeDisputeModal, disputeMilestone } = useEscrow();

  const [reason, setReason] = useState(
    'Deliverable does not satisfy the specified acceptance criteria.'
  );
  const [details, setDetails] = useState('');

  if (!disputeModal) return null;

  const presetReasons = [
    'Deliverable does not satisfy the specified acceptance criteria.',
    'Deliverable has functional bugs or missing components.',
    'Missed delivery deadline with prolonged lack of communication.',
    'Unreasonable revision demands beyond agreed contract scope.',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fullReason = details.trim() ? `${reason} Details: ${details}` : reason;
    disputeMilestone(disputeModal.contractId, disputeModal.milestoneId, fullReason);
    closeDisputeModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">
                Escalate to Dispute Arbitration
              </h3>
              <p className="text-xs text-slate-400">Milestone: {disputeModal.milestoneId}</p>
            </div>
          </div>
          <button
            onClick={closeDisputeModal}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="p-3.5 rounded-2xl bg-rose-950/30 border border-rose-900/40 flex items-start gap-3">
            <Scale className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div className="text-xs text-rose-200 leading-relaxed">
              <strong>Arbitration Freeze Notice:</strong> Escrow funds and deliverables will be locked.
              The ViewBook Trust Bureau will review immutable timestamps, cryptographic upload hashes,
              and communications to deliver an impartial ruling.
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-300">Dispute Reason</label>
            <div className="space-y-1.5">
              {presetReasons.map((preset, idx) => (
                <label
                  key={idx}
                  className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs cursor-pointer transition ${
                    reason === preset
                      ? 'bg-rose-500/10 text-rose-300 border-rose-500/40 font-medium'
                      : 'bg-slate-950/70 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  <input
                    type="radio"
                    name="disputeReason"
                    checked={reason === preset}
                    onChange={() => setReason(preset)}
                    className="text-rose-500 focus:ring-0"
                  />
                  <span>{preset}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">
              Additional Details / Evidence (Optional)
            </label>
            <textarea
              rows={3}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Explain the specific discrepancy or breakdown..."
              className="w-full p-3 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-rose-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={closeDisputeModal}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-rose-500 hover:bg-rose-400 text-white transition shadow-sm"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Submit for Arbitration</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};