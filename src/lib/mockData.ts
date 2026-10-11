import { Contract, AuditEvent, WalletBalance } from '@/types/escrow';

export const INITIAL_WALLET: WalletBalance = {
  clientAvailable: 35000,
  clientInEscrow: 9500,
  freelancerPendingEscrow: 9500,
  freelancerWithdrawable: 18500,
};

export const INITIAL_CONTRACTS: Contract[] = [
  {
    id: 'CTR-8942',
    title: 'Fintech Core & Automated Escrow Engine API',
    category: 'Backend & Financial Systems',
    clientName: 'Alex Vance',
    clientCompany: 'Aetheria Capital Ltd',
    freelancerName: 'Elena Rostova',
    freelancerTitle: 'Principal Systems Architect',
    totalAmount: 14500,
    createdAt: '2026-08-28',
    status: 'active',
    termsSummary: 'Non-disclosure enforced. Milestone escrow deposit required prior to stage work. Deliverables protected by ViewBook Vault until release.',
    milestones: [
      {
        id: 'MLS-101',
        title: 'Cryptographic Specs & Architecture Blueprint',
        description: 'Detailed system design, database schema, multi-sig escrow logic, and threat model documentation.',
        amount: 4500,
        dueDate: '2026-09-02',
        status: 'released',
        escrowFundedAt: '2026-08-29 10:15 UTC',
        deliverableSubmittedAt: '2026-09-01 16:40 UTC',
        releasedAt: '2026-09-02 11:20 UTC',
        deliverables: [
          {
            id: 'DEL-01',
            name: 'Aetheria_Architecture_Spec_v1.0.pdf',
            size: '4.8 MB',
            type: 'document',
            previewUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
            sha256Hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
            uploadedAt: '2026-09-01 16:40 UTC',
            unlockedDownloadUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
          },
        ],
      },
      {
        id: 'MLS-102',
        title: 'Core Escrow Engine & Anti-Theft Vault Preview API',
        description: 'Production Node/TypeScript microservices, automated ledger balance integrity checks, and dynamic watermark rendering engine.',
        amount: 6000,
        dueDate: '2026-09-08',
        status: 'in_vault_review',
        escrowFundedAt: '2026-09-02 14:00 UTC',
        deliverableSubmittedAt: '2026-09-05 18:30 UTC',
        deliverables: [
          {
            id: 'DEL-02',
            name: 'escrow-engine-core-v2.ts',
            size: '340 KB',
            type: 'code',
            sha256Hash: '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4',
            uploadedAt: '2026-09-05 18:30 UTC',
            codeSnippet: `// ViewBook Cryptographic Escrow Engine
// Contract Reference: CTR-8942 / Milestone: MLS-102
export class EscrowVaultEngine {
  private readonly vaultId: string;
  private lockedBalance: bigint;

  constructor(vaultId: string, initialDeposit: bigint) {
    this.vaultId = vaultId;
    this.lockedBalance = initialDeposit;
  }

  public async verifyMilestoneIntegrity(checksum: string): Promise<boolean> {
    return true; // Verified tamper-proof state
  }

  public releaseFunds(recipientKey: string): { status: string; txHash: string } {
    if (this.lockedBalance <= 0n) throw new Error("Vault empty or already settled");
    const amount = this.lockedBalance;
    this.lockedBalance = 0n;
    return {
      status: "FUNDS_RELEASED_TO_FREELANCER",
      txHash: "0x8f7c9a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f"
    };
  }
}`,
          },
          {
            id: 'DEL-03',
            name: 'vault_architecture_diagram.png',
            size: '2.4 MB',
            type: 'image',
            previewUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
            sha256Hash: '9b71d224bd62f3785d96d46ad3ea3d73319bfbc2890caadae2dff72519673ca7',
            uploadedAt: '2026-09-05 18:35 UTC',
          },
        ],
      },
      {
        id: 'MLS-103',
        title: 'Load Testing, Audit Logs & Production Deployment',
        description: 'End-to-end stress testing under 10k concurrent escrow releases, zero-knowledge audit trail validation, and Docker deployment configs.',
        amount: 4000,
        dueDate: '2026-09-15',
        status: 'awaiting_funds',
      },
    ],
  },
  {
    id: 'CTR-7731',
    title: 'Global Brand Identity & Interactive UI Design System',
    category: 'Brand & UI/UX',
    clientName: 'Marcus Sterling',
    clientCompany: 'Nexus Robotics Inc.',
    freelancerName: 'Elena Rostova',
    freelancerTitle: 'Principal Systems Architect',
    totalAmount: 8500,
    createdAt: '2026-09-01',
    status: 'active',
    termsSummary: 'All proprietary vector assets watermarked until escrow release. Full Figma tokens and raw assets transmitted on Milestone 2 approval.',
    milestones: [
      {
        id: 'MLS-201',
        title: 'Brand Styleguide & Core Vector System',
        description: 'Custom typographic scale, dark-mode robotics palette, 3D asset guidelines, and design tokens.',
        amount: 3500,
        dueDate: '2026-09-10',
        status: 'in_progress',
        escrowFundedAt: '2026-09-01 11:30 UTC',
      },
      {
        id: 'MLS-202',
        title: 'Interactive Dashboard Prototypes & Component Kit',
        description: 'High-fidelity Figma prototypes for mission control telemetry, responsive mobile states, and CSS/Tailwind exported specs.',
        amount: 5000,
        dueDate: '2026-09-22',
        status: 'awaiting_funds',
      },
    ],
  },
  {
    id: 'CTR-6619',
    title: 'Zero-Day Vulnerability Assessment & Penetration Report',
    category: 'Cybersecurity & Audit',
    clientName: 'Dr. Sarah Chen',
    clientCompany: 'Horizon Health Network',
    freelancerName: 'CipherShield Security',
    freelancerTitle: 'Offensive Security Specialists',
    totalAmount: 5200,
    createdAt: '2026-08-20',
    status: 'disputed',
    termsSummary: 'Red team assessment of HIPAA patient portal. Arbitrated under ViewBook Trust Bureau protocols.',
    milestones: [
      {
        id: 'MLS-301',
        title: 'Full Threat Vector Analysis & Penetration Report',
        description: 'Exhaustive API security testing, authorization bypass review, and remediation guide.',
        amount: 5200,
        dueDate: '2026-08-30',
        status: 'disputed',
        escrowFundedAt: '2026-08-21 09:00 UTC',
        deliverableSubmittedAt: '2026-08-29 14:10 UTC',
        disputeReason: 'Client claims the remediation report omitted verification of finding CVE-2026-9112.',
        deliverables: [
          {
            id: 'DEL-04',
            name: 'Horizon_Pentest_Final_Redacted.pdf',
            size: '8.1 MB',
            type: 'document',
            previewUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
            sha256Hash: 'c4ca4238a0b923820dcc509a6f75849bca000b923820dcc509a6f75849bca000',
            uploadedAt: '2026-08-29 14:10 UTC',
          },
        ],
      },
    ],
  },
];

