import { NextRequest, NextResponse } from 'next/server';
import { EscrowLedgerService } from '@/lib/ledger';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; mId: string }> }
) {
  try {
    const { id: contractId, mId: milestoneId } = await params;
    const body = await req.json();

    const { reason, actorName } = body;
    if (!reason) {
      return NextResponse.json(
        { success: false, error: 'Dispute reason is required' },
        { status: 400 }
      );
    }

    const result = await EscrowLedgerService.raiseDispute(
      contractId,
      milestoneId,
      reason,
      actorName || 'Client'
    );

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('API Error [POST /dispute]:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to raise dispute' },
      { status: 400 }
    );
  }
}