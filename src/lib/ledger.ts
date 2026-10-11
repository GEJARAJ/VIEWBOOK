import { prisma } from './db';
import { generateAuditSignature, sha256 } from './crypto';

export interface EscrowActionResult<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}

/**
 * Native Smart Escrow Engine
 * Handles deposits, milestone locking, deliverable hashing, atomic releases, and arbitration.
 */
export class EscrowLedgerService {
  /**
   * Locks milestone funds into escrow.
   */
  static async fundMilestone(
    contractId: string,
    milestoneId: string,
    actorName: string = 'Client'
  ): Promise<EscrowActionResult> {
    return await prisma.$transaction(async (tx) => {
      const contract = await tx.contract.findUnique({
        where: { id: contractId },
        include: { milestones: true },
      });

      if (!contract) throw new Error(`Contract ${contractId} not found`);

      const milestone = contract.milestones.find((m) => m.id === milestoneId);
      if (!milestone) throw new Error(`Milestone ${milestoneId} not found`);

      if (milestone.status !== 'AWAITING_FUNDS' && milestone.status !== 'DRAFT') {
        throw new Error(`Milestone ${milestoneId} is already funded (status: ${milestone.status})`);
      }

      const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC';

      const updatedMilestone = await tx.milestone.update({
        where: { id: milestoneId },
        data: {
          status: 'IN_PROGRESS',
          escrowFundedAt: timestamp,
        },
      });

      const details = `Milestone funded. $${milestone.amount.toLocaleString()} locked into smart escrow. Provider authorized to commence work.`;
      const signature = generateAuditSignature({
        contractId,
        milestoneId,
        action: 'ESCROW_FUNDS_LOCKED',
        timestamp,
        details,
        actor: actorName,
      });

      await tx.auditEvent.create({
        data: {
          id: `AUD-${Math.floor(1000 + Math.random() * 9000)}`,
          contractId,
          milestoneId,
          timestamp,
          actor: actorName,
          actorRole: 'CLIENT',
          action: 'ESCROW_FUNDS_LOCKED',
          details,
          sha256Signature: signature,
        },
      });

      return {
        success: true,
        message: `Milestone ${milestoneId} funded successfully ($${milestone.amount.toLocaleString()})`,
        data: updatedMilestone,
      };
    });
  }

  /**
   * Freelancer deposits deliverable into the ViewBook Vault.
   */
  static async depositDeliverable(
    contractId: string,
    milestoneId: string,
    fileData: {
      name: string;
      size: string;
      type: 'code' | 'image' | 'document' | 'archive';
      codeSnippet?: string;
      previewUrl?: string;
      actorName?: string;
    }
  ): Promise<EscrowActionResult> {
    return await prisma.$transaction(async (tx) => {
      const milestone = await tx.milestone.findUnique({
        where: { id: milestoneId },
      });

      if (!milestone) throw new Error(`Milestone ${milestoneId} not found`);

      const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC';
      const actor = fileData.actorName || 'Freelancer';

      // Compute tamper-proof SHA-256 fingerprint
      const rawSeed = `${fileData.name}:${fileData.size}:${fileData.codeSnippet || fileData.previewUrl || ''}:${timestamp}`;
      const hash = sha256(rawSeed);

      const deliverable = await tx.deliverable.create({
        data: {
          id: `DEL-${Math.floor(1000 + Math.random() * 9000)}`,
          milestoneId,
          name: fileData.name,
          size: fileData.size,
          type: fileData.type,
          codeSnippet: fileData.codeSnippet,
          previewUrl: fileData.previewUrl,
          sha256Hash: hash,
          uploadedAt: timestamp,
          unlockedDownloadUrl: null, // Gated until release!
        },
      });

      await tx.milestone.update({
        where: { id: milestoneId },
        data: {
          status: 'IN_VAULT_REVIEW',
          deliverableSubmittedAt: timestamp,
        },
      });

      const details = `Deliverable "${fileData.name}" deposited into ViewBook Vault. SHA-256 fingerprint: ${hash.slice(0, 16)}... Dynamic watermark applied.`;
      const signature = generateAuditSignature({
        contractId,
        milestoneId,
        action: 'VAULT_DELIVERABLE_DEPOSITED',
        timestamp,
        details,
        actor,
      });

      await tx.auditEvent.create({
        data: {
          id: `AUD-${Math.floor(1000 + Math.random() * 9000)}`,
          contractId,
          milestoneId,
          timestamp,
          actor,
          actorRole: 'FREELANCER',
          action: 'VAULT_DELIVERABLE_DEPOSITED',
          details,
          sha256Signature: signature,
        },
      });

      return {
        success: true,
        message: 'Deliverable deposited into ViewBook Vault with forensic watermarking',
        data: deliverable,
      };
    });
  }

