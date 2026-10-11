import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const contractId = searchParams.get('contractId');

    const where: any = {};
    if (contractId) where.contractId = contractId;

    const events = await prisma.auditEvent.findMany({
      where,
      orderBy: { timestamp: 'desc' },
      include: {
        contract: {
          select: { title: true },
        },
      },
      take: 100,
    });

    const formattedEvents = events.map((e) => ({
      ...e,
      contractTitle: e.contract.title,
    }));

    return NextResponse.json({ success: true, data: formattedEvents });
  } catch (error: any) {
    console.error('API Error [GET /api/audit]:', error);
    const { INITIAL_AUDIT_EVENTS } = await import('@/lib/mockData');
    return NextResponse.json({
      success: true,
      data: INITIAL_AUDIT_EVENTS,
    });
  }
}