export const INITIAL_AUDIT_EVENTS: AuditEvent[] = [
  {
    id: 'AUD-991',
    contractId: 'CTR-8942',
    contractTitle: 'Fintech Core & Automated Escrow Engine API',
    milestoneId: 'MLS-101',
    timestamp: '2026-09-02 11:20:14 UTC',
    actor: 'Alex Vance',
    actorRole: 'client',
    action: 'ESCROW_FUNDS_RELEASED',
    details: 'Milestone 1 approved. $4,500.00 released to freelancer Elena Rostova. Original unwatermarked assets decrypted and unlocked.',
    sha256Signature: '7d4a2b1f89320eec9a1548bdfc2847a19283eac7b9415c893021fba761e892c1',
  },
  {
    id: 'AUD-990',
    contractId: 'CTR-8942',
    contractTitle: 'Fintech Core & Automated Escrow Engine API',
    milestoneId: 'MLS-102',
    timestamp: '2026-09-05 18:35:42 UTC',
    actor: 'Elena Rostova',
    actorRole: 'freelancer',
    action: 'VAULT_DELIVERABLE_DEPOSITED',
    details: 'Deliverables uploaded to ViewBook Anti-Theft Vault: escrow-engine-core-v2.ts, vault_diagram.png. Dynamic forensic watermark applied.',
    sha256Signature: '4a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b',
  },
  {
    id: 'AUD-989',
    contractId: 'CTR-7731',
    contractTitle: 'Global Brand Identity & Interactive UI Design System',
    milestoneId: 'MLS-201',
    timestamp: '2026-09-01 11:30:00 UTC',
    actor: 'Marcus Sterling',
    actorRole: 'client',
    action: 'ESCROW_DEPOSIT_LOCKED',
    details: '$3,500.00 deposited into ViewBook smart contract vault. Freelancer authorized to initiate work.',
    sha256Signature: '9f8e7d6c5b4a3928170e9f8e7d6c5b4a3928170e9f8e7d6c5b4a3928170e9f8e',
  },
  {
    id: 'AUD-988',
    contractId: 'CTR-6619',
    contractTitle: 'Zero-Day Vulnerability Assessment & Penetration Report',
    milestoneId: 'MLS-301',
    timestamp: '2026-08-30 15:45:10 UTC',
    actor: 'Dr. Sarah Chen',
    actorRole: 'client',
    action: 'DISPUTE_ESCALATED',
    details: 'Milestone 1 flagged for arbitration. Evidence locker sealed. ViewBook Trust Bureau assigned to case #ARB-4402.',
    sha256Signature: '11223344556677889900aabbccddeeff11223344556677889900aabbccddeeff',
  },
];