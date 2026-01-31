import { NextResponse } from 'next/server';
import { ASSETS } from '@/types/assets';
import { generateAllReports } from '@/lib/reportGenerator';
import {
  getReports,
  setReports,
  canGenerateReports,
  getCooldownRemainingMs,
  getCooldownDurationMs
} from '@/lib/reportStore';

export async function POST() {
  try {
    // Check if cooldown period has elapsed
    if (!canGenerateReports()) {
      const remainingMs = getCooldownRemainingMs();
      const remainingMinutes = Math.ceil(remainingMs / 60000);

      return NextResponse.json({
        success: false,
        error: `Reports can only be updated every 5 minutes. Please wait ${remainingMinutes} minute(s).`,
        reports: getReports(),
        cooldownRemainingMs: remainingMs,
        cooldownDurationMs: getCooldownDurationMs()
      }, { status: 429 });
    }

    // Generate fresh reports for all assets using real price data
    const newReports = await generateAllReports(ASSETS);
    setReports(newReports);

    return NextResponse.json({
      success: true,
      reports: newReports,
      generatedAt: new Date().toISOString(),
      message: 'Reports generated successfully with real-time market data',
      cooldownRemainingMs: getCooldownRemainingMs(),
      cooldownDurationMs: getCooldownDurationMs()
    });
  } catch (error) {
    console.error('Error generating reports:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate reports' },
      { status: 500 }
    );
  }
}
