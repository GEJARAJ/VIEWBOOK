import { NextRequest, NextResponse } from 'next/server';
import { EscrowLedgerService } from '@/lib/ledger';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; mId: string }> }
) {
  try {
    const { id: contractId, mId: milestoneId } = await params;
    const body = await req.json();

    const { name, size, type, codeSnippet, previewUrl, actorName } = body;

    if (!name) {
      return NextResponse.json(
        { success: false, error: 'Deliverable name is required' },
        { status: 400 }
      );
    }

    const result = await EscrowLedgerService.depositDeliverable(
      contractId,
      milestoneId,
      {
        name,
        size: size || '1.0 MB',
        type: type || 'code',
        codeSnippet,
        previewUrl,
        actorName: actorName || 'Freelancer',
      }
    );

    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    console.error('API Error [POST /deliverables]:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to deposit deliverable' },
      { status: 400 }
    );
  }
}