import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, company, title, role, password, startingBalance } = body;

    if (!name || !email) {
      return NextResponse.json(
        { success: false, error: 'Name and email are required' },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();
    const existing = await prisma.user.findUnique({ where: { email: cleanEmail } });
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'An account with this email already exists' },
        { status: 409 }
      );
    }

    const userRole = (role?.toUpperCase() === 'FREELANCER' ? 'FREELANCER' : 'CLIENT') as 'CLIENT' | 'FREELANCER';
    const initBalance = Number(startingBalance) || (userRole === 'CLIENT' ? 25000 : 0);

    const newUser = await prisma.user.create({
      data: {
        email: cleanEmail,
        name,
        company: company || (userRole === 'CLIENT' ? `${name} Ventures` : `${name} Studio`),
        title: title || (userRole === 'CLIENT' ? 'Client Representative' : 'Senior Specialist'),
        role: userRole,
        passwordHash: password || 'viewbook123',
        avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name)}`,
        balance: initBalance,
        inEscrow: 0,
        withdrawable: 0,
      },
    });

    const token = `vb_sess_${crypto.randomBytes(24).toString('hex')}`;

    const res = NextResponse.json({
      success: true,
      data: {
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          company: newUser.company,
          title: newUser.title,
          role: newUser.role,
          avatarUrl: newUser.avatarUrl,
          balance: newUser.balance,
          inEscrow: newUser.inEscrow,
          withdrawable: newUser.withdrawable,
        },
        token,
      },
    }, { status: 201 });

    res.cookies.set('vb_user_id', newUser.id, {
      path: '/',
      httpOnly: false,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
    });

    return res;
  } catch (error: any) {
    console.error('API Error [POST /api/auth/register]:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Registration failed' },
      { status: 500 }
    );
  }
}