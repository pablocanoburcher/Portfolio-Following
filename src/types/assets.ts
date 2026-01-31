export type AssetType = 'stock' | 'crypto' | 'commodity' | 'bond';

export type TimeInterval = '24h' | '7d' | '1w' | '1m' | '6m' | '1y' | '5y' | 'all';

export interface Asset {
  symbol: string;
  name: string;
  type: AssetType;
  tradingViewSymbol: string;
  description: string;
}

export interface PriceData {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

export interface AssetReport {
  symbol: string;
  generatedAt: string;
  currentPrice: number;
  priceChange24h: number;
  priceChangePercent24h: number;
  analysis: string;
  prediction: string;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  keyFactors: string[];
  riskLevel: 'low' | 'medium' | 'high';
}

export interface NotificationSettings {
  email: string;
  enabled: boolean;
  assets: string[];
}

export const ASSETS: Asset[] = [
  {
    symbol: 'TSLA',
    name: 'Tesla, Inc.',
    type: 'stock',
    tradingViewSymbol: 'NASDAQ:TSLA',
    description: 'Electric vehicle and clean energy company'
  },
  {
    symbol: 'ASML',
    name: 'ASML Holding N.V.',
    type: 'stock',
    tradingViewSymbol: 'NASDAQ:ASML',
    description: 'Semiconductor equipment manufacturer'
  },
  {
    symbol: 'OKLO',
    name: 'Oklo Inc.',
    type: 'stock',
    tradingViewSymbol: 'NYSE:OKLO',
    description: 'Advanced nuclear technology company'
  },
  {
    symbol: 'COIN',
    name: 'Coinbase Global, Inc.',
    type: 'stock',
    tradingViewSymbol: 'NASDAQ:COIN',
    description: 'Cryptocurrency exchange platform'
  },
  {
    symbol: 'CRCL',
    name: 'Circle Corporation',
    type: 'stock',
    tradingViewSymbol: 'NYSE:CRCL',
    description: 'Financial technology company'
  },
  {
    symbol: 'ETHUSD',
    name: 'Ethereum',
    type: 'crypto',
    tradingViewSymbol: 'COINBASE:ETHUSD',
    description: 'Decentralized blockchain platform'
  },
  {
    symbol: 'BTCUSD',
    name: 'Bitcoin',
    type: 'crypto',
    tradingViewSymbol: 'COINBASE:BTCUSD',
    description: 'Digital cryptocurrency'
  },
  {
    symbol: 'XAUUSD',
    name: 'Gold',
    type: 'commodity',
    tradingViewSymbol: 'TVC:GOLD',
    description: 'Gold spot price in USD'
  },
  {
    symbol: 'XAGUSD',
    name: 'Silver',
    type: 'commodity',
    tradingViewSymbol: 'TVC:SILVER',
    description: 'Silver spot price in USD'
  },
  {
    symbol: 'US10Y',
    name: 'US 10-Year Treasury',
    type: 'bond',
    tradingViewSymbol: 'TVC:US10Y',
    description: 'US 10-Year Treasury yield'
  }
];

export const TIME_INTERVALS: { value: TimeInterval; label: string }[] = [
  { value: '24h', label: '24H' },
  { value: '7d', label: '7D' },
  { value: '1w', label: '1W' },
  { value: '1m', label: '1M' },
  { value: '6m', label: '6M' },
  { value: '1y', label: '1Y' },
  { value: '5y', label: '5Y' },
  { value: 'all', label: 'ALL' }
];
