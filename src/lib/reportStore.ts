import { AssetReport } from '@/types/assets';
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

// 5 minutes in milliseconds
const COOLDOWN_DURATION_MS = 5 * 60 * 1000;

interface ReportStore {
  reports: AssetReport[];
  lastGeneratedAt: number | null;
}

// Use a file in the project's temp directory for persistence
const DATA_DIR = join(process.cwd(), '.report-cache');
const STORE_FILE = join(DATA_DIR, 'reports.json');

function ensureDataDir(): void {
  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true });
  }
}

function loadStore(): ReportStore {
  try {
    ensureDataDir();
    if (existsSync(STORE_FILE)) {
      const data = readFileSync(STORE_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading report store:', error);
  }
  return { reports: [], lastGeneratedAt: null };
}

function saveStore(store: ReportStore): void {
  try {
    ensureDataDir();
    writeFileSync(STORE_FILE, JSON.stringify(store, null, 2));
  } catch (error) {
    console.error('Error saving report store:', error);
  }
}

export function getReports(): AssetReport[] {
  return loadStore().reports;
}

export function setReports(reports: AssetReport[]): void {
  const store: ReportStore = {
    reports,
    lastGeneratedAt: Date.now()
  };
  saveStore(store);
}

export function getLastGeneratedAt(): number | null {
  return loadStore().lastGeneratedAt;
}

export function getCooldownRemainingMs(): number {
  const lastGeneratedAt = loadStore().lastGeneratedAt;
  if (lastGeneratedAt === null) {
    return 0;
  }
  const elapsed = Date.now() - lastGeneratedAt;
  const remaining = COOLDOWN_DURATION_MS - elapsed;
  return Math.max(0, remaining);
}

export function canGenerateReports(): boolean {
  return getCooldownRemainingMs() === 0;
}

export function getCooldownDurationMs(): number {
  return COOLDOWN_DURATION_MS;
}
