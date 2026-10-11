'use client';

import React, { useState } from 'react';
import { useEscrow } from '@/context/EscrowContext';
import { formatCurrency } from '@/lib/utils';
import { Search, ShieldAlert, CheckCircle2, Clock, ChevronRight } from 'lucide-react';

export const ContractList: React.FC = () => {
  const { contracts, selectedContractId, selectContract } = useEscrow();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'completed' | 'disputed'>('all');

  const filteredContracts = contracts.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.freelancerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'all' || c.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex flex-col h-full bg-slate-900/40 border border-slate-800/80 rounded-2xl overflow-hidden">
      {/* Header & Search */}
      <div className="p-4 border-b border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">Escrow Contracts</h3>
          <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
            {contracts.length}
          </span>
        </div>

        {/* Search Box */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search contracts or parties..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-950/60 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex gap-1.5 overflow-x-auto text-[11px] pb-1">
          {(['all', 'active', 'completed', 'disputed'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterStatus(tab)}
              className={`px-2.5 py-1 rounded-lg capitalize font-medium transition ${
                filterStatus === tab
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Contracts Scrollable List */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60">
        {filteredContracts.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-500">
            No contracts match your criteria.
          </div>
        ) : (
          filteredContracts.map((contract) => {
            const isSelected = contract.id === selectedContractId;
            const releasedCount = contract.milestones.filter((m) => m.status === 'released').length;
            const progressPercent = Math.round((releasedCount / contract.milestones.length) * 100);

            return (
              <button
                key={contract.id}
                onClick={() => selectContract(contract.id)}
                className={`w-full text-left p-4 transition relative flex flex-col gap-2.5 ${
                  isSelected
                    ? 'bg-slate-800/60 border-l-4 border-l-emerald-400'
                    : 'hover:bg-slate-800/30 border-l-4 border-l-transparent'
                }`}
              >
                {/* Category & Status */}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-slate-400 truncate">
                    {contract.category}
                  </span>
                  {contract.status === 'active' && (
                    <span className="flex items-center gap-1 text-[10px] font-medium text-emerald-400 px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                      <Clock className="w-2.5 h-2.5" /> Active
                    </span>
                  )}
                  {contract.status === 'completed' && (
                    <span className="flex items-center gap-1 text-[10px] font-medium text-blue-400 px-1.5 py-0.5 rounded bg-blue-500/10 border border-blue-500/20">
                      <CheckCircle2 className="w-2.5 h-2.5" /> Settled
                    </span>
                  )}
                  {contract.status === 'disputed' && (
                    <span className="flex items-center gap-1 text-[10px] font-medium text-rose-400 px-1.5 py-0.5 rounded bg-rose-500/10 border border-rose-500/20">
                      <ShieldAlert className="w-2.5 h-2.5" /> Disputed
                    </span>
                  )}
                </div>

                {/* Title */}
                <h4 className="text-xs font-semibold text-slate-100 line-clamp-1">
                  {contract.title}
                </h4>

                {/* Parties */}
                <div className="text-[11px] text-slate-400 flex items-center justify-between">
                  <span>{contract.clientCompany}</span>
                  <span className="font-mono text-emerald-300 font-medium">
                    {formatCurrency(contract.totalAmount)}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                    <span>
                      {releasedCount}/{contract.milestones.length} Milestones
                    </span>
                    <span>{progressPercent}% Settled</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        contract.status === 'disputed'
                          ? 'bg-rose-500'
                          : contract.status === 'completed'
                          ? 'bg-blue-400'
                          : 'bg-emerald-400'
                      }`}
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Chevron icon on selection */}
                <ChevronRight
                  className={`w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition-transform ${
                    isSelected ? 'translate-x-1 text-emerald-400' : 'opacity-0'
                  }`}
                />
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};