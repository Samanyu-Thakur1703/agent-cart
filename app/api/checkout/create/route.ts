import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({
    status: 'running-v8',
    timestamp: new Date().toISOString(),
    env: !!process.env.LOCUS_API_KEY,
  });
}

export async function POST(request: NextRequest) {
  try {
    console.log('POST V8 called');
    
    // Use request.body directly (Next.js 14 feature)
    const body = request.body;
    console.log('Body:', body);
    
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
    }

    const { productId } = body;

    return NextResponse.json({
      success: true,
      version: 'v8',
      productId: productId || 'none',
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('POST V8 error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
