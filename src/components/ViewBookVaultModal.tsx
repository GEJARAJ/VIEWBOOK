'use client';

import React, { useState, useEffect } from 'react';
import { useEscrow } from '@/context/EscrowContext';
import { useAuth } from '@/context/AuthContext';
import { formatCurrency } from '@/lib/utils';
import {
  ShieldAlert,
  ShieldCheck,
  X,
  Lock,
  Download,
  AlertTriangle,
  Fingerprint,
  FileCode,
  FileImage,
  FileText,
  EyeOff,
  CheckCircle2,
  Copy,
  Check,
} from 'lucide-react';

export const ViewBookVaultModal: React.FC = () => {
  const { activeVaultItem, closeVault, approveMilestone, openDisputeModal } = useEscrow();
  const { currentUser } = useAuth();
  const role = currentUser?.role?.toLowerCase() || 'client';
  const [copiedHash, setCopiedHash] = useState(false);
  const [shieldActive, setShieldActive] = useState(true);
  const [warningToast, setWarningToast] = useState<string | null>(null);

  useEffect(() => {
    if (warningToast) {
      const timer = setTimeout(() => setWarningToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [warningToast]);

  if (!activeVaultItem) return null;

  const { contract, milestone, file } = activeVaultItem;
  const isReleased = milestone.status === 'released';

  const handleCopyHash = () => {
    navigator.clipboard.writeText(file.sha256Hash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setWarningToast('Anti-Theft Protection Active: Right-click & save functions are disabled.');
  };

  const today = new Date().toISOString().slice(0, 10);
  const watermarkText = `VIEWBOOK SECURE PREVIEW • CLIENT: ${contract.clientName} (${contract.clientCompany}) • DATE: ${today} • HASH: ${file.sha256Hash.slice(0, 12)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div
        onContextMenu={handleContextMenu}
        className="relative w-full max-w-5xl h-[90vh] flex flex-col bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden select-none"
      >
        {/* Warning Toast */}
        {warningToast && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2 bg-rose-950 border border-rose-800 text-rose-200 text-xs font-medium rounded-xl shadow-xl animate-in slide-in-from-top-2">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <span>{warningToast}</span>
          </div>
        )}

        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <EyeOff className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-purple-400">
                  ViewBook Theft-Proof Vault
                </span>
                <span className="text-xs text-slate-500">•</span>
                <span className="text-xs font-mono text-slate-400">
                  {contract.id} / {milestone.id}
                </span>
              </div>
              <h3 className="text-sm font-semibold text-white">{file.name}</h3>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Screen Deterrent Shield Toggle */}
            <button
              onClick={() => setShieldActive(!shieldActive)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition ${
                shieldActive
                  ? 'bg-purple-500/10 text-purple-300 border-purple-500/30'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                Forensic Watermark: {shieldActive ? 'Active' : 'Muted'}
              </span>
            </button>

            {/* Close Modal */}
            <button
              onClick={closeVault}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Security Warning Banner */}
        <div className="px-6 py-2.5 bg-purple-950/30 border-b border-purple-900/40 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-purple-200">
            <Fingerprint className="w-4 h-4 text-purple-400 shrink-0" />
            <span>
              <strong>Forensic Protection:</strong> This deliverable is digitally watermarked to{' '}
              <u className="text-purple-300 font-medium">{contract.clientName}</u>. Any unauthorized
              distribution or screen capture carries cryptographic proof of origin.
            </span>
          </div>
          <div className="flex items-center gap-2 font-mono text-[11px] text-slate-400">
            <span>SHA-256: {file.sha256Hash.slice(0, 16)}...</span>
            <button
              onClick={handleCopyHash}
              className="p-1 hover:text-white transition"
              title="Copy Checksum"
            >
              {copiedHash ? (
                <Check className="w-3 h-3 text-emerald-400" />
              ) : (
                <Copy className="w-3 h-3 text-slate-400" />
              )}
            </button>
          </div>
        </div>

        {/* Main Deliverable Viewer Canvas */}
        <div className="relative flex-1 overflow-y-auto p-6 bg-slate-950 flex items-center justify-center">
          {/* Forensic Dynamic Diagonal Watermark Grid */}
          {shieldActive && (
            <div
              className="pointer-events-none absolute inset-0 z-20 flex flex-wrap items-center justify-around overflow-hidden opacity-30 select-none"
              style={{ transform: 'rotate(-25deg) scale(1.3)' }}
            >
              {Array.from({ length: 18 }).map((_, i) => (
                <div
                  key={i}
                  className="p-8 text-xs font-mono font-bold tracking-widest text-emerald-400/80 whitespace-nowrap uppercase"
                >
                  {watermarkText}
                </div>
              ))}
            </div>
          )}

          {/* CODE DELIVERABLE */}
          {file.type === 'code' && file.codeSnippet && (
            <div className="w-full max-w-4xl h-full flex flex-col rounded-2xl bg-slate-900/90 border border-slate-800 font-mono text-xs overflow-hidden shadow-2xl relative z-10">
              <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950 border-b border-slate-800">
                <div className="flex items-center gap-2 text-slate-400">
                  <FileCode className="w-4 h-4 text-cyan-400" />
                  <span>{file.name}</span>
                </div>
                <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-medium">
                  Integrity Verified
                </span>
              </div>
              <div className="p-4 flex-1 overflow-auto text-slate-300 leading-relaxed font-mono">
                <pre>{file.codeSnippet}</pre>
              </div>
            </div>
          )}

          {/* IMAGE DELIVERABLE */}
          {file.type === 'image' && file.previewUrl && (
            <div className="relative max-w-3xl max-h-full rounded-2xl overflow-hidden border border-slate-800 shadow-2xl z-10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={file.previewUrl}
                alt={file.name}
                draggable={false}
                className="max-h-[60vh] object-contain pointer-events-none"
              />
            </div>
          )}

          {/* DOCUMENT DELIVERABLE */}
          {file.type === 'document' && (
            <div className="w-full max-w-2xl p-8 rounded-2xl bg-slate-900/90 border border-slate-800 text-slate-300 space-y-4 shadow-2xl relative z-10">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
                <FileText className="w-8 h-8 text-purple-400" />
                <div>
                  <h4 className="text-sm font-semibold text-white">{file.name}</h4>
                  <p className="text-xs text-slate-400">PDF Document ({file.size})</p>
                </div>
              </div>
              <div className="space-y-3 text-xs leading-relaxed text-slate-300">
                <p>
                  <strong>Document Overview:</strong> This technical deliverable has been securely
                  rendered in the ViewBook Vault for verification prior to escrow settlement.
                </p>
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 font-mono text-[11px] space-y-1">
                  <div>Contract ID: {contract.id}</div>
                  <div>Client: {contract.clientName}</div>
                  <div>Freelancer: {contract.freelancerName}</div>
                  <div>SHA-256 Checksum: {file.sha256Hash}</div>
                </div>
                <p className="text-slate-400 italic">
                  Raw unencrypted PDF can be downloaded immediately once the milestone is approved
                  and escrow funds are released.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Action Footer */}
        <div className="flex flex-wrap items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-950/80 gap-3">
          {/* Download Status */}
          <div className="flex items-center gap-2 text-xs">
            {isReleased ? (
              <div className="flex items-center gap-2 text-emerald-400 font-medium">
                <CheckCircle2 className="w-4 h-4" />
                <span>Escrow Settled: Raw unwatermarked original file is unlocked.</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-slate-400">
                <Lock className="w-4 h-4 text-amber-400" />
                <span>Raw Asset Gated: Unlocks automatically upon milestone approval.</span>
              </div>
            )}
          </div>

          {/* Contextual Action Buttons */}
          <div className="flex items-center gap-2 ml-auto">
            {/* Raw Download Button */}
            {isReleased ? (
              <a
                href={file.unlockedDownloadUrl || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-blue-500 hover:bg-blue-400 text-white transition shadow-sm"
              >
                <Download className="w-4 h-4" />
                <span>Download Clean Original</span>
              </a>
            ) : (
              <div
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed"
                title="Locked until escrow release"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Download Gated</span>
              </div>
            )}

            {/* Client Release Button */}
            {role === 'client' && !isReleased && (
              <>
                <button
                  onClick={() => {
                    closeVault();
                    openDisputeModal(contract.id, milestone.id);
                  }}
                  className="px-3 py-2 rounded-xl text-xs font-medium bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 border border-rose-500/30 transition"
                >
                  Raise Dispute
                </button>
                <button
                  onClick={() => {
                    approveMilestone(contract.id, milestone.id);
                    closeVault();
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-400 hover:bg-emerald-300 text-slate-950 transition shadow-sm"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Approve & Release {formatCurrency(milestone.amount)}</span>
                </button>
              </>
            )}

            <button
              onClick={closeVault}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};