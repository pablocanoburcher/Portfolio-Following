'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import AssetCard from '@/components/AssetCard';
import NotificationModal from '@/components/NotificationModal';
import { ASSETS, TimeInterval } from '@/types/assets';
import { FileText } from 'lucide-react';
import Link from 'next/link';

export default function Dashboard() {
  const [notificationModalOpen, setNotificationModalOpen] = useState(false);
  const [intervals, setIntervals] = useState<Record<string, TimeInterval>>(
    Object.fromEntries(ASSETS.map(a => [a.symbol, '1m']))
  );

  const handleIntervalChange = (symbol: string, interval: TimeInterval) => {
    setIntervals(prev => ({ ...prev, [symbol]: interval }));
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
              <h1 className="text-2xl sm:text-3xl font-bold text-white">
                Asset Dashboard
              </h1>
              <p className="text-dark-400 mt-1">
                Real-time price tracking for your portfolio
              </p>
            </div>
            <Link
              href="/reports"
              className="flex items-center gap-2 px-4 py-2 bg-accent-blue hover:bg-blue-600 text-white font-medium rounded-lg transition-colors self-start sm:self-auto"
            >
              <FileText className="h-4 w-4" />
              View Reports
            </Link>
          </div>

          {/* Asset Type Sections */}
          <div className="space-y-10">
            {/* Stocks */}
            <section>
              <h2 className="text-lg font-semibold text-dark-200 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-accent-blue"></span>
                Stocks
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {ASSETS.filter(a => a.type === 'stock').map((asset) => (
                  <AssetCard
                    key={asset.symbol}
                    asset={asset}
                    selectedInterval={intervals[asset.symbol]}
                    onIntervalChange={(interval) => handleIntervalChange(asset.symbol, interval)}
                  />
                ))}
              </div>
            </section>

            {/* Crypto */}
            <section>
              <h2 className="text-lg font-semibold text-dark-200 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-accent-gold"></span>
                Cryptocurrency
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {ASSETS.filter(a => a.type === 'crypto').map((asset) => (
                  <AssetCard
                    key={asset.symbol}
                    asset={asset}
                    selectedInterval={intervals[asset.symbol]}
                    onIntervalChange={(interval) => handleIntervalChange(asset.symbol, interval)}
                  />
                ))}
              </div>
            </section>

            {/* Commodities */}
            <section>
              <h2 className="text-lg font-semibold text-dark-200 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-dark-400"></span>
                Commodities
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {ASSETS.filter(a => a.type === 'commodity').map((asset) => (
                  <AssetCard
                    key={asset.symbol}
                    asset={asset}
                    selectedInterval={intervals[asset.symbol]}
                    onIntervalChange={(interval) => handleIntervalChange(asset.symbol, interval)}
                  />
                ))}
              </div>
            </section>

            {/* Bonds */}
            <section>
              <h2 className="text-lg font-semibold text-dark-200 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-accent-green"></span>
                Bonds
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {ASSETS.filter(a => a.type === 'bond').map((asset) => (
                  <AssetCard
                    key={asset.symbol}
                    asset={asset}
                    selectedInterval={intervals[asset.symbol]}
                    onIntervalChange={(interval) => handleIntervalChange(asset.symbol, interval)}
                  />
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-dark-800 py-6 px-4">
        <div className="max-w-7xl mx-auto text-center text-dark-500 text-sm">
          <p>Data provided by TradingView. Charts update in real-time during market hours.</p>
          <p className="mt-1">
            This dashboard is for informational purposes only. Not financial advice.
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
