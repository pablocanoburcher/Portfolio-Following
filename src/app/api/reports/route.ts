import { NextResponse } from 'next/server';
import { ASSETS, AssetReport } from '@/types/assets';
import { generateAllReports } from '@/lib/reportGenerator';

// In-memory storage for reports (in production, use a database)
let cachedReports: AssetReport[] = [];

export async function GET() {
  try {
    // If no cached reports, generate initial set
    if (cachedReports.length === 0) {
      cachedReports = generateAllReports(ASSETS);
    }

    return NextResponse.json({
      success: true,
      reports: cachedReports,
      lastUpdated: cachedReports[0]?.generatedAt || null
    });
  } catch (error) {
    console.error('Error fetching reports:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch reports' },
      { status: 500 }
    );
  }
}
