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
│   ├── UpdateReportsButton.tsx
│   └── NotificationModal.tsx
├── lib/
│   ├── reportGenerator.ts # Report generation logic
│   └── pdfGenerator.ts    # PDF/HTML export utilities
└── types/
    └── assets.ts          # Asset definitions, TimeInterval types
```

### Key Patterns

- **TradingView Integration**: Charts embed via `TradingViewChart.tsx` using the advanced-chart widget. Symbol mapping in `src/types/assets.ts` (ASSETS array with `tradingViewSymbol` field).

- **Time Intervals**: 8 intervals (24h, 7d, 1w, 1m, 6m, 1y, 5y, all) mapped to TradingView ranges in `TradingViewChart.tsx:getTradingViewInterval()`.

- **Report Generation**: `src/lib/reportGenerator.ts` generates mock reports. For production, integrate real APIs in `generateMockPriceData()` and call Claude/OpenAI in `generateAnalysis()`.

- **State Management**: Local React state. Notification settings persist to localStorage.

## Environment Variables

Copy `.env.example` to `.env.local`:

```bash
ALPHA_VANTAGE_API_KEY=     # Stock data
COINMARKETCAP_API_KEY=     # Crypto data
ANTHROPIC_API_KEY=         # AI report generation
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=                 # Gmail for sending
SMTP_PASS=                 # App password
NOTIFICATION_EMAIL=        # Recipient
```

## Production Enhancements

The current implementation uses mock data. For production:

1. **Real Price Data**: Replace `generateMockPriceData()` in `reportGenerator.ts` with API calls to Alpha Vantage, CoinGecko, etc.

2. **AI Reports**: Replace mock analysis in `generateAnalysis()` with Claude API calls using `@anthropic-ai/sdk`.

3. **PDF Export**: The current PDF route returns styled HTML. For true PDF, add Puppeteer or use a PDF service.

4. **Email Notifications**: Implement nodemailer in `api/notifications/route.ts` with news monitoring service.
