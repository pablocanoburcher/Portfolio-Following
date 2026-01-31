'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import ReportCard from '@/components/ReportCard';
import UpdateReportsButton from '@/components/UpdateReportsButton';
import NotificationModal from '@/components/NotificationModal';
import { ASSETS, AssetReport } from '@/types/assets';
import { FileText, Loader2, AlertCircle } from 'lucide-react';

export default function ReportsPage() {
  const [notificationModalOpen, setNotificationModalOpen] = useState(false);
  const [reports, setReports] = useState<AssetReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cooldownRemainingMs, setCooldownRemainingMs] = useState(0);
  const [cooldownDurationMs, setCooldownDurationMs] = useState(5 * 60 * 1000);

  // Load reports on mount
  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/reports');
      if (!response.ok) throw new Error('Failed to load reports');
      const data = await response.json();
      setReports(data.reports || []);
      setCooldownRemainingMs(data.cooldownRemainingMs || 0);
      setCooldownDurationMs(data.cooldownDurationMs || 5 * 60 * 1000);
    } catch (err) {
      setError('Failed to load reports. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateReports = async () => {
    setError(null);
    try {
      const response = await fetch('/api/reports/generate', {
        method: 'POST',
      });

      const data = await response.json();

      // Update cooldown state
      setCooldownRemainingMs(data.cooldownRemainingMs || 0);
      setCooldownDurationMs(data.cooldownDurationMs || 5 * 60 * 1000);

      if (!response.ok) {
        if (response.status === 429) {
          // Rate limited - show error but don't throw
          setError(data.error || 'Please wait before generating new reports.');
          return;
        }
        throw new Error(data.error || 'Failed to generate reports');
      }

      setReports(data.reports || []);
    } catch (err) {
      setError('Failed to generate reports. Please check your connection and try again.');
      console.error(err);
    }
  };

  const handleDownloadPDF = async (symbol: string) => {
    try {
      const response = await fetch(`/api/reports/pdf?symbol=${symbol}`);
      if (!response.ok) throw new Error('Failed to generate PDF');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${symbol}_report_${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to download PDF:', err);
      alert('Failed to download PDF. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-dark-950">
      <Header onNotificationClick={() => setNotificationModalOpen(true)} />

      {/* Main Content */}
      <main className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
                <FileText className="h-8 w-8 text-accent-blue" />
                Financial Reports
              </h1>
              <p className="text-dark-400 mt-1">
                AI-powered analysis and predictions for your tracked assets
              </p>
            </div>
            <UpdateReportsButton
              onUpdate={handleUpdateReports}
              cooldownRemainingMs={cooldownRemainingMs}
              cooldownDurationMs={cooldownDurationMs}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-accent-red/10 border border-accent-red/30 rounded-lg flex items-center gap-3 text-accent-red">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="h-10 w-10 text-accent-blue animate-spin mb-4" />
              <p className="text-dark-400">Loading reports...</p>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && reports.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <FileText className="h-16 w-16 text-dark-600 mb-4" />
              <h2 className="text-xl font-semibold text-dark-300 mb-2">No reports yet</h2>
              <p className="text-dark-500 mb-6 max-w-md">
                Click the &quot;UPDATE REPORTS&quot; button to generate AI-powered financial analysis for all your tracked assets.
              </p>
            </div>
          )}

          {/* Reports Grid */}
          {!isLoading && reports.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {reports.map((report) => {
                const asset = ASSETS.find(a => a.symbol === report.symbol);
                if (!asset) return null;
                return (
                  <ReportCard
                    key={report.symbol}
                    report={report}
                    asset={asset}
                    onDownloadPDF={() => handleDownloadPDF(report.symbol)}
                  />
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-dark-800 py-6 px-4">
        <div className="max-w-7xl mx-auto text-center text-dark-500 text-sm">
          <p>Reports are generated using real-time market data from financial APIs.</p>
          <p className="mt-1">
            This is not financial advice. Always do your own research before investing.
          </p>
        </div>
      </footer>

      {/* Notification Modal */}
      <NotificationModal
        isOpen={notificationModalOpen}
        onClose={() => setNotificationModalOpen(false)}
      />
    </div>
  );
}
