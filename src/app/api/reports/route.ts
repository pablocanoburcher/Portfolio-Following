import { NextResponse } from 'next/server';
import { ASSETS } from '@/types/assets';
import { generateAllReports } from '@/lib/reportGenerator';
import {
  getReports,
  setReports,
  getLastGeneratedAt,
  getCooldownRemainingMs,
  getCooldownDurationMs
} from '@/lib/reportStore';

// Force dynamic rendering for real-time price data
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    let reports = getReports();

    // If no cached reports, generate initial set
    if (reports.length === 0) {
      reports = await generateAllReports(ASSETS);
      setReports(reports);
    }

    return NextResponse.json({
      success: true,
      reports: reports,
      lastUpdated: getLastGeneratedAt(),
      cooldownRemainingMs: getCooldownRemainingMs(),
      cooldownDurationMs: getCooldownDurationMs()
    });
  } catch (error) {
    console.error('Error fetching reports:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch reports' },
      { status: 500 }
    );
  }
}
