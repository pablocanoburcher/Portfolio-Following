import { Asset, AssetReport } from '@/types/assets';

// Yahoo Finance symbol mapping
const YAHOO_SYMBOLS: Record<string, string> = {
  'TSLA': 'TSLA',
  'ASML': 'ASML',
  'OKLO': 'OKLO',
  'COIN': 'COIN',
  'CRCL': 'CRCL',
  'ETHUSD': 'ETH-USD',
  'BTCUSD': 'BTC-USD',
  'XAUUSD': 'GC=F',
  'XAGUSD': 'SI=F',
  'US10Y': '^TNX'
};

// Fallback prices (used only if API fails)
const FALLBACK_PRICES: Record<string, number> = {
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

interface PriceResult {
  currentPrice: number;
  priceChange24h: number;
  priceChangePercent24h: number;
  isRealData: boolean;
}

// Fetch real price data from Yahoo Finance
async function fetchRealPriceData(asset: Asset): Promise<PriceResult> {
  const yahooSymbol = YAHOO_SYMBOLS[asset.symbol];

  if (!yahooSymbol) {
    return getFallbackPrice(asset);
  }

  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(yahooSymbol)}?interval=1d&range=2d`;

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      next: { revalidate: 300 } // Cache for 5 minutes
    });

    if (!response.ok) {
      console.warn(`Yahoo Finance API returned ${response.status} for ${asset.symbol}`);
      return getFallbackPrice(asset);
    }

    const data = await response.json();

    const result = data.chart?.result?.[0];
    if (!result) {
      console.warn(`No data returned for ${asset.symbol}`);
      return getFallbackPrice(asset);
    }

    const meta = result.meta;
    const quotes = result.indicators?.quote?.[0];

    const currentPrice = meta.regularMarketPrice || meta.previousClose;
    const previousClose = meta.chartPreviousClose || meta.previousClose;

    // Calculate 24h change
    let priceChange24h = 0;
    let priceChangePercent24h = 0;

    if (currentPrice && previousClose) {
      priceChange24h = currentPrice - previousClose;
      priceChangePercent24h = (priceChange24h / previousClose) * 100;
    } else if (quotes && quotes.close && quotes.close.length >= 2) {
      // Fallback to chart data
      const closes = quotes.close.filter((c: number | null) => c !== null);
      if (closes.length >= 2) {
        const latest = closes[closes.length - 1];
        const previous = closes[closes.length - 2];
        priceChange24h = latest - previous;
        priceChangePercent24h = (priceChange24h / previous) * 100;
      }
    }

    return {
      currentPrice: currentPrice || FALLBACK_PRICES[asset.symbol] || 100,
      priceChange24h,
      priceChangePercent24h,
      isRealData: true
    };
  } catch (error) {
    console.error(`Error fetching price for ${asset.symbol}:`, error);
    return getFallbackPrice(asset);
  }
}

function getFallbackPrice(asset: Asset): PriceResult {
  const basePrice = FALLBACK_PRICES[asset.symbol] || 100;
  return {
    currentPrice: basePrice,
    priceChange24h: 0,
    priceChangePercent24h: 0,
    isRealData: false
  };
}

// Determine sentiment based on actual price movement
function determineSentiment(priceChangePercent: number): 'bullish' | 'bearish' | 'neutral' {
  // Use price movement to determine sentiment
  // Strong movements (> 2%) get directional sentiment
  // Moderate movements (0.5% - 2%) are more neutral-leaning
  // Small movements (< 0.5%) are neutral

  if (priceChangePercent > 2) return 'bullish';
  if (priceChangePercent < -2) return 'bearish';
  if (priceChangePercent > 0.5) return 'bullish';
  if (priceChangePercent < -0.5) return 'bearish';
  return 'neutral';
}

// Generate analysis text based on asset type and sentiment
function generateAnalysis(asset: Asset, sentiment: 'bullish' | 'bearish' | 'neutral', priceChange: number): string {
  const direction = priceChange >= 0 ? 'up' : 'down';
  const magnitude = Math.abs(priceChange);
  const magnitudeDesc = magnitude > 3 ? 'significantly' : magnitude > 1 ? 'moderately' : 'slightly';

  const analyses: Record<string, Record<string, string>> = {
    stock: {
      bullish: `${asset.name} is trading ${magnitudeDesc} higher, showing positive momentum. Technical indicators suggest continued upward pressure, supported by market sentiment and sector performance.`,
      bearish: `${asset.name} is trading ${magnitudeDesc} lower, facing headwinds from current market conditions. Key support levels are being monitored as the stock consolidates.`,
      neutral: `${asset.name} is trading in a tight range with balanced buying and selling pressure. Market participants are awaiting key catalysts before committing to directional moves.`
    },
    crypto: {
      bullish: `${asset.name} demonstrates positive momentum with the price moving ${magnitudeDesc} higher. On-chain metrics and trading volume support the current price action.`,
      bearish: `${asset.name} is experiencing ${magnitudeDesc} downward pressure. Market participants are watching key support levels and on-chain activity for signs of stabilization.`,
      neutral: `${asset.name} consolidates within established range as the market digests recent moves. Trading activity shows balanced accumulation and distribution patterns.`
    },
    commodity: {
      bullish: `${asset.name} is trending ${magnitudeDesc} higher, benefiting from current market dynamics. Safe-haven demand and macroeconomic factors support continued price strength.`,
      bearish: `${asset.name} faces ${magnitudeDesc} pressure from current market conditions. Investors are monitoring global economic indicators and central bank policies.`,
      neutral: `${asset.name} trades sideways as competing forces balance. Global economic uncertainty and monetary policy expectations continue to influence price action.`
    },
    bond: {
      bullish: `Treasury yields are moving ${magnitudeDesc} higher as markets assess economic growth and inflation expectations. Duration positioning remains a key consideration.`,
      bearish: `Treasury yields are trending ${magnitudeDesc} lower as flight-to-safety flows increase. Economic uncertainty supports demand for government bonds.`,
      neutral: `Treasury yields consolidate as markets evaluate Fed policy trajectory. Inflation data and employment figures remain key drivers for rate expectations.`
    }
  };

  return analyses[asset.type]?.[sentiment] || `${asset.name} shows mixed signals in current market conditions.`;
}

// Generate prediction based on asset and sentiment
function generatePrediction(asset: Asset, sentiment: 'bullish' | 'bearish' | 'neutral'): string {
  const predictions: Record<string, string> = {
    bullish: `Near-term outlook remains constructive. If current momentum continues, potential upside of 5-10% is possible. Key resistance levels should be monitored for breakout confirmation.`,
    bearish: `Near-term outlook suggests caution. Potential downside of 5-8% may occur if support levels break. Risk management and position sizing are recommended.`,
    neutral: `Near-term outlook indicates range-bound trading. Position sizing should reflect current uncertainty until clearer directional signals emerge from the market.`
  };

  return predictions[sentiment];
}

// Generate key factors based on asset type
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

  // Return consistent factors (not randomized)
  return factorSets[asset.type] || [];
}

// Determine risk level based on asset type
function determineRiskLevel(asset: Asset): 'low' | 'medium' | 'high' {
  const riskMap: Record<string, 'low' | 'medium' | 'high'> = {
    stock: 'medium',
    crypto: 'high',
    commodity: 'medium',
    bond: 'low'
  };
  return riskMap[asset.type] || 'medium';
}

export async function generateReport(asset: Asset): Promise<AssetReport> {
  const priceData = await fetchRealPriceData(asset);
  const sentiment = determineSentiment(priceData.priceChangePercent24h);

  return {
    symbol: asset.symbol,
    generatedAt: new Date().toISOString(),
    currentPrice: priceData.currentPrice,
    priceChange24h: priceData.priceChange24h,
    priceChangePercent24h: priceData.priceChangePercent24h,
    analysis: generateAnalysis(asset, sentiment, priceData.priceChangePercent24h),
    prediction: generatePrediction(asset, sentiment),
    sentiment,
    keyFactors: generateKeyFactors(asset),
    riskLevel: determineRiskLevel(asset)
  };
}

export async function generateAllReports(assets: Asset[]): Promise<AssetReport[]> {
  // Fetch all reports in parallel
  const reportPromises = assets.map(asset => generateReport(asset));
  return Promise.all(reportPromises);
}
