import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { generateAuditSignature } from '@/lib/crypto';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    const where: any = {};
    if (status && status !== 'all') {
      where.status = status.toUpperCase();
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { clientName: { contains: search } },
        { freelancerName: { contains: search } },
        { category: { contains: search } },
      ];
    }

    const contracts = await prisma.contract.findMany({
      where,
      include: {
        milestones: {
          include: {
            deliverables: true,
            dispute: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, data: contracts });
  } catch (error: any) {
    console.error('API Error [GET /api/contracts]:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      title,
      category,
      clientName,
      clientCompany,
      freelancerName,
      freelancerTitle,
      totalAmount,
      termsSummary,
      milestones,
    } = body;

    if (!title || !clientName || !freelancerName || !milestones || milestones.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Missing required contract fields' },
        { status: 400 }
      );
    }

    const contractId = `CTR-${Math.floor(1000 + Math.random() * 9000)}`;
    const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC';

    const newContract = await prisma.$transaction(async (tx) => {
      const contract = await tx.contract.create({
        data: {
          id: contractId,
          title,
          category: category || 'Engineering & Software',
          clientName,
          clientCompany: clientCompany || clientName,
          freelancerName,
          freelancerTitle: freelancerTitle || 'Service Provider',
          totalAmount: Number(totalAmount) || 0,
          termsSummary: termsSummary || 'ViewBook Zero-Theft Escrow Protocols enforced.',
          status: 'ACTIVE',
          milestones: {
            create: milestones.map((m: any, idx: number) => ({
              id: `MLS-${Math.floor(100 + Math.random() * 900)}`,
              title: m.title || `Phase ${idx + 1}`,
              description: m.description || '',
              amount: Number(m.amount) || 0,
              dueDate: m.dueDate || new Date().toISOString().slice(0, 10),
              status: 'AWAITING_FUNDS',
            })),
          },
        },
        include: {
          milestones: true,
        },
      });

      const details = `Contract established between ${clientName} (${clientCompany}) and ${freelancerName} for $${Number(totalAmount).toLocaleString()}.`;
      const signature = generateAuditSignature({
        contractId,
        action: 'CONTRACT_ESTABLISHED',
        timestamp,
        details,
        actor: clientName,
      });

      await tx.auditEvent.create({
        data: {
          id: `AUD-${Math.floor(1000 + Math.random() * 9000)}`,
          contractId,
          timestamp,
          actor: clientName,
          actorRole: 'CLIENT',
          action: 'CONTRACT_ESTABLISHED',
          details,
          sha256Signature: signature,
        },
      });

      return contract;
    });

    return NextResponse.json({ success: true, data: newContract }, { status: 201 });
  } catch (error: any) {
    console.error('API Error [POST /api/contracts]:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}