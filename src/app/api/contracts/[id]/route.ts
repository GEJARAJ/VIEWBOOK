import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const contract = await prisma.contract.findUnique({
      where: { id },
      include: {
        milestones: {
          include: {
            deliverables: true,
            dispute: true,
          },
          orderBy: { dueDate: 'asc' },
        },
        auditEvents: {
          orderBy: { timestamp: 'desc' },
        },
      },
    });

    if (!contract) {
      return NextResponse.json(
        { success: false, error: `Contract ${id} not found` },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: contract });
  } catch (error: any) {
    console.error(`API Error [GET /api/contracts/[id]]:`, error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}