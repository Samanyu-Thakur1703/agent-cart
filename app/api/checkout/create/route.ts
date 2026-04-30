import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({
    status: 'running-v7',
    timestamp: new Date().toISOString(),
  });
}

export async function POST(request: NextRequest) {
  try {
    console.log('POST V7 called');
    const body = await request.json();
    const { productId } = body;

    return NextResponse.json({
      success: true,
      version: 'v7',
      productId,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('POST V7 error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
