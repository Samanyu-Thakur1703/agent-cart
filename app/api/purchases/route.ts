import { NextRequest, NextResponse } from 'next/server';
import { getAllPurchases } from '@/lib/db';

export async function GET() {
  try {
    const purchases = getAllPurchases();
    return NextResponse.json({ purchases });
  } catch (error: any) {
    console.error('Get purchases error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to get purchases' },
      { status: 500 }
    );
  }
}
