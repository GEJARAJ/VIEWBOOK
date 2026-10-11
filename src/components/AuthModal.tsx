'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { formatCurrency } from '@/lib/utils';
import {
  Users,
  X,
  ShieldCheck,
  Building2,
  Briefcase,
  Scale,
  Sparkles,
  ArrowRight,
  UserPlus,
  KeyRound,
  CheckCircle2,
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    currentUser,
    availableUsers,
    switchUser,
    register,
    login,
    isAuthModalOpen,
    setIsAuthModalOpen,
  } = useAuth();

  const [activeTab, setActiveTab] = useState<'switch' | 'new'>('switch');
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newCompany, setNewCompany] = useState('');
  const [newRole, setNewRole] = useState<'CLIENT' | 'FREELANCER'>('CLIENT');
  const [newBalance, setNewBalance] = useState(25000);
  const [submitting, setSubmitting] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) return;

    setSubmitting(true);
    await register({
      name: newName,
      email: newEmail,
      company: newCompany,
      role: newRole,
      startingBalance: newBalance,
    });
    setSubmitting(false);
  };

  const getRoleBadge = (role: string) => {
    if (role === 'CLIENT') {
      return (
        <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded">
          <Building2 className="w-3 h-3" /> CLIENT
        </span>
      );
    }
    if (role === 'FREELANCER') {
      return (
        <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
          <Briefcase className="w-3 h-3" /> FREELANCER
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded">
        <Scale className="w-3 h-3" /> ARBITRATOR
      </span>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-150">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Select Active Identity</h3>
              <p className="text-xs text-slate-400">
                Experience ViewBook with strict role isolation and true client/freelancer permissions
              </p>
            </div>
          </div>
          {currentUser && (
            <button
              onClick={() => setIsAuthModalOpen(false)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Tab Toggle */}
        <div className="flex border-b border-slate-800 bg-slate-950/50 p-1.5 gap-1.5">
          <button
            onClick={() => setActiveTab('switch')}
            className={`flex-1 py-2 rounded-xl text-xs font-medium transition ${
              activeTab === 'switch'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Registered Profiles ({availableUsers.length})
          </button>
          <button
            onClick={() => setActiveTab('new')}
            className={`flex-1 py-2 rounded-xl text-xs font-medium transition ${
              activeTab === 'new'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            + Create New Entity
          </button>
        </div>

        {/* Tab 1: Fast Profile Switcher */}
        {activeTab === 'switch' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-3">
            <div className="p-3 rounded-2xl bg-cyan-950/20 border border-cyan-900/30 text-xs text-cyan-200 leading-relaxed flex items-start gap-2.5 mb-2">
              <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span>
                <strong>Zero Spoofing Architecture:</strong> In ViewBook, roles cannot be toggled at
                will. Each party operates strictly within their cryptographic permissions and wallet
                ledger.
              </span>
            </div>

            {availableUsers.map((u) => {
              const isSelected = currentUser?.id === u.id;

              return (
                <div
                  key={u.id}
                  onClick={() => switchUser(u.id)}
                  className={`p-4 rounded-2xl border transition cursor-pointer flex items-center justify-between gap-4 ${
                    isSelected
                      ? 'bg-emerald-500/10 border-emerald-500/40 ring-1 ring-emerald-500/20'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-950'
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <img
                      src={
                        u.avatarUrl ||
                        `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(u.name)}`
                      }
                      alt={u.name}
                      className="w-10 h-10 rounded-full border border-slate-700 object-cover bg-slate-800 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-white truncate">{u.name}</span>
                        {getRoleBadge(u.role)}
                      </div>
                      <p className="text-xs text-slate-400 truncate">
                        {u.company || u.title || u.email}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    {u.role === 'CLIENT' && (
                      <div>
                        <span className="text-[10px] text-slate-500 block uppercase">Wallet Balance</span>
                        <span className="text-xs font-mono font-bold text-emerald-300">
                          {formatCurrency(u.balance)}
                        </span>
                      </div>
                    )}
                    {u.role === 'FREELANCER' && (
                      <div>
                        <span className="text-[10px] text-slate-500 block uppercase">Withdrawable</span>
                        <span className="text-xs font-mono font-bold text-emerald-300">
                          {formatCurrency(u.withdrawable)}
                        </span>
                      </div>
                    )}
                    {u.role === 'ARBITRATOR' && (
                      <div>
                        <span className="text-[10px] text-purple-400 block uppercase font-mono">Neutral Bureau</span>
                        <span className="text-xs text-slate-400">Jurisdiction</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 2: Create Custom User */}
        {activeTab === 'new' && (
          <form onSubmit={handleCreateAccount} className="flex-1 overflow-y-auto p-6 space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Account Role</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setNewRole('CLIENT')}
                  className={`p-3 rounded-xl border text-xs font-medium flex items-center justify-center gap-2 transition ${
                    newRole === 'CLIENT'
                      ? 'bg-blue-500/10 text-blue-300 border-blue-500/40'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  <Building2 className="w-4 h-4" /> Client (Funds Escrows)
                </button>
                <button
                  type="button"
                  onClick={() => setNewRole('FREELANCER')}
                  className={`p-3 rounded-xl border text-xs font-medium flex items-center justify-center gap-2 transition ${
                    newRole === 'FREELANCER'
                      ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/40'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  <Briefcase className="w-4 h-4" /> Provider (Uploads Work)
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Full Name</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Satoshi Nakamoto"
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Email Address</label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="satoshi@bitcoin.org"
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Entity / Organization</label>
              <input
                type="text"
                value={newCompany}
                onChange={(e) => setNewCompany(e.target.value)}
                placeholder="e.g. Decentralized Labs LLC"
                className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            {newRole === 'CLIENT' && (
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Initial Escrow Test Wallet ($USD)</label>
                <input
                  type="number"
                  min={1000}
                  step={500}
                  value={newBalance}
                  onChange={(e) => setNewBalance(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-emerald-300 font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-2 py-2.5 rounded-xl text-xs font-semibold bg-emerald-400 hover:bg-emerald-300 text-slate-950 transition flex items-center justify-center gap-1.5 shadow-sm"
            >
              <UserPlus className="w-4 h-4" />
              <span>Create & Sign In to Account</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};