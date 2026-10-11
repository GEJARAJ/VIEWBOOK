'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { StatsOverview } from '@/components/StatsOverview';
import { SecurityBadges } from '@/components/SecurityBadges';
import { ContractList } from '@/components/ContractList';
import { ContractDetail } from '@/components/ContractDetail';
import { ViewBookVaultModal } from '@/components/ViewBookVaultModal';
import { UploadDeliverableModal } from '@/components/UploadDeliverableModal';
import { NewContractModal } from '@/components/NewContractModal';
import { AuditLogModal } from '@/components/AuditLogModal';
import { DisputeModal } from '@/components/DisputeModal';
import { AuthModal } from '@/components/AuthModal';
import { LandingPage } from '@/components/LandingPage';
import { ShieldCheck, Lock, Sparkles } from 'lucide-react';

export default function Home() {
  const [viewMode, setViewMode] = useState<'landing' | 'workspace'>('landing');

  // Check URL query param ?view=workspace if present
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('view') === 'workspace' || params.get('tab') === 'workspace') {
        setViewMode('workspace');
      }
    }
  }, []);

  if (viewMode === 'landing') {
    return (
      <LandingPage onLaunchApp={() => setViewMode('workspace')} />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#080808] text-white antialiased font-sans animate-in fade-in duration-300">
      {/* Top Fixed Navbar with Landing Page Toggle */}
      <Navbar onToggleLanding={() => setViewMode('landing')} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* System Overview & Perspectives */}
        <StatsOverview />

        {/* 3 Core Security Pillars */}
        <SecurityBadges />

        {/* Interactive Workspace Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Contracts Directory (4 cols) */}
          <div className="lg:col-span-4 h-[780px]">
            <ContractList />
          </div>

          {/* Right Column: Active Contract Management & Vault Milestones (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            <ContractDetail />
          </div>
        </div>
      </main>

      {/* Interactive Modals */}
      <ViewBookVaultModal />
      <UploadDeliverableModal />
      <NewContractModal />
      <AuditLogModal />
      <DisputeModal />
      <AuthModal />

      {/* Protocol Footer */}
      <footer className="border-t border-white/5 bg-[#080808] py-6 mt-12 text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-lime-400 text-zinc-950 font-bold text-[10px]">
              <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
            </div>
            <span>
              <strong className="text-zinc-200 font-mono">ViewBook Escrow Protocol</strong> — Zero hostage drama.
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-mono">
            <button
              onClick={() => setViewMode('landing')}
              className="text-lime-400 hover:underline font-bold"
            >
              ← Back to Overview
            </button>
            <span className="text-zinc-700">•</span>
            <span className="flex items-center gap-1.5 text-lime-400">
              <span className="w-1.5 h-1.5 rounded-full bg-lime-400 animate-pulse" />
              100% Operational
            </span>
            <span className="text-zinc-700">•</span>
            <span className="flex items-center gap-1 text-zinc-400">
              <Lock className="w-3 h-3 text-amber-400" /> Escrow Active
            </span>
            <span className="text-zinc-700">•</span>
            <span className="flex items-center gap-1 text-violet-400">
              <Sparkles className="w-3 h-3" /> Anti-Scrape DRM
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
