import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, userId } = body;

    let user;
    if (userId) {
      user = await prisma.user.findUnique({ where: { id: userId } });
    } else if (email) {
      user = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
    }

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User account not found' },
        { status: 404 }
      );
    }

    // In demo environment, accept password match or default 'viewbook123'
    if (password && user.passwordHash && user.passwordHash !== 'pbkdf2:default') {
      if (password !== user.passwordHash && password !== 'viewbook123') {
        return NextResponse.json(
          { success: false, error: 'Invalid credentials. Try "viewbook123"' },
          { status: 401 }
        );
      }
    }

    // Generate lightweight cryptographically secure session token
    const token = `vb_sess_${crypto.randomBytes(24).toString('hex')}`;

    const userData = {
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
    };

    const res = NextResponse.json({
      success: true,
      data: {
        user: userData,
        token,
      },
    });

    // Set cookie for session persistence across tabs
    res.cookies.set('vb_user_id', user.id, {
      path: '/',
      httpOnly: false,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return res;
  } catch (error: any) {
    console.error('API Error [POST /api/auth/login]:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Login failed' },
      { status: 500 }
    );
  }
}