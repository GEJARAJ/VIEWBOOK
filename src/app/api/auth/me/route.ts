import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const queryUserId = searchParams.get('userId');
    const cookieUserId = req.cookies.get('vb_user_id')?.value;

    const targetId = queryUserId || cookieUserId;

    let user;
    if (targetId) {
      user = await prisma.user.findUnique({ where: { id: targetId } });
    }

    // Default fallback to first client if no session yet
    if (!user) {
      user = await prisma.user.findFirst({
        where: { role: 'CLIENT' },
        orderBy: { createdAt: 'asc' },
      });
    }

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'No active user found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        company: user.company,
        title: user.title,
        role: user.role,
        avatarUrl: user.avatarUrl,
        balance: user.balance,
        inEscrow: user.inEscrow,
        withdrawable: user.withdrawable,
      },
    });
  } catch (error: any) {
    console.error('API Error [GET /api/auth/me]:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Session lookup failed' },
      { status: 500 }
    );
  }
}