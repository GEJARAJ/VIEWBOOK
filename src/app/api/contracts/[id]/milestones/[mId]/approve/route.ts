import { NextRequest, NextResponse } from 'next/server';
import { EscrowLedgerService } from '@/lib/ledger';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; mId: string }> }
) {
  try {
    const { id: contractId, mId: milestoneId } = await params;
    const body = await req.json().catch(() => ({}));
    const actorName = body.actorName || 'Client';

    const result = await EscrowLedgerService.approveMilestone(
      contractId,
      milestoneId,
      actorName
    );

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('API Error [POST /approve]:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to approve milestone' },
      { status: 400 }
    );
  }
}