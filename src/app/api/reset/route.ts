import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { INITIAL_CONTRACTS, INITIAL_AUDIT_EVENTS } from '@/lib/mockData';

export async function POST(req: NextRequest) {
  try {
    // Clear all tables
    await prisma.auditEvent.deleteMany();
    await prisma.disputeCase.deleteMany();
    await prisma.deliverable.deleteMany();
    await prisma.milestone.deleteMany();
    await prisma.contract.deleteMany();
    // Re-seed default users
    await prisma.user.createMany({
      data: [
        {
          email: 'alex.vance@vancetech.io',
          name: 'Alex Vance',
          company: 'Vance Tech Capital',
          title: 'Founding Partner & VP Product',
          role: 'CLIENT',
          passwordHash: 'viewbook123',
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          balance: 50000.0,
          inEscrow: 0.0,
          withdrawable: 0.0,
        },
        {
          email: 'elena.rostova@sovstudios.design',
          name: 'Elena Rostova',
          company: 'Sovereign Design Bureau',
          title: 'Lead Systems Architect & Design Director',
          role: 'FREELANCER',
          passwordHash: 'viewbook123',
          avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
          balance: 0.0,
          inEscrow: 0.0,
          withdrawable: 0.0,
        },
        {
          email: 'trust.bureau@viewbook.network',
          name: 'ViewBook Trust Bureau',
          company: 'Independent Escrow Arbitration Panel',
          title: 'Neutral Senior Arbitrator #409',
          role: 'ARBITRATOR',
          passwordHash: 'viewbook123',
          avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
          balance: 0.0,
          inEscrow: 0.0,
          withdrawable: 0.0,
        },
      ],
    });

    // Re-seed contracts
    for (const c of INITIAL_CONTRACTS) {
      await prisma.contract.create({
        data: {
          id: c.id,
          title: c.title,
          category: c.category,
          clientName: c.clientName,
          clientCompany: c.clientCompany,
          freelancerName: c.freelancerName,
          freelancerTitle: c.freelancerTitle,
          totalAmount: c.totalAmount,
          status: c.status.toUpperCase(),
          termsSummary: c.termsSummary,
          milestones: {
            create: c.milestones.map((m) => ({
              id: m.id,
              title: m.title,
              description: m.description,
              amount: m.amount,
              dueDate: m.dueDate,
              status: m.status.toUpperCase(),
              escrowFundedAt: m.escrowFundedAt || null,
              deliverableSubmittedAt: m.deliverableSubmittedAt || null,
              releasedAt: m.releasedAt || null,
              disputeReason: m.disputeReason || null,
              deliverables: {
                create: (m.deliverables || []).map((d) => ({
                  id: d.id,
                  name: d.name,
                  size: d.size,
                  type: d.type,
                  previewUrl: d.previewUrl || null,
                  codeSnippet: d.codeSnippet || null,
                  sha256Hash: d.sha256Hash,
                  unlockedDownloadUrl: d.unlockedDownloadUrl || null,
                  uploadedAt: d.uploadedAt,
                })),
              },
            })),
          },
        },
      });
    }

    // Re-seed audit events
    for (const a of INITIAL_AUDIT_EVENTS) {
      await prisma.auditEvent.create({
        data: {
          id: a.id,
          contractId: a.contractId,
          milestoneId: a.milestoneId || null,
          timestamp: a.timestamp,
          actor: a.actor,
          actorRole: a.actorRole.toUpperCase(),
          action: a.action,
          details: a.details,
          sha256Signature: a.sha256Signature,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Database reset to verified production baseline',
    });
  } catch (error: any) {
    console.error('API Error [POST /api/reset]:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}