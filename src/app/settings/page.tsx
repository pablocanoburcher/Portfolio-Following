'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import NotificationModal from '@/components/NotificationModal';
import { Settings, Bell, Palette, Info, ExternalLink, Check } from 'lucide-react';
import { ASSETS } from '@/types/assets';
import Link from 'next/link';

export default function SettingsPage() {
  const [notificationModalOpen, setNotificationModalOpen] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState<{
    email: string;
    enabled: boolean;
    assets: string[];
  } | null>(null);

  useEffect(() => {
    // Load notification settings from localStorage
    const saved = localStorage.getItem('notificationSettings');
    if (saved) {
      setNotificationSettings(JSON.parse(saved));
    }
  }, [notificationModalOpen]);

  return (
    <div className="min-h-screen bg-dark-950">
      <Header onNotificationClick={() => setNotificationModalOpen(true)} />

      {/* Main Content */}
      <main className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
              <Settings className="h-8 w-8 text-accent-blue" />
              Settings
            </h1>
            <p className="text-dark-400 mt-1">
              Configure your dashboard preferences
            </p>
          </div>

          <div className="space-y-6">
            {/* Notifications Section */}
            <section className="bg-dark-900 rounded-xl border border-dark-700 overflow-hidden">
              <div className="p-4 border-b border-dark-700 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell className="h-5 w-5 text-accent-blue" />
                  <h2 className="text-lg font-semibold text-white">Email Notifications</h2>
                </div>
                <button
                  onClick={() => setNotificationModalOpen(true)}
                  className="px-4 py-2 bg-dark-800 hover:bg-dark-700 border border-dark-600 rounded-lg text-sm text-dark-200 hover:text-white transition-colors"
                >
                  Configure
                </button>
              </div>
              <div className="p-4">
                {notificationSettings ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${notificationSettings.enabled ? 'bg-accent-green' : 'bg-dark-500'}`}></span>
                      <span className="text-dark-300">
                        {notificationSettings.enabled ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                    <div className="text-sm text-dark-400">
                      <span className="text-dark-500">Email:</span> {notificationSettings.email}
                    </div>
                    <div className="text-sm text-dark-400">
                      <span className="text-dark-500">Monitoring:</span>{' '}
                      {notificationSettings.assets.length === ASSETS.length
                        ? 'All assets'
                        : `${notificationSettings.assets.length} assets`}
                    </div>
                  </div>
                ) : (
                  <p className="text-dark-500 text-sm">
                    No notification settings configured. Click &quot;Configure&quot; to set up email alerts.
                  </p>
                )}
              </div>
            </section>

            {/* Tracked Assets Section */}
            <section className="bg-dark-900 rounded-xl border border-dark-700 overflow-hidden">
              <div className="p-4 border-b border-dark-700 flex items-center gap-3">
                <Palette className="h-5 w-5 text-accent-blue" />
                <h2 className="text-lg font-semibold text-white">Tracked Assets</h2>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {ASSETS.map((asset) => (
                    <div
                      key={asset.symbol}
                      className="flex items-center gap-2 p-3 bg-dark-800 rounded-lg border border-dark-700"
                    >
                      <Check className="h-4 w-4 text-accent-green" />
                      <div>
                        <p className="text-sm font-medium text-white">{asset.symbol}</p>
                        <p className="text-xs text-dark-500">{asset.type}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Data Sources Section */}
            <section className="bg-dark-900 rounded-xl border border-dark-700 overflow-hidden">
              <div className="p-4 border-b border-dark-700 flex items-center gap-3">
                <Info className="h-5 w-5 text-accent-blue" />
                <h2 className="text-lg font-semibold text-white">Data Sources</h2>
              </div>
              <div className="p-4 space-y-3">
                <a
                  href="https://www.tradingview.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 bg-dark-800 rounded-lg border border-dark-700 hover:border-dark-600 transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium text-white">TradingView</p>
                    <p className="text-xs text-dark-500">Real-time charts and price data</p>
                  </div>
                  <ExternalLink className="h-4 w-4 text-dark-500" />
                </a>
                <a
                  href="https://www.coinmarketcap.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 bg-dark-800 rounded-lg border border-dark-700 hover:border-dark-600 transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium text-white">CoinMarketCap</p>
                    <p className="text-xs text-dark-500">Cryptocurrency market data</p>
                  </div>
                  <ExternalLink className="h-4 w-4 text-dark-500" />
                </a>
                <a
                  href="https://www.webull.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 bg-dark-800 rounded-lg border border-dark-700 hover:border-dark-600 transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium text-white">Webull</p>
                    <p className="text-xs text-dark-500">Stock market information</p>
                  </div>
                  <ExternalLink className="h-4 w-4 text-dark-500" />
                </a>
              </div>
            </section>

            {/* About Section */}
            <section className="bg-dark-900 rounded-xl border border-dark-700 overflow-hidden">
              <div className="p-4 border-b border-dark-700">
                <h2 className="text-lg font-semibold text-white">About</h2>
              </div>
              <div className="p-4 space-y-3 text-sm text-dark-400">
                <p>
                  FinDash is a financial dashboard for tracking stocks, cryptocurrencies,
                  commodities, and bonds with real-time charts and AI-powered analysis.
                </p>
                <p>
                  Charts are powered by TradingView and update in real-time during market hours.
                  Reports are generated using AI analysis and are for informational purposes only.
                </p>
                <p className="text-dark-500">
                  Version 1.0.0
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-dark-800 py-6 px-4">
        <div className="max-w-7xl mx-auto text-center text-dark-500 text-sm">
          <p>
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
