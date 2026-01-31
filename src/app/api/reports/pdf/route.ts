import { NextRequest, NextResponse } from 'next/server';
import { ASSETS } from '@/types/assets';
import { formatReportForPDF, generatePDFHTML } from '@/lib/pdfGenerator';
import { AssetReport } from '@/types/assets';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { symbol, report } = body as { symbol: string; report: AssetReport };

    if (!symbol) {
      return NextResponse.json(
        { success: false, error: 'Symbol parameter is required' },
        { status: 400 }
      );
    }

    if (!report) {
      return NextResponse.json(
        { success: false, error: 'Report data is required' },
        { status: 400 }
      );
    }

    const asset = ASSETS.find(a => a.symbol === symbol);
    if (!asset) {
      return NextResponse.json(
        { success: false, error: 'Asset not found' },
        { status: 404 }
      );
    }

    const pdfData = formatReportForPDF(report, asset);
    const htmlContent = generatePDFHTML(pdfData);

    // Return HTML that can be printed to PDF
    return new NextResponse(htmlContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Content-Disposition': `attachment; filename="${symbol}_report.html"`,
      },
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}
