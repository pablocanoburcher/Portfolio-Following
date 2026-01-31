import { Asset, AssetReport } from '@/types/assets';

// Mock price data generator (in production, this would fetch from real APIs)
function generateMockPriceData(asset: Asset): { currentPrice: number; priceChange24h: number; priceChangePercent24h: number } {
  const basePrices: Record<string, number> = {
    'TSLA': 248.50,
    'ASML': 715.30,
    'OKLO': 28.45,
    'COIN': 225.80,
    'CRCL': 12.35,
    'ETHUSD': 3250.00,
    'BTCUSD': 98500.00,
    'XAUUSD': 2650.00,
    'XAGUSD': 31.50,
    'US10Y': 4.28
  };

  const basePrice = basePrices[asset.symbol] || 100;
  const volatility = asset.type === 'crypto' ? 0.05 : 0.02;
  const randomChange = (Math.random() - 0.5) * 2 * volatility;
  const priceChange24h = basePrice * randomChange;

  return {
    currentPrice: basePrice + priceChange24h,
    priceChange24h: priceChange24h,
    priceChangePercent24h: randomChange * 100
  };
}

// Generate analysis text based on asset type and sentiment
function generateAnalysis(asset: Asset, sentiment: 'bullish' | 'bearish' | 'neutral'): string {
  const analyses: Record<string, Record<string, string>> = {
    stock: {
      bullish: `${asset.name} shows strong momentum with increasing institutional interest. Technical indicators suggest continued upward movement, supported by positive earnings outlook and sector tailwinds.`,
      bearish: `${asset.name} faces headwinds from macro conditions and sector rotation. Technical patterns suggest potential consolidation or downside, with key support levels being tested.`,
      neutral: `${asset.name} is trading in a consolidation range with mixed signals. Market participants await key catalysts before committing to directional moves.`
    },
    crypto: {
      bullish: `${asset.name} demonstrates strong on-chain metrics with increasing network activity and whale accumulation. Institutional flows remain positive, supporting price appreciation.`,
      bearish: `${asset.name} shows weakening momentum with declining network activity. Exchange outflows have slowed, and short-term holder behavior suggests distribution phase.`,
      neutral: `${asset.name} consolidates within established range as market digests recent moves. On-chain metrics show balanced accumulation and distribution patterns.`
    },
    commodity: {
      bullish: `${asset.name} benefits from safe-haven demand and central bank buying. Supply constraints and geopolitical factors support continued price strength.`,
      bearish: `${asset.name} faces pressure from rising real yields and dollar strength. ETF outflows indicate shifting investor sentiment toward risk assets.`,
      neutral: `${asset.name} trades sideways as competing forces balance. Safe-haven demand offsets pressure from monetary policy normalization.`
    },
    bond: {
      bullish: `Treasury yields are trending higher as markets price in sustained economic growth and potential inflation concerns. Duration risk remains elevated.`,
      bearish: `Treasury yields face downward pressure as flight-to-safety flows increase. Economic uncertainty supports bond demand and lower yields.`,
      neutral: `Treasury yields consolidate as markets assess Fed policy trajectory. Inflation data and employment figures remain key drivers.`
    }
  };

  return analyses[asset.type]?.[sentiment] || `${asset.name} shows mixed signals in current market conditions.`;
}

// Generate prediction based on asset and sentiment
function generatePrediction(asset: Asset, sentiment: 'bullish' | 'bearish' | 'neutral'): string {
  const timeframes = ['short-term', 'medium-term'];
  const timeframe = timeframes[Math.floor(Math.random() * timeframes.length)];

  const predictions: Record<string, string> = {
    bullish: `${timeframe.charAt(0).toUpperCase() + timeframe.slice(1)} outlook remains constructive with potential upside of 10-15% if current momentum continues. Key resistance levels to watch for breakout confirmation.`,
    bearish: `${timeframe.charAt(0).toUpperCase() + timeframe.slice(1)} outlook suggests caution with potential downside of 8-12%. Support levels may be tested before stabilization.`,
    neutral: `${timeframe.charAt(0).toUpperCase() + timeframe.slice(1)} outlook indicates range-bound trading. Position sizing should reflect elevated uncertainty until clearer directional signals emerge.`
  };

  return predictions[sentiment];
}

// Generate key factors
function generateKeyFactors(asset: Asset): string[] {
  const factorSets: Record<string, string[]> = {
    stock: [
      'Earnings momentum and revenue growth trajectory',
      'Institutional ownership and fund flows',
      'Sector rotation and market leadership dynamics',
      'Management execution and strategic initiatives',
      'Valuation relative to historical averages and peers'
    ],
    crypto: [
      'Network hash rate and security metrics',
      'Developer activity and protocol upgrades',
      'Regulatory developments across major jurisdictions',
      'Institutional adoption and ETF flows',
      'On-chain metrics including active addresses and transaction volume'
    ],
    commodity: [
      'Central bank reserve diversification policies',
      'Global inflation expectations and real yields',
      'Geopolitical risk premium and safe-haven demand',
      'Mining supply dynamics and production costs',
      'ETF holdings and physical demand trends'
    ],
    bond: [
      'Federal Reserve policy trajectory and guidance',
      'Inflation expectations and breakeven rates',
      'Economic growth indicators and recession probability',
      'Treasury supply and demand dynamics',
      'Global yield differentials and currency hedging costs'
    ]
  };

  const factors = factorSets[asset.type] || [];
  return factors.slice(0, 4 + Math.floor(Math.random() * 2));
}

// Determine sentiment based on random factors (in production, this would be AI-driven)
function determineSentiment(): 'bullish' | 'bearish' | 'neutral' {
  const rand = Math.random();
  if (rand < 0.4) return 'bullish';
  if (rand < 0.7) return 'neutral';
  return 'bearish';
}

// Determine risk level
function determineRiskLevel(asset: Asset): 'low' | 'medium' | 'high' {
  const riskMap: Record<string, 'low' | 'medium' | 'high'> = {
    stock: 'medium',
    crypto: 'high',
    commodity: 'medium',
    bond: 'low'
  };
  return riskMap[asset.type] || 'medium';
}

export function generateReport(asset: Asset): AssetReport {
  const priceData = generateMockPriceData(asset);
  const sentiment = determineSentiment();

  return {
    symbol: asset.symbol,
    generatedAt: new Date().toISOString(),
    currentPrice: priceData.currentPrice,
    priceChange24h: priceData.priceChange24h,
    priceChangePercent24h: priceData.priceChangePercent24h,
    analysis: generateAnalysis(asset, sentiment),
    prediction: generatePrediction(asset, sentiment),
    sentiment,
    keyFactors: generateKeyFactors(asset),
    riskLevel: determineRiskLevel(asset)
  };
}

export function generateAllReports(assets: Asset[]): AssetReport[] {
  return assets.map(asset => generateReport(asset));
}
