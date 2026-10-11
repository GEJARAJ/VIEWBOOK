export type UserRole = 'client' | 'freelancer' | 'arbitrator';

export type MilestoneStatus =
  | 'draft'
  | 'awaiting_funds'
  | 'in_progress'
  | 'in_vault_review'
  | 'released'
  | 'disputed';

export interface DeliverableFile {
  id: string;
  name: string;
  size: string;
  type: 'image' | 'code' | 'document' | 'archive';
  previewUrl?: string;
  codeSnippet?: string;
  sha256Hash: string;
  uploadedAt: string;
  unlockedDownloadUrl?: string;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  amount: number;
  dueDate: string;
  status: MilestoneStatus;
  escrowFundedAt?: string;
  deliverableSubmittedAt?: string;
  releasedAt?: string;
  deliverables?: DeliverableFile[];
  disputeReason?: string;
  revisionNotes?: string;
}

export interface Contract {
  id: string;
  title: string;
  category: string;
  clientName: string;
  clientCompany: string;
  freelancerName: string;
  freelancerTitle: string;
  totalAmount: number;
  createdAt: string;
  status: 'active' | 'completed' | 'disputed';
  milestones: Milestone[];
  termsSummary: string;
}

export interface AuditEvent {
  id: string;
  contractId: string;
  contractTitle: string;
  milestoneId?: string;
  timestamp: string;
  actor: string;
  actorRole: UserRole;
  action: string;
  details: string;
  sha256Signature: string;
}

export interface WalletBalance {
  clientAvailable: number;
  clientInEscrow: number;
  freelancerPendingEscrow: number;
  freelancerWithdrawable: number;
}
