import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    let users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        company: true,
        title: true,
        role: true,
        avatarUrl: true,
        balance: true,
        inEscrow: true,
        withdrawable: true,
      },
      orderBy: { role: 'asc' },
    });

    if (users.length === 0) {
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

      users = await prisma.user.findMany({
        select: {
          id: true,
          email: true,
          name: true,
          company: true,
          title: true,
          role: true,
          avatarUrl: true,
          balance: true,
          inEscrow: true,
          withdrawable: true,
        },
        orderBy: { role: 'asc' },
      });
    }

    return NextResponse.json({ success: true, data: users });
  } catch (error: any) {
    console.error('API Error [GET /api/auth/users]:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to list users' },
      { status: 500 }
    );
  }
}