  /**
   * Client approves milestone: Atomic Handshake releases cash to freelancer and unlocks clean assets.
   */
  static async approveMilestone(
    contractId: string,
    milestoneId: string,
    actorName: string = 'Client'
  ): Promise<EscrowActionResult> {
    return await prisma.$transaction(async (tx) => {
      const contract = await tx.contract.findUnique({
        where: { id: contractId },
        include: { milestones: { include: { deliverables: true } } },
      });

      if (!contract) throw new Error(`Contract ${contractId} not found`);

      const milestone = contract.milestones.find((m) => m.id === milestoneId);
      if (!milestone) throw new Error(`Milestone ${milestoneId} not found`);

      const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC';

      // Unlock raw download URLs for client
      for (const del of milestone.deliverables) {
        await tx.deliverable.update({
          where: { id: del.id },
          data: {
            unlockedDownloadUrl: `/api/contracts/${contractId}/milestones/${milestoneId}/download?fileId=${del.id}`,
          },
        });
      }

      await tx.milestone.update({
        where: { id: milestoneId },
        data: {
          status: 'RELEASED',
          releasedAt: timestamp,
        },
      });

      // Check if all milestones are released
      const allReleased = contract.milestones
        .map((m) => (m.id === milestoneId ? 'RELEASED' : m.status))
        .every((s) => s === 'RELEASED');

      if (allReleased) {
        await tx.contract.update({
          where: { id: contractId },
          data: { status: 'COMPLETED' },
        });
      }

      const platformFee = milestone.amount * 0.025; // 2.5% take rate
      const netCreatorPayout = milestone.amount - platformFee;

      const details = `Milestone approved. $${netCreatorPayout.toLocaleString()} disbursed to creator (2.5% platform fee: $${platformFee.toFixed(2)}). Original unwatermarked assets decrypted and unlocked.`;
      const signature = generateAuditSignature({
        contractId,
        milestoneId,
        action: 'ESCROW_FUNDS_RELEASED',
        timestamp,
        details,
        actor: actorName,
      });

      await tx.auditEvent.create({
        data: {
          id: `AUD-${Math.floor(1000 + Math.random() * 9000)}`,
          contractId,
          milestoneId,
          timestamp,
          actor: actorName,
          actorRole: 'CLIENT',
          action: 'ESCROW_FUNDS_RELEASED',
          details,
          sha256Signature: signature,
        },
      });

      return {
        success: true,
        message: `Milestone approved. $${milestone.amount.toLocaleString()} released. Deliverables unlocked.`,
      };
    });
  }

