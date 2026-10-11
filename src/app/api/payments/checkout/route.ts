import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { EscrowLedgerService } from '@/lib/ledger';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      contractId,
      milestoneId,
      paymentMethod = 'CREDIT_CARD',
      cardDetails,
      userId,
    } = body;

    if (!contractId || !milestoneId) {
      return NextResponse.json(
        { success: false, error: 'Contract ID and Milestone ID are required' },
        { status: 400 }
      );
    }

    const milestone = await prisma.milestone.findUnique({
      where: { id: milestoneId },
      include: { contract: true },
    });

    if (!milestone) {
      return NextResponse.json(
        { success: false, error: 'Milestone not found' },
        { status: 404 }
      );
    }

    if (milestone.status !== 'AWAITING_FUNDS' && milestone.status !== 'DRAFT') {
      return NextResponse.json(
        { success: false, error: `Milestone is already funded (status: ${milestone.status})` },
        { status: 400 }
      );
    }

    // Resolve paying user
    let user = userId ? await prisma.user.findUnique({ where: { id: userId } }) : null;
    if (!user) {
      user = await prisma.user.findFirst({
        where: { name: milestone.contract.clientName },
      }) || await prisma.user.findFirst({ where: { role: 'CLIENT' } });
    }

    // If using internal ESCROW_WALLET, check balance
    if (paymentMethod === 'ESCROW_WALLET' && user) {
      if (user.balance < milestone.amount) {
        return NextResponse.json(
          {
            success: false,
            error: `Insufficient wallet balance. Available: $${user.balance.toLocaleString()}, Required: $${milestone.amount.toLocaleString()}`,
          },
          { status: 400 }
        );
      }
    }

    const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC';
    const txId = `TX-${Math.floor(100000 + Math.random() * 900000)}`;
    const txHash = crypto
      .createHash('sha256')
      .update(`${txId}-${contractId}-${milestoneId}-${milestone.amount}-${timestamp}`)
      .digest('hex');

    const cardLast4 =
      paymentMethod === 'CREDIT_CARD' && cardDetails?.cardNumber
        ? cardDetails.cardNumber.replace(/\s+/g, '').slice(-4)
        : null;

    // Record payment transaction and update milestone atomically
    const [transaction, ledgerResult] = await prisma.$transaction(async (tx) => {
      // 1. Create transaction receipt
      const createdTx = await tx.transaction.create({
        data: {
          id: txId,
          contractId,
          milestoneId,
          userId: user?.id || null,
          userEmail: user?.email || null,
          userName: user?.name || milestone.contract.clientName,
          amount: milestone.amount,
          method: paymentMethod,
          status: 'SETTLED',
          cardLast4,
          txHash,
        },
      });

      // 2. If paid via wallet, deduct balance and add to inEscrow
      if (paymentMethod === 'ESCROW_WALLET' && user) {
        await tx.user.update({
          where: { id: user.id },
          data: {
            balance: { decrement: milestone.amount },
            inEscrow: { increment: milestone.amount },
          },
        });
      } else if (user) {
        // If paid via Card/Wire, increment user's inEscrow tracking
        await tx.user.update({
          where: { id: user.id },
          data: {
            inEscrow: { increment: milestone.amount },
          },
        });
      }

      return [createdTx, null];
    });

    // Execute smart escrow funding transition
    const fundingResult = await EscrowLedgerService.fundMilestone(
      contractId,
      milestoneId,
      user?.name || milestone.contract.clientName
    );

    return NextResponse.json({
      success: true,
      data: {
        receipt: {
          transactionId: transaction.id,
          amount: transaction.amount,
          method: transaction.method,
          cardLast4: transaction.cardLast4,
          txHash: transaction.txHash,
          timestamp,
          clientName: user?.name || milestone.contract.clientName,
          contractTitle: milestone.contract.title,
          milestoneTitle: milestone.title,
        },
        milestone: (fundingResult.data as any)?.milestone,
      },
    });
  } catch (error: any) {
    console.error('API Error [POST /api/payments/checkout]:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Checkout processing failed' },
      { status: 500 }
    );
  }
}