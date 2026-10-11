import { NextRequest, NextResponse } from 'next/server';
import { EscrowLedgerService } from '@/lib/ledger';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; mId: string }> }
) {
  try {
    const { id: contractId, mId: milestoneId } = await params;
    const body = await req.json();

    const { decision, arbitratorNotes } = body;
    if (decision !== 'FREELANCER' && decision !== 'CLIENT') {
      return NextResponse.json(
        { success: false, error: 'Decision must be FREELANCER or CLIENT' },
        { status: 400 }
      );
    }

    const result = await EscrowLedgerService.resolveDispute(
      contractId,
      milestoneId,
      decision,
      arbitratorNotes || 'Arbitrator verdict applied'
    );

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('API Error [POST /arbitrate]:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to arbitrate dispute' },
      { status: 400 }
    );
  }
}