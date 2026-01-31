import { AssetReport } from '@/types/assets';
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

// 5 minutes in milliseconds
const COOLDOWN_DURATION_MS = 5 * 60 * 1000;

interface ReportStore {
  reports: AssetReport[];
  lastGeneratedAt: number | null;
}

// Use a file in the project's directory for persistence
// Using process.cwd() to get the project root
const DATA_DIR = join(process.cwd(), '.report-cache');
const STORE_FILE = join(DATA_DIR, 'reports.json');

// Log paths once on module load for debugging
console.log('[ReportStore] Data directory:', DATA_DIR);
console.log('[ReportStore] Store file:', STORE_FILE);

function ensureDataDir(): void {
  if (!existsSync(DATA_DIR)) {
    console.log('[ReportStore] Creating data directory:', DATA_DIR);
    mkdirSync(DATA_DIR, { recursive: true });
  }
}

function loadStore(): ReportStore {
  try {
    ensureDataDir();
    if (existsSync(STORE_FILE)) {
      const data = readFileSync(STORE_FILE, 'utf-8');
      const store = JSON.parse(data);
      console.log(`[ReportStore] Loaded ${store.reports?.length || 0} reports from cache`);
      return store;
    } else {
      console.log('[ReportStore] No cache file exists yet');
    }
  } catch (error) {
    console.error('[ReportStore] Error loading store:', error);
  }
  return { reports: [], lastGeneratedAt: null };
}

function saveStore(store: ReportStore): void {
  try {
    ensureDataDir();
    writeFileSync(STORE_FILE, JSON.stringify(store, null, 2));
    console.log(`[ReportStore] Saved ${store.reports.length} reports to cache`);
  } catch (error) {
    console.error('[ReportStore] Error saving store:', error);
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
