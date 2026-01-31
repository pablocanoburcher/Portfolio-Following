import { AssetReport } from '@/types/assets';

// 5 minutes in milliseconds
const COOLDOWN_DURATION_MS = 5 * 60 * 1000;

interface ReportStore {
  reports: AssetReport[];
  lastGeneratedAt: number | null;
}

// Shared in-memory store for reports
const store: ReportStore = {
  reports: [],
  lastGeneratedAt: null
};

export function getReports(): AssetReport[] {
  return store.reports;
}

export function setReports(reports: AssetReport[]): void {
  store.reports = reports;
  store.lastGeneratedAt = Date.now();
}

export function getLastGeneratedAt(): number | null {
  return store.lastGeneratedAt;
}

export function getCooldownRemainingMs(): number {
  if (store.lastGeneratedAt === null) {
    return 0;
  }
  const elapsed = Date.now() - store.lastGeneratedAt;
  const remaining = COOLDOWN_DURATION_MS - elapsed;
  return Math.max(0, remaining);
}

export function canGenerateReports(): boolean {
  return getCooldownRemainingMs() === 0;
}

export function getCooldownDurationMs(): number {
  return COOLDOWN_DURATION_MS;
}
