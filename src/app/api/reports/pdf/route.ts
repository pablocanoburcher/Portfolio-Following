import { NextRequest, NextResponse } from 'next/server';
import { ASSETS } from '@/types/assets';
import { getReports } from '@/lib/reportStore';
import { formatReportForPDF, generatePDFHTML } from '@/lib/pdfGenerator';

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
    const report = cachedReports.find(r => r.symbol === symbol);

    if (!report) {
      return NextResponse.json(
        { success: false, error: 'Report not found. Please generate reports first.' },
        { status: 404 }
      );
    }

    const pdfData = formatReportForPDF(report, asset);
    const htmlContent = generatePDFHTML(pdfData);

    // Return HTML that can be printed to PDF
    // In production, you would use Puppeteer or similar to convert to actual PDF
    return new NextResponse(htmlContent, {
      headers: {
        'Content-Type': 'text/html',
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
