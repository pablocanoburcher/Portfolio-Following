import { NextRequest, NextResponse } from 'next/server';
import { ASSETS } from '@/types/assets';
import { getReports } from '@/lib/reportStore';
import { formatReportForPDF, generatePDFHTML } from '@/lib/pdfGenerator';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get('symbol');

    if (!symbol) {
      return NextResponse.json(
        { success: false, error: 'Symbol parameter is required' },
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

    // Use cached report to ensure consistency with displayed data
    const cachedReports = getReports();
    console.log(`PDF route: Found ${cachedReports.length} cached reports for symbol ${symbol}`);

    const report = cachedReports.find(r => r.symbol === symbol);

    if (!report) {
      console.log(`PDF route: Report not found for ${symbol}. Available symbols:`, cachedReports.map(r => r.symbol));
      return NextResponse.json(
        { success: false, error: 'Report not found. Please generate reports first.' },
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
