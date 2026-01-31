'use client';

import { AssetReport, Asset } from '@/types/assets';
import { TrendingUp, TrendingDown, Minus, Download, AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react';

interface ReportCardProps {
  report: AssetReport;
  asset: Asset;
  onDownloadPDF: () => void;
}

export default function ReportCard({ report, asset, onDownloadPDF }: ReportCardProps) {
  const getSentimentIcon = () => {
    switch (report.sentiment) {
      case 'bullish':
        return <TrendingUp className="h-5 w-5 text-accent-green" />;
      case 'bearish':
        return <TrendingDown className="h-5 w-5 text-accent-red" />;
      default:
        return <Minus className="h-5 w-5 text-dark-400" />;
    }
  };

  const getSentimentClass = () => {
    switch (report.sentiment) {
      case 'bullish': return 'sentiment-bullish';
      case 'bearish': return 'sentiment-bearish';
      default: return 'sentiment-neutral';
    }
  };

  const getRiskIcon = () => {
    switch (report.riskLevel) {
      case 'low':
        return <CheckCircle className="h-4 w-4 text-accent-green" />;
      case 'medium':
        return <AlertCircle className="h-4 w-4 text-accent-gold" />;
      case 'high':
        return <AlertTriangle className="h-4 w-4 text-accent-red" />;
    }
  };

  const getRiskClass = () => {
    switch (report.riskLevel) {
      case 'low': return 'text-accent-green';
      case 'medium': return 'text-accent-gold';
      case 'high': return 'text-accent-red';
    }
  };

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
    <div className="bg-dark-900 rounded-xl border border-dark-700 overflow-hidden">
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
          <button
            onClick={onDownloadPDF}
            className="flex items-center gap-2 px-3 py-1.5 bg-dark-800 hover:bg-dark-700 border border-dark-600 rounded-lg text-sm text-dark-200 hover:text-white transition-colors"
          >
            <Download className="h-4 w-4" />
            PDF
          </button>
        </div>

        {/* Price Info */}
        <div className="flex items-center gap-4 mt-4">
          <div>
            <p className="text-2xl font-bold text-white">
              ${report.currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
          <div className={`flex items-center gap-1 ${report.priceChangePercent24h >= 0 ? 'text-accent-green' : 'text-accent-red'}`}>
            {report.priceChangePercent24h >= 0 ? (
              <TrendingUp className="h-4 w-4" />
            ) : (
              <TrendingDown className="h-4 w-4" />
            )}
            <span className="font-medium">
              {report.priceChangePercent24h >= 0 ? '+' : ''}{report.priceChangePercent24h.toFixed(2)}%
            </span>
            <span className="text-dark-500 text-sm ml-1">24h</span>
          </div>
        </div>
      </div>

      {/* Sentiment & Risk */}
      <div className="grid grid-cols-2 border-b border-dark-700">
        <div className="p-4 border-r border-dark-700">
          <p className="text-xs text-dark-500 uppercase tracking-wide mb-2">Sentiment</p>
          <div className="flex items-center gap-2">
            {getSentimentIcon()}
            <span className={`font-medium capitalize ${getSentimentClass()}`}>
              {report.sentiment}
            </span>
          </div>
        </div>
        <div className="p-4">
          <p className="text-xs text-dark-500 uppercase tracking-wide mb-2">Risk Level</p>
          <div className="flex items-center gap-2">
            {getRiskIcon()}
            <span className={`font-medium capitalize ${getRiskClass()}`}>
              {report.riskLevel}
            </span>
          </div>
        </div>
      </div>

      {/* Analysis */}
      <div className="p-4 border-b border-dark-700">
        <h4 className="text-sm font-medium text-dark-300 mb-2">Analysis</h4>
        <p className="text-sm text-dark-200 leading-relaxed">{report.analysis}</p>
      </div>

      {/* Prediction */}
      <div className="p-4 border-b border-dark-700">
        <h4 className="text-sm font-medium text-dark-300 mb-2">Prediction</h4>
        <p className="text-sm text-dark-200 leading-relaxed">{report.prediction}</p>
      </div>

      {/* Key Factors */}
      <div className="p-4">
        <h4 className="text-sm font-medium text-dark-300 mb-2">Key Factors</h4>
        <ul className="space-y-1.5">
          {report.keyFactors.map((factor, index) => (
            <li key={index} className="flex items-start gap-2 text-sm text-dark-200">
              <span className="text-accent-blue mt-1">•</span>
              {factor}
            </li>
          ))}
        </ul>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 bg-dark-950 border-t border-dark-700">
        <p className="text-xs text-dark-500">
          Generated: {new Date(report.generatedAt).toLocaleString()}
        </p>
      </div>
    </div>
  );
}
