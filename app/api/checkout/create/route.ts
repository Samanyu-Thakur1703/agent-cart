import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({ status: 'running-v5', timestamp: new Date().toISOString() });
}

export async function POST(request: NextRequest) {
  try {
    console.log('POST V5 called');
    const body = await request.json();
    const { productId } = body;

    return NextResponse.json({
      success: true,
      version: 'v5-with-body',
      productId,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('POST error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
