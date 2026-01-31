# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build Commands

```bash
# Install dependencies
npm install

# Development server (http://localhost:3000)
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## Project Overview

Financial dashboard (Next.js 14 + TypeScript + Tailwind CSS) for tracking specific assets with real-time TradingView charts, AI-generated reports, and email notifications.

### Tracked Assets
- **Stocks**: TSLA, ASML, OKLO, COIN, CRCL
- **Crypto**: ETH (USD), BTC (USD)
- **Commodities**: XAUUSD (Gold), XAGUSD (Silver)
- **Bonds**: US10Y (10-Year Treasury)

## Architecture

```
src/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Main dashboard with asset cards
│   ├── reports/page.tsx   # AI reports page with PDF export
│   ├── settings/page.tsx  # Configuration page
│   └── api/
│       ├── reports/       # GET reports, POST generate new
│       │   ├── route.ts
│       │   ├── generate/route.ts
│       │   └── pdf/route.ts
│       └── notifications/route.ts
├── components/
│   ├── Header.tsx         # Navigation header (responsive)
│   ├── AssetCard.tsx      # Chart card with interval selector
│   ├── TradingViewChart.tsx  # TradingView widget embed
│   ├── ReportCard.tsx     # Financial report display
│   ├── UpdateReportsButton.tsx  # Update button with cooldown timer
│   └── NotificationModal.tsx
├── lib/
│   ├── reportGenerator.ts # Report generation with Yahoo Finance API
│   ├── reportStore.ts     # File-based report cache & cooldown management
│   └── pdfGenerator.ts    # PDF/HTML export utilities
└── types/
    └── assets.ts          # Asset definitions, TimeInterval types
```

### Key Patterns

- **TradingView Integration**: Charts embed via `TradingViewChart.tsx` using the advanced-chart widget. Symbol mapping in `src/types/assets.ts` (ASSETS array with `tradingViewSymbol` field).

- **Time Intervals**: 8 intervals (24h, 7d, 1w, 1m, 6m, 1y, 5y, all) mapped to TradingView ranges in `TradingViewChart.tsx:getTradingViewInterval()`.

- **Report Generation**: `src/lib/reportGenerator.ts` fetches real-time price data from Yahoo Finance API. Falls back to static prices if API is unavailable. Sentiment is determined by actual price movement (not random).

- **Report Caching & Cooldown**: `src/lib/reportStore.ts` provides file-based persistence (`.report-cache/reports.json`) for reports and enforces a 5-minute cooldown between updates. This prevents rapid regeneration and ensures price stability.

- **State Management**: Local React state. Notification settings persist to localStorage. Report cache persists to filesystem.

## Report System

### How Reports Work

1. **Price Data**: Fetched from Yahoo Finance API (`query1.finance.yahoo.com`)
   - Stocks: Direct symbols (TSLA, ASML, etc.)
   - Crypto: ETH-USD, BTC-USD
   - Commodities: GC=F (Gold futures), SI=F (Silver futures)
   - Bonds: ^TNX (10-Year Treasury)

2. **Cooldown**: 5-minute minimum between report generations to account for market volatility and prevent excessive API calls.

3. **Sentiment**: Based on 24h price change:
   - > 2% or > 0.5%: Bullish
   - < -2% or < -0.5%: Bearish
   - Otherwise: Neutral

4. **Risk Level**: Static per asset type (Stock: medium, Crypto: high, Commodity: medium, Bond: low)

5. **PDF Export**: Returns styled HTML that can be printed to PDF. Uses cached reports for consistency.

### Cache Location

Reports are cached in `.report-cache/reports.json` (gitignored). Delete this file to reset the cache and cooldown.

## Environment Variables

Copy `.env.example` to `.env.local`:

```bash
ALPHA_VANTAGE_API_KEY=     # Stock data (optional, Yahoo Finance used by default)
COINMARKETCAP_API_KEY=     # Crypto data (optional)
ANTHROPIC_API_KEY=         # AI report generation (for future enhancement)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=                 # Gmail for sending
SMTP_PASS=                 # App password
NOTIFICATION_EMAIL=        # Recipient
```

## Production Enhancements

1. **AI Reports**: Replace template-based analysis in `generateAnalysis()` with Claude API calls using `@anthropic-ai/sdk` for more dynamic insights.

2. **PDF Export**: The current PDF route returns styled HTML. For true PDF, add Puppeteer or use a PDF service.

3. **Email Notifications**: Implement nodemailer in `api/notifications/route.ts` with news monitoring service.

4. **Database**: For multi-user support, replace file-based `reportStore.ts` with a proper database (PostgreSQL, MongoDB, etc.).
