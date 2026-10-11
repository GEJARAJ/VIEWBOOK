'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Eye,
  CheckCircle2,
  X,
  Coins,
  Scale,
  UserCheck,
  Building2,
  Sparkles,
  ArrowRight,
  HelpCircle,
  FileCheck,
  AlertCircle,
} from 'lucide-react';

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowItWorksModal: React.FC<HowItWorksModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'client' | 'freelancer' | 'platform'>('client');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">How ViewBook Protects You</h3>
              <p className="text-xs text-slate-400">
                Simple, jargon-free guide to our zero-theft escrow and fair economics
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Perspective Switcher Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950/30 px-6 pt-3 gap-2">
          <button
            onClick={() => setActiveTab('client')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-xl border-b-2 transition ${
              activeTab === 'client'
                ? 'border-blue-400 text-blue-300 bg-blue-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>I Am a Client (Buyer)</span>
          </button>
          <button
            onClick={() => setActiveTab('freelancer')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-xl border-b-2 transition ${
              activeTab === 'freelancer'
                ? 'border-emerald-400 text-emerald-300 bg-emerald-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>I Am a Creator / Freelancer</span>
          </button>
          <button
            onClick={() => setActiveTab('platform')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-xl border-b-2 transition ${
              activeTab === 'platform'
                ? 'border-purple-400 text-purple-300 bg-purple-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Coins className="w-4 h-4" />
            <span>Developer Role & Escrow Custody</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-300 text-xs leading-relaxed">
          {/* CLIENT TAB */}
          {activeTab === 'client' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-blue-950/30 border border-blue-800/40 space-y-1">
                <h4 className="text-sm font-semibold text-blue-300 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" />
                  Your Protection as a Client
                </h4>
                <p className="text-slate-300 text-xs">
                  You never pay upfront without guarantees. You maintain 100% control of your funds until the work is thoroughly reviewed and meets your exact expectations.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex gap-3 p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
                  <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 font-mono font-bold shrink-0">
                    1
                  </div>
                  <div>
                    <h5 className="font-semibold text-white">Deposit Milestone into Smart Escrow</h5>
                    <p className="text-slate-400 mt-0.5">
                      Pay via Card or Escrow Wallet with <strong>0% deposit fee</strong>. Your money does NOT go to the freelancer yet—it is securely locked in ViewBook's neutral escrow vault.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
                  <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-purple-500/10 text-purple-400 font-mono font-bold shrink-0">
                    2
                  </div>
                  <div>
                    <h5 className="font-semibold text-white">Inspect Work in the Theft-Proof Vault</h5>
                    <p className="text-slate-400 mt-0.5">
                      When the freelancer finishes, they upload files to the Vault. You can test code, preview graphics with forensic watermarks, or read documents safely in your browser.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
                  <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 font-mono font-bold shrink-0">
                    3
                  </div>
                  <div>
                    <h5 className="font-semibold text-white">Approve When Happy & Download Master Files</h5>
                    <p className="text-slate-400 mt-0.5">
                      Only when you click <strong>Approve & Disburse</strong> are the funds paid out to the freelancer. Clean, unwatermarked source files are unlocked for instant download.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                <span>Have an issue with the deliverable?</span>
                <span className="text-amber-400 font-medium">Click "Raise Dispute" for impartial arbitration & full refund protection.</span>
              </div>
            </div>
          )}

          {/* FREELANCER TAB */}
          {activeTab === 'freelancer' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-800/40 space-y-1">
                <h4 className="text-sm font-semibold text-emerald-300 flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Your Protection as a Freelancer / Agency
                </h4>
                <p className="text-slate-300 text-xs">
                  No more ghosting, unpaid invoices, or clients stealing your work without paying. ViewBook guarantees payment before you write a single line of code or design a pixel.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex gap-3 p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
                  <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 font-mono font-bold shrink-0">
                    1
                  </div>
                  <div>
                    <h5 className="font-semibold text-white">Guaranteed Escrow Before You Work</h5>
                    <p className="text-slate-400 mt-0.5">
                      Never work for free. The milestone status indicates <code className="text-cyan-300 bg-cyan-950 px-1 py-0.5 rounded font-mono">Escrow Locked</code> once the client deposits funds. You know 100% that the money is already waiting for you.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
                  <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-purple-500/10 text-purple-400 font-mono font-bold shrink-0">
                    2
                  </div>
                  <div>
                    <h5 className="font-semibold text-white">Theft-Proof Deliverables</h5>
                    <p className="text-slate-400 mt-0.5">
                      Upload your deliverables directly to the ViewBook Vault. Our engine embeds dynamic forensic watermarks and DRM security. Clients can preview and verify your work, but cannot steal or download original source files until you get paid.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
                  <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 font-mono font-bold shrink-0">
                    3
                  </div>
                  <div>
                    <h5 className="font-semibold text-white">Immediate 97.5% Payout to Your Sovereign Wallet</h5>
                    <p className="text-slate-400 mt-0.5">
                      Upon client approval, funds instantly transfer to your withdrawable balance. You take home <strong>97.5%</strong> of your earnings—unlike Upwork or Fiverr which charge up to 20% plus withdrawal penalties.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PLATFORM & ESCROW CUSTODY TAB */}
          {activeTab === 'platform' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-purple-950/30 border border-purple-800/40 space-y-1">
                <h4 className="text-sm font-semibold text-purple-300 flex items-center gap-2">
                  <Coins className="w-4 h-4" />
                  Where Funds Are Kept & The Developer's Role
                </h4>
                <p className="text-slate-300 text-xs">
                  Full clarity on how ViewBook operates, where money resides during a contract, and how our transparent 2.5% fee works.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-white font-semibold">
                    <Lock className="w-4 h-4 text-amber-400" />
                    <span>Where Are Payments Maintained?</span>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    Escrow funds are maintained in isolated smart custody. Neither the client, the freelancer, nor the platform can arbitrarily withdraw or spend escrowed funds. They are strictly governed by the milestone smart contract state.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-white font-semibold">
                    <Coins className="w-4 h-4 text-emerald-400" />
                    <span>What Is the Developer's Role?</span>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    We maintain rock-solid uptime, the forensic watermarking anti-theft preview engine, high-speed encrypted deliverable storage, and impartial arbitration dispute resolution.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-white font-semibold">
                    <Scale className="w-4 h-4 text-cyan-400" />
                    <span>Honest 2.5% Platform Fee</span>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    We deduct a modest 2.5% platform fee strictly when a milestone is successfully completed and approved. Clients pay 0% deposit fees. No monthly subscriptions or hidden charges.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-white font-semibold">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Dispute Resolution Guarantee</span>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    If an irreconcilable conflict arises, the neutral ViewBook Arbitrator audits the deliverable git commits/files and contract scope to refund or disburse fairly.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-5 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <span className="text-[11px] font-mono text-slate-500">
            ViewBook Security Protocol • Zero Risk • Commercial-Grade
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-semibold bg-emerald-400 hover:bg-emerald-300 text-slate-950 transition"
          >
            Got It, Thanks!
          </button>
        </div>
      </div>
    </div>
  );
};