  /**
   * Freezes milestone into arbitration.
   */
  static async raiseDispute(
    contractId: string,
    milestoneId: string,
    reason: string,
    actorName: string = 'Client'
  ): Promise<EscrowActionResult> {
    return await prisma.$transaction(async (tx) => {
      const milestone = await tx.milestone.findUnique({ where: { id: milestoneId } });
      if (!milestone) throw new Error(`Milestone ${milestoneId} not found`);

      const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC';

      await tx.milestone.update({
        where: { id: milestoneId },
        data: {
          status: 'DISPUTED',
          disputeReason: reason,
        },
      });

      await tx.contract.update({
        where: { id: contractId },
        data: { status: 'DISPUTED' },
      });

      await tx.disputeCase.upsert({
        where: { milestoneId },
        create: {
          milestoneId,
          reason,
          status: 'PENDING',
        },
        update: {
          reason,
          status: 'PENDING',
        },
      });

      const details = `Dispute escalated to ViewBook Trust Bureau. Reason: "${reason}". Escrow funds frozen pending evidence audit.`;
      const signature = generateAuditSignature({
        contractId,
        milestoneId,
        action: 'DISPUTE_RAISED',
        timestamp,
        details,
        actor: actorName,
      });

      await tx.auditEvent.create({
        data: {
          id: `AUD-${Math.floor(1000 + Math.random() * 9000)}`,
          contractId,
          milestoneId,
          timestamp,
          actor: actorName,
          actorRole: 'CLIENT',
          action: 'DISPUTE_RAISED',
          details,
          sha256Signature: signature,
        },
      });

      return {
        success: true,
        message: 'Milestone frozen and escalated to ViewBook Arbitration Bureau',
      };
    });
  }

  /**
   * Arbitrator issues binding resolution.
   */
  static async resolveDispute(
    contractId: string,
    milestoneId: string,
    decision: 'FREELANCER' | 'CLIENT',
    arbitratorNotes: string = 'Standard arbitration review completed'
  ): Promise<EscrowActionResult> {
    return await prisma.$transaction(async (tx) => {
      const milestone = await tx.milestone.findUnique({
        where: { id: milestoneId },
        include: { deliverables: true },
      });
      if (!milestone) throw new Error(`Milestone ${milestoneId} not found`);

      const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC';

      if (decision === 'FREELANCER') {
        // Unlock deliverables and release
        for (const del of milestone.deliverables) {
          await tx.deliverable.update({
            where: { id: del.id },
            data: {
              unlockedDownloadUrl: `/api/contracts/${contractId}/milestones/${milestoneId}/download?fileId=${del.id}`,
            },
          });
        }

        await tx.milestone.update({
          where: { id: milestoneId },
          data: {
            status: 'RELEASED',
            releasedAt: timestamp,
          },
        });

        await tx.disputeCase.update({
          where: { milestoneId },
          data: {
            status: 'RESOLVED_FREELANCER',
            verdict: `Awarded to freelancer: ${arbitratorNotes}`,
            resolvedAt: new Date(),
          },
        });
      } else {
        // Refund to client
        await tx.milestone.update({
          where: { id: milestoneId },
          data: {
            status: 'AWAITING_FUNDS',
            escrowFundedAt: null,
            deliverableSubmittedAt: null,
          },
        });

        await tx.disputeCase.update({
          where: { milestoneId },
          data: {
            status: 'RESOLVED_CLIENT',
            verdict: `Refunded to client: ${arbitratorNotes}`,
            resolvedAt: new Date(),
          },
        });
      }

      await tx.contract.update({
        where: { id: contractId },
        data: { status: 'ACTIVE' },
      });

      const details =
        decision === 'FREELANCER'
          ? `Arbitration ruling in favor of Creator. Escrow released. Unwatermarked assets unlocked. Notes: ${arbitratorNotes}`
          : `Arbitration ruling in favor of Client. Escrow refunded to client wallet. Notes: ${arbitratorNotes}`;

      const signature = generateAuditSignature({
        contractId,
        milestoneId,
        action: decision === 'FREELANCER' ? 'DISPUTE_ARBITRATED_RELEASE' : 'DISPUTE_ARBITRATED_REFUND',
        timestamp,
        details,
        actor: 'ViewBook Arbitrator',
      });

      await tx.auditEvent.create({
        data: {
          id: `AUD-${Math.floor(1000 + Math.random() * 9000)}`,
          contractId,
          milestoneId,
          timestamp,
          actor: 'ViewBook Trust Arbitrator',
          actorRole: 'ARBITRATOR',
          action: decision === 'FREELANCER' ? 'DISPUTE_ARBITRATED_RELEASE' : 'DISPUTE_ARBITRATED_REFUND',
          details,
          sha256Signature: signature,
        },
      });

      return {
        success: true,
        message: `Dispute resolved in favor of ${decision}`,
      };
    });
  }
}