'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Contract,
  Milestone,
  MilestoneStatus,
  DeliverableFile,
  AuditEvent,
  WalletBalance,
  UserRole,
} from '@/types/escrow';
import {
  INITIAL_CONTRACTS,
  INITIAL_WALLET,
  INITIAL_AUDIT_EVENTS,
} from '@/lib/mockData';
import { generateSha256 } from '@/lib/utils';
import confetti from 'canvas-confetti';

interface VaultItem {
  contract: Contract;
  milestone: Milestone;
  file: DeliverableFile;
}

interface EscrowContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  contracts: Contract[];
  selectedContractId: string;
  selectedContract: Contract | undefined;
  selectContract: (id: string) => void;
  wallet: WalletBalance;
  auditEvents: AuditEvent[];
  activeVaultItem: VaultItem | null;
  openVault: (contract: Contract, milestone: Milestone, file: DeliverableFile) => void;
  closeVault: () => void;
  uploadModal: { contractId: string; milestoneId: string } | null;
  openUploadModal: (contractId: string, milestoneId: string) => void;
  closeUploadModal: () => void;
  disputeModal: { contractId: string; milestoneId: string } | null;
  openDisputeModal: (contractId: string, milestoneId: string) => void;
  closeDisputeModal: () => void;
  isNewContractOpen: boolean;
  setIsNewContractOpen: (open: boolean) => void;
  isAuditLogOpen: boolean;
  setIsAuditLogOpen: (open: boolean) => void;
  fundMilestone: (contractId: string, milestoneId: string) => void;
  submitDeliverable: (contractId: string, milestoneId: string, file: DeliverableFile) => void;
  approveMilestone: (contractId: string, milestoneId: string) => void;
  disputeMilestone: (contractId: string, milestoneId: string, reason: string) => void;
  resolveDispute: (contractId: string, milestoneId: string, decision: 'freelancer' | 'client') => void;
  createContract: (contract: Omit<Contract, 'id' | 'createdAt' | 'status'>) => void;
  resetDemo: () => void;
}

const EscrowContext = createContext<EscrowContextType | undefined>(undefined);

// Helper to normalize contract data from SQLite Prisma models to frontend shapes
function normalizeContract(c: any): Contract {
  const contractId = c.id;
  const createdAtStr =
    typeof c.createdAt === 'string'
      ? c.createdAt.slice(0, 10)
      : c.createdAt
      ? new Date(c.createdAt).toISOString().slice(0, 10)
      : new Date().toISOString().slice(0, 10);

  return {
    id: contractId,
    title: c.title,
    category: c.category || 'General',
    clientName: c.clientName,
    clientCompany: c.clientCompany || c.clientName,
    freelancerName: c.freelancerName,
    freelancerTitle: c.freelancerTitle || 'Provider',
    totalAmount: Number(c.totalAmount) || 0,
    createdAt: createdAtStr,
    status: (c.status?.toLowerCase() || 'active') as 'active' | 'completed' | 'disputed',
    termsSummary: c.termsSummary || 'ViewBook Escrow Protocols active.',
    milestones: (c.milestones || []).map((m: any) => {
      const mStatus = (m.status?.toLowerCase() || 'awaiting_funds') as MilestoneStatus;
      return {
        id: m.id,
        title: m.title,
        description: m.description || '',
        amount: Number(m.amount) || 0,
        dueDate: m.dueDate || '',
        status: mStatus,
        escrowFundedAt: m.escrowFundedAt || undefined,
        deliverableSubmittedAt: m.deliverableSubmittedAt || undefined,
        releasedAt: m.releasedAt || undefined,
        disputeReason: m.disputeReason || (m.dispute?.reason) || undefined,
        revisionNotes: m.revisionNotes || undefined,
        deliverables: (m.deliverables || []).map((d: any) => ({
          id: d.id,
          name: d.name,
          size: d.size,
          type: d.type as 'image' | 'code' | 'document' | 'archive',
          previewUrl: d.previewUrl || undefined,
          codeSnippet: d.codeSnippet || undefined,
          sha256Hash: d.sha256Hash,
          uploadedAt: d.uploadedAt,
          unlockedDownloadUrl:
            mStatus === 'released'
              ? `/api/contracts/${contractId}/milestones/${m.id}/download?fileId=${d.id}`
              : undefined,
        })),
      };
    }),
  };
}

