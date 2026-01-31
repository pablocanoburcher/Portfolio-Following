'use client';

import { useState } from 'react';
import { X, Bell, Mail, Check } from 'lucide-react';
import { ASSETS } from '@/types/assets';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationModal({ isOpen, onClose }: NotificationModalProps) {
  const [email, setEmail] = useState('');
  const [selectedAssets, setSelectedAssets] = useState<string[]>(ASSETS.map(a => a.symbol));
  const [isEnabled, setIsEnabled] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  const toggleAsset = (symbol: string) => {
    setSelectedAssets(prev =>
      prev.includes(symbol)
        ? prev.filter(s => s !== symbol)
        : [...prev, symbol]
    );
  };

  const handleSave = async () => {
    // Save to localStorage for now (would be API call in production)
    const settings = {
      email,
      enabled: isEnabled,
      assets: selectedAssets
    };
    localStorage.setItem('notificationSettings', JSON.stringify(settings));

    // Show success state
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-dark-900 rounded-xl border border-dark-700 w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-dark-700">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-accent-blue" />
            <h2 className="text-lg font-semibold text-white">Email Notifications</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-dark-400 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-6">
          {/* Enable Toggle */}
          <div className="flex items-center justify-between">
            <span className="text-dark-200">Enable notifications</span>
            <button
              onClick={() => setIsEnabled(!isEnabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isEnabled ? 'bg-accent-blue' : 'bg-dark-700'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Email Input */}
          <div>
            <label className="block text-sm text-dark-400 mb-2">
              Gmail Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-dark-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@gmail.com"
                className="w-full bg-dark-800 border border-dark-600 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-dark-500 focus:outline-none focus:border-accent-blue transition-colors"
              />
            </div>
          </div>

          {/* Asset Selection */}
          <div>
            <label className="block text-sm text-dark-400 mb-2">
              Assets to monitor
            </label>
            <div className="grid grid-cols-2 gap-2">
              {ASSETS.map((asset) => (
                <button
                  key={asset.symbol}
                  onClick={() => toggleAsset(asset.symbol)}
                  className={`flex items-center gap-2 p-2 rounded-lg border transition-colors ${
                    selectedAssets.includes(asset.symbol)
                      ? 'border-accent-blue bg-accent-blue/10 text-white'
                      : 'border-dark-600 bg-dark-800 text-dark-400 hover:border-dark-500'
                  }`}
                >
                  <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                    selectedAssets.includes(asset.symbol)
                      ? 'border-accent-blue bg-accent-blue'
                      : 'border-dark-500'
                  }`}>
                    {selectedAssets.includes(asset.symbol) && (
                      <Check className="h-3 w-3 text-white" />
                    )}
                  </div>
                  <span className="text-sm font-medium">{asset.symbol}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <p className="text-xs text-dark-500">
            You&apos;ll receive email notifications when there are major news or significant price movements for your selected assets.
          </p>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-dark-700">
          <button
            onClick={handleSave}
            disabled={!email}
            className={`w-full py-2.5 rounded-lg font-medium transition-all ${
              isSaved
                ? 'bg-accent-green text-white'
                : email
                  ? 'bg-accent-blue hover:bg-blue-600 text-white'
                  : 'bg-dark-700 text-dark-500 cursor-not-allowed'
            }`}
          >
            {isSaved ? (
              <span className="flex items-center justify-center gap-2">
                <Check className="h-4 w-4" />
                Saved!
              </span>
            ) : (
              'Save Settings'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
