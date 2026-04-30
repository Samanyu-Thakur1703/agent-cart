import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({
    status: 'running-v6',
    timestamp: new Date().toISOString(),
  });
}

export async function POST(request: NextRequest) {
  try {
    // Read body as text
    const text = await request.text();
    console.log('Received text:', text);
    
    // Try to parse
    let productId = 'default';
    try {
      const body = JSON.parse(text);
      productId = body.productId || 'default';
    } catch (e) {
      console.log('JSON parse failed, using default');
    }
    
    return NextResponse.json({
      success: true,
      version: 'v6',
      productId,
      message: 'Direct response - no request.json()',
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
