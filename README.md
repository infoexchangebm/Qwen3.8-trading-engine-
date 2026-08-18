# Qwen3.8 Trading Engine - Pre-Market Dashboard

A professional pre-market trading dashboard that generates a ranked daily watchlist of US stocks with the strongest tradable setups. Built for traders who want to make informed decisions before market open.

## Features

### Core Dashboard
- **Daily Watchlist Table**: Sortable, filterable table showing 10-20 top stock setups
- **Conviction Scoring**: 0-100 score with factor breakdown (momentum, volume, volatility, catalyst, sentiment, liquidity, chart structure)
- **Real-time Mock Data**: Simulates live pre-market feeds with realistic price action
- **Key Levels**: Pre-market high/low, prior day high/low, VWAP
- **Trade Plans**: Entry triggers, stop losses with rationale, T1/T2 targets, R:R ratios
- **Position Sizing**: Calculated based on account risk parameters
- **Risk Flags**: Earnings, low float, wide spread, halt risk indicators

### Technical Stack
- **Next.js 16** with App Router
- **TypeScript Strict Mode**
- **Tailwind CSS** (Dark ops-console theme)
- **Zod Contracts** for all data validation
- **TanStack Query** for data fetching
- **Recharts** for charts
- **Vitest** for testing
- **pnpm** package manager
- **Docker** support

## Quick Start

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Open http://localhost:3000
```

## Commands

```bash
pnpm dev          # Start development server
pnpm build        # Production build
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm typecheck    # Run TypeScript check
pnpm test         # Run Vitest tests
```

## Docker

```bash
# Build image
docker build -t qwen38-trading-engine .

# Run container
docker run -p 3000:3000 qwen38-trading-engine
```

## Configuration

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

The app works with **mock data by default** - no API keys required. To connect real market data providers, set the appropriate environment variables.

## Data Contracts

All data structures are defined using Zod schemas in `src/lib/contracts/index.ts`:
- `QuoteSchema` - Real-time quotes
- `WatchlistEntrySchema` - Complete watchlist entries
- `ConvictionScoreSchema` - Scoring breakdown
- `RiskConfigSchema` - Risk management settings
- `BacktestStatsSchema` - Backtest results

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout with providers
│   └── page.tsx            # Main dashboard page
├── components/             # React components
│   ├── watchlist/          # Watchlist table components
│   ├── charts/             # Recharts visualizations
│   └── ui/                 # Base UI components
├── lib/
│   ├── contracts/          # Zod schemas (data contracts)
│   ├── providers/          # Market data providers
│   │   ├── provider-interface.ts  # Provider interface
│   │   └── mock-provider.ts       # Mock data generator
│   ├── hooks/              # TanStack Query hooks
│   ├── scoring/            # Conviction scoring engine
│   ├── risk/               # Risk management module
│   └── utils/              # Formatters and helpers
```

## Mock Data

The mock provider generates realistic pre-market scenarios including:
- Gap ups/downs with volume confirmation
- Multiple setup types (Gap & Go, Breakout, VWAP Reclaim, etc.)
- News catalysts with sentiment scores
- Risk flags and position sizing
- Rejected candidates with rejection reasons

## Development Principles

1. **Contracts First**: All data shapes defined with Zod before UI implementation
2. **No `any`**: Strict TypeScript with full type safety
3. **Deterministic Scoring**: Same inputs always produce same scores
4. **Snapshot Storage**: Input snapshots stored for backtesting
5. **Green CI**: Lint, typecheck, tests, and build must pass

## License

MIT
