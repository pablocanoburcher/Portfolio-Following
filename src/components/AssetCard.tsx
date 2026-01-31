'use client';

import { Asset, TimeInterval, TIME_INTERVALS } from '@/types/assets';
import { TrendingUp, TrendingDown, ExternalLink } from 'lucide-react';
import TradingViewChart from './TradingViewChart';

interface AssetCardProps {
  asset: Asset;
  selectedInterval: TimeInterval;
  onIntervalChange: (interval: TimeInterval) => void;
  priceChange?: number;
  currentPrice?: number;
}

export default function AssetCard({
  asset,
  selectedInterval,
  onIntervalChange,
  priceChange = 0,
  currentPrice
}: AssetCardProps) {
  const isPositive = priceChange >= 0;

  const getBadgeClass = () => {
    switch (asset.type) {
      case 'stock': return 'badge-stock';
      case 'crypto': return 'badge-crypto';
      case 'commodity': return 'badge-commodity';
      case 'bond': return 'badge-bond';
      default: return '';
    }
  };

  return (
    <div className="bg-dark-900 rounded-xl border border-dark-700 overflow-hidden card-hover">
      {/* Header */}
      <div className="p-4 border-b border-dark-700">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-white">{asset.symbol}</h3>
              <span className={`badge ${getBadgeClass()}`}>{asset.type}</span>
            </div>
            <p className="text-sm text-dark-400 mt-0.5">{asset.name}</p>
          </div>
          <div className="text-right">
            {currentPrice !== undefined && (
              <p className="text-lg font-semibold text-white">
                ${currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            )}
            <div className={`flex items-center gap-1 justify-end ${isPositive ? 'text-accent-green' : 'text-accent-red'}`}>
              {isPositive ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              <span className="text-sm font-medium">
                {isPositive ? '+' : ''}{priceChange.toFixed(2)}%
              </span>
            </div>
          </div>
        </div>

        {/* Time Interval Selector */}
        <div className="flex items-center gap-1 mt-4 overflow-x-auto pb-1">
          {TIME_INTERVALS.map((interval) => (
            <button
              key={interval.value}
              onClick={() => onIntervalChange(interval.value)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                selectedInterval === interval.value
                  ? 'bg-accent-blue text-white'
                  : 'bg-dark-800 text-dark-400 hover:text-white hover:bg-dark-700'
              }`}
            >
              {interval.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="h-[300px] bg-dark-950">
        <TradingViewChart
          symbol={asset.tradingViewSymbol}
          interval={selectedInterval}
        />
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-dark-700 flex items-center justify-between">
        <p className="text-xs text-dark-500">{asset.description}</p>
        <a
          href={`https://www.tradingview.com/symbols/${asset.tradingViewSymbol.replace(':', '-')}/`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-dark-400 hover:text-accent-blue transition-colors"
        >
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}
