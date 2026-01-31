import { NextRequest, NextResponse } from 'next/server';
import { ASSETS } from '@/types/assets';
import { generateReport } from '@/lib/reportGenerator';
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

    // Generate fresh report for the asset
    const report = generateReport(asset);
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
