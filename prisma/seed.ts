import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding ViewBook Escrow database...');

  // Clean existing records
  await prisma.auditEvent.deleteMany();
  await prisma.disputeCase.deleteMany();
  await prisma.deliverable.deleteMany();
  await prisma.milestone.deleteMany();
  await prisma.contract.deleteMany();
  await prisma.user.deleteMany();

  // 1. Seed Users
  await prisma.user.createMany({
    data: [
      {
        id: 'usr-client-1',
        email: 'alex@aetheria.capital',
        name: 'Alex Vance',
        company: 'Aetheria Capital Ltd',
        title: 'Managing Director & Client',
        passwordHash: 'viewbook123',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        role: 'CLIENT',
        balance: 35000,
        inEscrow: 9500,
        withdrawable: 0,
      },
      {
        id: 'usr-freelancer-1',
        email: 'elena@rostova.systems',
        name: 'Elena Rostova',
        company: 'Rostova Architecture Lab',
        title: 'Principal Systems Architect',
        passwordHash: 'viewbook123',
        avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
        role: 'FREELANCER',
        balance: 0,
        inEscrow: 9500,
        withdrawable: 18500,
      },
      {
        id: 'usr-arbitrator-1',
        email: 'trust@viewbook.internal',
        name: 'ViewBook Trust Bureau',
        company: 'Neutral Escrow Tribunal',
        title: 'Senior Commercial Arbitrator',
        passwordHash: 'viewbook123',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
        role: 'ARBITRATOR',
        balance: 500000,
        inEscrow: 0,
        withdrawable: 0,
      },
    ],
  });

  // 2. Seed Contract 1: Fintech Core & Automated Escrow Engine API
  const contract1 = await prisma.contract.create({
    data: {
      id: 'CTR-8942',
      title: 'Fintech Core & Automated Escrow Engine API',
      category: 'Backend & Financial Systems',
      clientName: 'Alex Vance',
      clientCompany: 'Aetheria Capital Ltd',
      freelancerName: 'Elena Rostova',
      freelancerTitle: 'Principal Systems Architect',
      totalAmount: 14500,
      status: 'ACTIVE',
      termsSummary:
        'Non-disclosure enforced. Milestone escrow deposit required prior to stage work. Deliverables protected by ViewBook Vault until release.',
      milestones: {
        create: [
          {
            id: 'MLS-101',
            title: 'Cryptographic Specs & Architecture Blueprint',
            description:
              'Detailed system design, database schema, multi-sig escrow logic, and threat model documentation.',
            amount: 4500,
            dueDate: '2026-09-02',
            status: 'RELEASED',
            escrowFundedAt: '2026-08-29 10:15 UTC',
            deliverableSubmittedAt: '2026-09-01 16:40 UTC',
            releasedAt: '2026-09-02 11:20 UTC',
            deliverables: {
              create: [
                {
                  id: 'DEL-01',
                  name: 'Aetheria_Architecture_Spec_v1.0.pdf',
                  size: '4.8 MB',
                  type: 'document',
                  previewUrl:
                    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
                  sha256Hash:
                    'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
                  uploadedAt: '2026-09-01 16:40 UTC',
                  unlockedDownloadUrl:
                    '/api/contracts/CTR-8942/milestones/MLS-101/download?fileId=DEL-01',
                },
              ],
            },
          },
          {
            id: 'MLS-102',
            title: 'Core Escrow Engine & Anti-Theft Vault Preview API',
            description:
              'Production Node/TypeScript microservices, automated ledger balance integrity checks, and dynamic watermark rendering engine.',
            amount: 6000,
            dueDate: '2026-09-08',
            status: 'IN_VAULT_REVIEW',
            escrowFundedAt: '2026-09-02 14:00 UTC',
            deliverableSubmittedAt: '2026-09-05 18:30 UTC',
            deliverables: {
              create: [
                {
                  id: 'DEL-02',
                  name: 'escrow-engine-core-v2.ts',
                  size: '340 KB',
                  type: 'code',
                  sha256Hash:
                    '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4',
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
                  previewUrl:
                    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
                  sha256Hash:
                    '9b71d224bd62f3785d96d46ad3ea3d73319bfbc2890caadae2dff72519673ca7',
                  uploadedAt: '2026-09-05 18:35 UTC',
                },
              ],
            },
          },
          {
            id: 'MLS-103',
            title: 'Load Testing, Audit Logs & Production Deployment',
            description:
              'End-to-end stress testing under 10k concurrent escrow releases, zero-knowledge audit trail validation, and Docker deployment configs.',
            amount: 4000,
            dueDate: '2026-09-15',
            status: 'AWAITING_FUNDS',
          },
        ],
      },
      auditEvents: {
        create: [
          {
            id: 'AUD-991',
            milestoneId: 'MLS-101',
            timestamp: '2026-09-02 11:20:14 UTC',
            actor: 'Alex Vance',
            actorRole: 'CLIENT',
            action: 'ESCROW_FUNDS_RELEASED',
            details:
              'Milestone 1 approved. $4,500.00 released to freelancer Elena Rostova. Original unwatermarked assets decrypted and unlocked.',
            sha256Signature:
              '7d4a2b1f89320eec9a1548bdfc2847a19283eac7b9415c893021fba761e892c1',
          },
          {
            id: 'AUD-990',
            milestoneId: 'MLS-102',
            timestamp: '2026-09-05 18:35:42 UTC',
            actor: 'Elena Rostova',
            actorRole: 'FREELANCER',
            action: 'VAULT_DELIVERABLE_DEPOSITED',
            details:
              'Deliverables uploaded to ViewBook Anti-Theft Vault: escrow-engine-core-v2.ts, vault_diagram.png. Dynamic forensic watermark applied.',
            sha256Signature:
              '4a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b',
          },
        ],
      },
    },
  });

  // 3. Seed Contract 2: Global Brand Identity & Interactive Design System
  await prisma.contract.create({
    data: {
      id: 'CTR-7731',
      title: 'Global Brand Identity & Interactive UI Design System',
      category: 'Brand & UI/UX',
      clientName: 'Marcus Sterling',
      clientCompany: 'Nexus Robotics Inc.',
      freelancerName: 'Elena Rostova',
      freelancerTitle: 'Principal Systems Architect',
      totalAmount: 8500,
      status: 'ACTIVE',
      termsSummary:
        'All proprietary vector assets watermarked until escrow release. Full Figma tokens and raw assets transmitted on Milestone 2 approval.',
      milestones: {
        create: [
          {
            id: 'MLS-201',
            title: 'Brand Styleguide & Core Vector System',
            description:
              'Custom typographic scale, dark-mode robotics palette, 3D asset guidelines, and design tokens.',
            amount: 3500,
            dueDate: '2026-09-10',
            status: 'IN_PROGRESS',
            escrowFundedAt: '2026-09-01 11:30 UTC',
          },
          {
            id: 'MLS-202',
            title: 'Interactive Dashboard Prototypes & Component Kit',
            description:
              'High-fidelity Figma prototypes for mission control telemetry, responsive mobile states, and CSS/Tailwind exported specs.',
            amount: 5000,
            dueDate: '2026-09-22',
            status: 'AWAITING_FUNDS',
          },
        ],
      },
      auditEvents: {
        create: [
          {
            id: 'AUD-989',
            milestoneId: 'MLS-201',
            timestamp: '2026-09-01 11:30:00 UTC',
            actor: 'Marcus Sterling',
            actorRole: 'CLIENT',
            action: 'ESCROW_FUNDS_LOCKED',
            details:
              '$3,500.00 deposited into ViewBook smart contract vault. Freelancer authorized to initiate work.',
            sha256Signature:
              '9f8e7d6c5b4a3928170e9f8e7d6c5b4a3928170e9f8e7d6c5b4a3928170e9f8e',
          },
        ],
      },
    },
  });

  // 4. Seed Contract 3: Cybersecurity Audit (Disputed)
  await prisma.contract.create({
    data: {
      id: 'CTR-6619',
      title: 'Zero-Day Vulnerability Assessment & Penetration Report',
      category: 'Cybersecurity & Audit',
      clientName: 'Dr. Sarah Chen',
      clientCompany: 'Horizon Health Network',
      freelancerName: 'CipherShield Security',
      freelancerTitle: 'Offensive Security Specialists',
      totalAmount: 5200,
      status: 'DISPUTED',
      termsSummary:
        'Red team assessment of HIPAA patient portal. Arbitrated under ViewBook Trust Bureau protocols.',
      milestones: {
        create: [
          {
            id: 'MLS-301',
            title: 'Full Threat Vector Analysis & Penetration Report',
            description:
              'Exhaustive API security testing, authorization bypass review, and remediation guide.',
            amount: 5200,
            dueDate: '2026-08-30',
            status: 'DISPUTED',
            escrowFundedAt: '2026-08-21 09:00 UTC',
            deliverableSubmittedAt: '2026-08-29 14:10 UTC',
            disputeReason:
              'Client claims the remediation report omitted verification of finding CVE-2026-9112.',
            deliverables: {
              create: [
                {
                  id: 'DEL-04',
                  name: 'Horizon_Pentest_Final_Redacted.pdf',
                  size: '8.1 MB',
                  type: 'document',
                  previewUrl:
                    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
                  sha256Hash:
                    'c4ca4238a0b923820dcc509a6f75849bca000b923820dcc509a6f75849bca000',
                  uploadedAt: '2026-08-29 14:10 UTC',
                },
              ],
            },
            dispute: {
              create: {
                reason:
                  'Client claims the remediation report omitted verification of finding CVE-2026-9112.',
                status: 'PENDING',
              },
            },
          },
        ],
      },
      auditEvents: {
        create: [
          {
            id: 'AUD-988',
            milestoneId: 'MLS-301',
            timestamp: '2026-08-30 15:45:10 UTC',
            actor: 'Dr. Sarah Chen',
            actorRole: 'CLIENT',
            action: 'DISPUTE_RAISED',
            details:
              'Milestone 1 flagged for arbitration. Evidence locker sealed. ViewBook Trust Bureau assigned to case #ARB-4402.',
            sha256Signature:
              '11223344556677889900aabbccddeeff11223344556677889900aabbccddeeff',
          },
        ],
      },
    },
  });

  console.log('ViewBook database successfully seeded with 3 contracts, deliverables, and audit logs.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });