import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; mId: string }> }
) {
  try {
    const { id: contractId, mId: milestoneId } = await params;
    const { searchParams } = new URL(req.url);
    const fileId = searchParams.get('fileId');

    const milestone = await prisma.milestone.findUnique({
      where: { id: milestoneId },
      include: {
        deliverables: true,
        contract: true,
      },
    });

    if (!milestone) {
      return NextResponse.json(
        { success: false, error: 'Milestone not found' },
        { status: 404 }
      );
    }

    // THEFT-PROOF SECURITY ENFORCEMENT:
    // Raw assets can ONLY be downloaded if milestone status is strictly 'RELEASED'!
    if (milestone.status !== 'RELEASED') {
      return NextResponse.json(
        {
          success: false,
          error: 'ACCESS DENIED [HTTP 403]: Raw unwatermarked deliverable is locked. Client must approve milestone to release escrow before raw files can be retrieved.',
          status: milestone.status,
          tamperHash: milestone.deliverables[0]?.sha256Hash || 'LOCKED',
        },
        { status: 403 }
      );
    }

    const deliverable = fileId
      ? milestone.deliverables.find((d) => d.id === fileId)
      : milestone.deliverables[0];

    if (!deliverable) {
      return NextResponse.json(
        { success: false, error: 'Deliverable file not found' },
        { status: 404 }
      );
    }

    // If it's a code snippet, stream clean source code
    if (deliverable.type === 'code' && deliverable.codeSnippet) {
      return new NextResponse(deliverable.codeSnippet, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Content-Disposition': `attachment; filename="${deliverable.name}"`,
          'X-ViewBook-Integrity': deliverable.sha256Hash,
        },
      });
    }

    // For documents or images with a previewUrl, redirect to clean asset or return download payload
    if (deliverable.previewUrl) {
      return NextResponse.redirect(deliverable.previewUrl);
    }

    return new NextResponse(`ViewBook Authenticated Asset: ${deliverable.name}\nSHA-256: ${deliverable.sha256Hash}\nReleased at: ${milestone.releasedAt}`, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Content-Disposition': `attachment; filename="${deliverable.name}.txt"`,
      },
    });
  } catch (error: any) {
    console.error('API Error [GET /download]:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}