function normalizeAuditEvent(e: any): AuditEvent {
  return {
    id: e.id,
    contractId: e.contractId,
    contractTitle: e.contractTitle || e.contract?.title || 'Contract',
    milestoneId: e.milestoneId || undefined,
    timestamp: e.timestamp,
    actor: e.actor,
    actorRole: (e.actorRole?.toLowerCase() || 'client') as UserRole,
    action: e.action,
    details: e.details,
    sha256Signature: e.sha256Signature,
  };
}

const computeWalletBalances = (contractsList: Contract[]): WalletBalance => {
  let inEscrow = 0;
  let settled = 0;

  contractsList.forEach((c) => {
    c.milestones.forEach((m) => {
      if (m.status === 'in_progress' || m.status === 'in_vault_review' || m.status === 'disputed') {
        inEscrow += m.amount;
      } else if (m.status === 'released') {
        settled += m.amount;
      }
    });
  });

  const available = Math.max(0, 50000 - inEscrow - settled);

  return {
    clientAvailable: available,
    clientInEscrow: inEscrow,
    freelancerPendingEscrow: inEscrow,
    freelancerWithdrawable: settled,
  };
};

export function EscrowProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<UserRole>('client');
  const [contracts, setContracts] = useState<Contract[]>(INITIAL_CONTRACTS);
  const [selectedContractId, setSelectedContractId] = useState<string>(INITIAL_CONTRACTS[0].id);
  const [wallet, setWallet] = useState<WalletBalance>(INITIAL_WALLET);
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>(INITIAL_AUDIT_EVENTS);

  const [activeVaultItem, setActiveVaultItem] = useState<VaultItem | null>(null);
  const [uploadModal, setUploadModal] = useState<{ contractId: string; milestoneId: string } | null>(null);
  const [disputeModal, setDisputeModal] = useState<{ contractId: string; milestoneId: string } | null>(null);
  const [isNewContractOpen, setIsNewContractOpen] = useState<boolean>(false);
  const [isAuditLogOpen, setIsAuditLogOpen] = useState<boolean>(false);

  // Fetch live state from backend API
  const syncWithServer = async () => {
    try {
      const [contractsRes, auditRes] = await Promise.all([
        fetch('/api/contracts'),
        fetch('/api/audit'),
      ]);

      if (contractsRes.ok) {
        const contractsJson = await contractsRes.json();
        if (contractsJson.success && Array.isArray(contractsJson.data) && contractsJson.data.length > 0) {
          const formatted = contractsJson.data.map(normalizeContract);
          setContracts(formatted);
          setWallet(computeWalletBalances(formatted));
        }
      }

      if (auditRes.ok) {
        const auditJson = await auditRes.json();
        if (auditJson.success && Array.isArray(auditJson.data)) {
          setAuditEvents(auditJson.data.map(normalizeAuditEvent));
        }
      }
    } catch (err) {
      console.warn('EscrowContext: Local fallback used, server sync failed', err);
    }
  };

  useEffect(() => {
    syncWithServer();
  }, []);

  const selectedContract = contracts.find((c) => c.id === selectedContractId) || contracts[0];

  const fundMilestone = async (contractId: string, milestoneId: string) => {
    try {
      const res = await fetch(`/api/contracts/${contractId}/milestones/${milestoneId}/fund`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ actorName: selectedContract?.clientName || 'Client' }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Failed to fund milestone');
      }

      await syncWithServer();
    } catch (error: any) {
      console.error('fundMilestone error:', error);
      alert(`Funding Failed: ${error.message}`);
    }
  };

  const submitDeliverable = async (contractId: string, milestoneId: string, file: DeliverableFile) => {
    try {
      const res = await fetch(`/api/contracts/${contractId}/milestones/${milestoneId}/deliverables`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: file.name,
          size: file.size,
          type: file.type,
          codeSnippet: file.codeSnippet,
          previewUrl: file.previewUrl,
          actorName: selectedContract?.freelancerName || 'Freelancer',
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Failed to deposit deliverable');
      }

      await syncWithServer();
    } catch (error: any) {
      console.error('submitDeliverable error:', error);
      alert(`Deliverable Deposit Failed: ${error.message}`);
    }
  };

  const approveMilestone = async (contractId: string, milestoneId: string) => {
    try {
      const res = await fetch(`/api/contracts/${contractId}/milestones/${milestoneId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ actorName: selectedContract?.clientName || 'Client' }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Failed to approve milestone');
      }

      try {
        confetti({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.6 },
        });
      } catch {
        // Ignore confetti failure
      }

      await syncWithServer();
    } catch (error: any) {
      console.error('approveMilestone error:', error);
      alert(`Milestone Approval Failed: ${error.message}`);
    }
  };

  const disputeMilestone = async (contractId: string, milestoneId: string, reason: string) => {
    try {
      const res = await fetch(`/api/contracts/${contractId}/milestones/${milestoneId}/dispute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reason,
          actorName: selectedContract?.clientName || 'Client',
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Failed to raise dispute');
      }

      await syncWithServer();
    } catch (error: any) {
      console.error('disputeMilestone error:', error);
      alert(`Dispute Failed: ${error.message}`);
    }
  };

  const resolveDispute = async (
    contractId: string,
    milestoneId: string,
    decision: 'freelancer' | 'client'
  ) => {
    try {
      const res = await fetch(`/api/contracts/${contractId}/milestones/${milestoneId}/arbitrate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          decision: decision === 'freelancer' ? 'FREELANCER' : 'CLIENT',
          arbitratorNotes: `ViewBook Arbitration verdict issued in favor of ${decision}.`,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Failed to arbitrate dispute');
      }

      await syncWithServer();
    } catch (error: any) {
      console.error('resolveDispute error:', error);
      alert(`Arbitration Failed: ${error.message}`);
    }
  };

  const createContract = async (newContractData: Omit<Contract, 'id' | 'createdAt' | 'status'>) => {
    try {
      const res = await fetch('/api/contracts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newContractData),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Failed to create contract');
      }

      const createdId = json.data?.id;
      await syncWithServer();
      if (createdId) {
        setSelectedContractId(createdId);
      }
    } catch (error: any) {
      console.error('createContract error:', error);
      alert(`Contract Creation Failed: ${error.message}`);
    }
  };

  const resetDemo = async () => {
    try {
      const res = await fetch('/api/reset', { method: 'POST' });
      if (res.ok) {
        await syncWithServer();
        setRole('client');
      }
    } catch (error) {
      console.error('resetDemo error:', error);
    }
  };

  const openVault = (contract: Contract, milestone: Milestone, file: DeliverableFile) => {
    setActiveVaultItem({ contract, milestone, file });
  };

  const closeVault = () => setActiveVaultItem(null);

  const openUploadModal = (contractId: string, milestoneId: string) =>
    setUploadModal({ contractId, milestoneId });
  const closeUploadModal = () => setUploadModal(null);

  const openDisputeModal = (contractId: string, milestoneId: string) =>
    setDisputeModal({ contractId, milestoneId });
  const closeDisputeModal = () => setDisputeModal(null);

  return (
    <EscrowContext.Provider
      value={{
        role,
        setRole,
        contracts,
        selectedContractId,
        selectedContract,
        selectContract: setSelectedContractId,
        wallet,
        auditEvents,
        activeVaultItem,
        openVault,
        closeVault,
        uploadModal,
        openUploadModal,
        closeUploadModal,
        disputeModal,
        openDisputeModal,
        closeDisputeModal,
        isNewContractOpen,
        setIsNewContractOpen,
        isAuditLogOpen,
        setIsAuditLogOpen,
        fundMilestone,
        submitDeliverable,
        approveMilestone,
        disputeMilestone,
        resolveDispute,
        createContract,
        resetDemo,
      }}
    >
      {children}
    </EscrowContext.Provider>
  );
}

export function useEscrow() {
  const context = useContext(EscrowContext);
  if (!context) {
    throw new Error('useEscrow must be used within an EscrowProvider');
  }
  return context;
}