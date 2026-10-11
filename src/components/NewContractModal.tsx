'use client';

import React, { useState } from 'react';
import { useEscrow } from '@/context/EscrowContext';
import { Milestone } from '@/types/escrow';
import { formatCurrency } from '@/lib/utils';
import {
  PlusCircle,
  Trash2,
  X,
  ShieldCheck,
  Briefcase,
  Layers,
} from 'lucide-react';

export const NewContractModal: React.FC = () => {
  const { isNewContractOpen, setIsNewContractOpen, createContract } = useEscrow();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Full-Stack Web & API');
  const [clientName, setClientName] = useState('Sarah Jenkins');
  const [clientCompany, setClientCompany] = useState('Apex Ventures Inc.');
  const [freelancerName, setFreelancerName] = useState('Elena Rostova');
  const [freelancerTitle, setFreelancerTitle] = useState('Principal Systems Architect');
  const [termsSummary, setTermsSummary] = useState(
    '100% Escrow deposit required before work starts. Deliverables protected by ViewBook Vault until release approval.'
  );

  const [milestones, setMilestones] = useState<
    Omit<Milestone, 'id' | 'status' | 'deliverables'>[]
  >([
    {
      title: 'Phase 1: Architecture Blueprint & API Specs',
      description: 'System specifications, database ERD, threat model, and auth flow diagrams.',
      amount: 3500,
      dueDate: '2026-09-20',
    },
    {
      title: 'Phase 2: Core Implementation & Vault Preview',
      description: 'Production code repository, microservices, and live staging deploy.',
      amount: 5500,
      dueDate: '2026-10-05',
    },
  ]);

  if (!isNewContractOpen) return null;

  const totalAmount = milestones.reduce((sum, m) => sum + (Number(m.amount) || 0), 0);

  const handleAddMilestone = () => {
    setMilestones((prev) => [
      ...prev,
      {
        title: `Phase ${prev.length + 1}: Final Integration`,
        description: 'Quality assurance, load testing, and deployment verification.',
        amount: 2500,
        dueDate: '2026-10-20',
      },
    ]);
  };

  const handleRemoveMilestone = (index: number) => {
    if (milestones.length <= 1) return;
    setMilestones((prev) => prev.filter((_, i) => i !== index));
  };

  const handleMilestoneChange = (
    index: number,
    field: 'title' | 'description' | 'amount' | 'dueDate',
    val: string | number
  ) => {
    setMilestones((prev) =>
      prev.map((m, i) => (i === index ? { ...m, [field]: val } : m))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const formattedMilestones: Milestone[] = milestones.map((m, idx) => ({
      id: `MLS-${Math.floor(100 + Math.random() * 900)}`,
      title: m.title,
      description: m.description,
      amount: Number(m.amount) || 0,
      dueDate: m.dueDate,
      status: 'awaiting_funds',
    }));

    createContract({
      title,
      category,
      clientName,
      clientCompany,
      freelancerName,
      freelancerTitle,
      totalAmount,
      termsSummary,
      milestones: formattedMilestones,
    });

    setIsNewContractOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="w-full max-w-3xl max-h-[90vh] flex flex-col bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Create New Escrow Contract</h3>
              <p className="text-xs text-slate-400">
                Setup milestones, funding conditions, and ViewBook anti-theft rules
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsNewContractOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Title & Category */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2 space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Contract Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Next-Gen Financial Dashboard & API Integration"
                className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="Full-Stack Web & API">Full-Stack Web & API</option>
                <option value="UI/UX & Design Systems">UI/UX & Design Systems</option>
                <option value="Fintech & Escrow Engines">Fintech & Escrow Engines</option>
                <option value="Cybersecurity Audit">Cybersecurity Audit</option>
                <option value="AI / ML Architecture">AI / ML Architecture</option>
              </select>
            </div>
          </div>

          {/* Parties */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
            {/* Client Party */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-blue-400 flex items-center gap-1.5">
                Client Entity
              </span>
              <div className="space-y-2">
                <input
                  type="text"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Client Representative"
                  className="w-full px-3 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                />
                <input
                  type="text"
                  required
                  value={clientCompany}
                  onChange={(e) => setClientCompany(e.target.value)}
                  placeholder="Client Company Name"
                  className="w-full px-3 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Freelancer Party */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                Service Provider / Creator
              </span>
              <div className="space-y-2">
                <input
                  type="text"
                  required
                  value={freelancerName}
                  onChange={(e) => setFreelancerName(e.target.value)}
                  placeholder="Freelancer / Lead Engineer"
                  className="w-full px-3 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                />
                <input
                  type="text"
                  required
                  value={freelancerTitle}
                  onChange={(e) => setFreelancerTitle(e.target.value)}
                  placeholder="Professional Title / Agency"
                  className="w-full px-3 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Milestones Builder */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-white flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-emerald-400" />
                <span>Contract Milestones</span>
              </label>
              <button
                type="button"
                onClick={handleAddMilestone}
                className="flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 border border-emerald-500/30 transition"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Add Milestone</span>
              </button>
            </div>

            <div className="space-y-3">
              {milestones.map((m, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-mono font-bold text-slate-400">
                      Phase 0{idx + 1}
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-slate-400">$</span>
                        <input
                          type="number"
                          required
                          min={100}
                          value={m.amount}
                          onChange={(e) =>
                            handleMilestoneChange(idx, 'amount', Number(e.target.value))
                          }
                          className="w-24 px-2 py-1 text-xs bg-slate-900 border border-slate-800 rounded-lg text-emerald-300 font-mono focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                      <input
                        type="date"
                        required
                        value={m.dueDate}
                        onChange={(e) =>
                          handleMilestoneChange(idx, 'dueDate', e.target.value)
                        }
                        className="px-2 py-1 text-xs bg-slate-900 border border-slate-800 rounded-lg text-slate-300 focus:outline-none focus:border-emerald-500"
                      />
                      {milestones.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveMilestone(idx)}
                          className="p-1 text-slate-500 hover:text-rose-400 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  <input
                    type="text"
                    required
                    value={m.title}
                    onChange={(e) => handleMilestoneChange(idx, 'title', e.target.value)}
                    placeholder="Milestone Deliverable Title"
                    className="w-full px-3 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  />
                  <textarea
                    rows={2}
                    value={m.description}
                    onChange={(e) => handleMilestoneChange(idx, 'description', e.target.value)}
                    placeholder="Describe deliverable verification requirements..."
                    className="w-full px-3 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-lg text-slate-300 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Contract Terms */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">Contract Agreement Terms</label>
            <textarea
              rows={2}
              value={termsSummary}
              onChange={(e) => setTermsSummary(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-300 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Total Calculation & Guarantee Callout */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-emerald-950/20 border border-emerald-900/40">
            <div className="flex items-center gap-2 text-xs text-emerald-200">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>
                Protected under <strong>ViewBook Zero-Theft Escrow Protocols</strong>
              </span>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-slate-400">Total Escrow Value</span>
              <div className="text-xl font-bold font-mono text-emerald-300">
                {formatCurrency(totalAmount)}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsNewContractOpen(false)}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim() || totalAmount <= 0}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-semibold bg-emerald-400 hover:bg-emerald-300 disabled:opacity-50 text-slate-950 transition shadow-sm"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Initialize Contract ({formatCurrency(totalAmount)})</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};