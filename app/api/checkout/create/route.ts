import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({
    status: 'running',
    env: {
      hasApiKey: !!process.env.LOCUS_API_KEY,
      apiBase: process.env.LOCUS_API_BASE_URL,
    }
  });
}

export async function POST(request: NextRequest) {
  try {
    // Just return success without reading body
    return NextResponse.json({
      success: true,
      message: 'Checkout endpoint working',
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
