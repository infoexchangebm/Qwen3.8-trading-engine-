/**
 * Mock data provider for development and testing
 * Generates realistic market data without requiring API keys
 */

import { z } from 'zod';
import {
  QuoteSchema,
  BarSchema,
  NewsItemSchema,
  CatalystSchema,
  HeadlineSchema,
  WatchlistEntrySchema,
  RejectedCandidateSchema,
  ConvictionScoreSchema,
  ScoreFactorSchema,
  LevelSchema,
  StopLossSchema,
  TargetSchema,
  PositionSizeSchema,
  RiskFlagSchema,
} from '@/lib/contracts';

// Mock ticker universe
const MOCK_TICKERS = [
  { symbol: 'NVDA', name: 'NVIDIA Corporation', sector: 'Technology', industry: 'Semiconductors' },
  { symbol: 'TSLA', name: 'Tesla Inc', sector: 'Consumer Cyclical', industry: 'Auto Manufacturers' },
  { symbol: 'AAPL', name: 'Apple Inc', sector: 'Technology', industry: 'Consumer Electronics' },
  { symbol: 'AMD', name: 'Advanced Micro Devices', sector: 'Technology', industry: 'Semiconductors' },
  { symbol: 'MSFT', name: 'Microsoft Corporation', sector: 'Technology', industry: 'Software' },
  { symbol: 'AMZN', name: 'Amazon.com Inc', sector: 'Consumer Cyclical', industry: 'Internet Retail' },
  { symbol: 'META', name: 'Meta Platforms Inc', sector: 'Technology', industry: 'Internet Content' },
  { symbol: 'GOOGL', name: 'Alphabet Inc', sector: 'Technology', industry: 'Internet Content' },
  { symbol: 'SMCI', name: 'Super Micro Computer', sector: 'Technology', industry: 'Computer Hardware' },
  { symbol: 'PLTR', name: 'Palantir Technologies', sector: 'Technology', industry: 'Software' },
  { symbol: 'COIN', name: 'Coinbase Global', sector: 'Financial Services', industry: 'Capital Markets' },
  { symbol: 'MARA', name: 'Marathon Digital Holdings', sector: 'Financial Services', industry: 'Capital Markets' },
  { symbol: 'RIOT', name: 'Riot Platforms', sector: 'Financial Services', industry: 'Capital Markets' },
  { symbol: 'SOFI', name: 'SoFi Technologies', sector: 'Financial Services', industry: 'Credit Services' },
  { symbol: 'NIO', name: 'NIO Inc', sector: 'Consumer Cyclical', industry: 'Auto Manufacturers' },
  { symbol: 'LCID', name: 'Lucid Group', sector: 'Consumer Cyclical', industry: 'Auto Manufacturers' },
  { symbol: 'RIVN', name: 'Rivian Automotive', sector: 'Consumer Cyclical', industry: 'Auto Manufacturers' },
  { symbol: 'UPST', name: 'Upstart Holdings', sector: 'Financial Services', industry: 'Credit Services' },
  { symbol: 'AFRM', name: 'Affirm Holdings', sector: 'Financial Services', industry: 'Credit Services' },
];

const SETUP_TYPES = ['GAP_AND_GO', 'BREAKOUT', 'VWAP_RECLAIM', 'MOMENTUM_CONTINUATION', 'REVERSAL', 'PULLBACK'] as const;
const DIRECTIONS = ['LONG', 'SHORT'] as const;

function randomInRange(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function randomChoice<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function generateQuote(symbol: string, basePrice: number): z.infer<typeof QuoteSchema> {
  const changePercent = randomInRange(-8, 12);
  const change = basePrice * (changePercent / 100);
  const price = basePrice + change;
  
  return QuoteSchema.parse({
    symbol,
    price: parseFloat(price.toFixed(2)),
    change: parseFloat(change.toFixed(2)),
    changePercent: parseFloat(changePercent.toFixed(2)),
    volume: Math.floor(randomInRange(1000000, 50000000)),
    timestamp: new Date().toISOString(),
  });
}

function generateLevels(price: number, preMarketChangePercent: number): z.infer<typeof LevelSchema>[] {
  const preMarketHigh = price * (1 + preMarketChangePercent / 100 + randomInRange(0, 0.02));
  const preMarketLow = price * (1 + preMarketChangePercent / 100 - randomInRange(0, 0.02));
  const priorDayHigh = price * (1 + randomInRange(0.01, 0.05));
  const priorDayLow = price * (1 - randomInRange(0.01, 0.05));
  const vwap = price * (1 + randomInRange(-0.02, 0.02));
  
  return LevelSchema.array().parse([
    { type: 'PRE_MARKET_HIGH', price: parseFloat(preMarketHigh.toFixed(2)), touched: false },
    { type: 'PRE_MARKET_LOW', price: parseFloat(preMarketLow.toFixed(2)), touched: false },
    { type: 'PRIOR_DAY_HIGH', price: parseFloat(priorDayHigh.toFixed(2)), touched: false },
    { type: 'PRIOR_DAY_LOW', price: parseFloat(priorDayLow.toFixed(2)), touched: false },
    { type: 'VWAP', price: parseFloat(vwap.toFixed(2)), touched: false },
  ]);
}

function generateConvictionScore(): z.infer<typeof ConvictionScoreSchema> {
  const momentumRaw = randomInRange(0, 1);
  const volumeRaw = randomInRange(0, 1);
  const volatilityRaw = randomInRange(0, 1);
  const catalystRaw = randomInRange(0, 1);
  const sentimentRaw = randomInRange(0, 1);
  const liquidityRaw = randomInRange(0, 1);
  const structureRaw = randomInRange(0, 1);
  
  const weights = {
    momentum: 0.2,
    volumeConfirmation: 0.15,
    volatilityFit: 0.15,
    catalystQuality: 0.2,
    newsSentiment: 0.1,
    liquidity: 0.1,
    chartStructure: 0.1,
  };
  
  const eventPenalty = randomInRange(-15, 0);
  const dilutionPenalty = randomInRange(-10, 0);
  
  const total = 
    momentumRaw * weights.momentum * 100 +
    volumeRaw * weights.volumeConfirmation * 100 +
    volatilityRaw * weights.volatilityFit * 100 +
    catalystRaw * weights.catalystQuality * 100 +
    sentimentRaw * weights.newsSentiment * 100 +
    liquidityRaw * weights.liquidity * 100 +
    structureRaw * weights.chartStructure * 100 +
    eventPenalty +
    dilutionPenalty;
  
  return ConvictionScoreSchema.parse({
    total: Math.min(100, Math.max(0, total)),
    momentum: ScoreFactorSchema.parse({
      name: 'Momentum',
      weight: weights.momentum,
      rawValue: momentumRaw,
      normalizedValue: momentumRaw,
      contribution: momentumRaw * weights.momentum * 100,
    }),
    volumeConfirmation: ScoreFactorSchema.parse({
      name: 'Volume Confirmation',
      weight: weights.volumeConfirmation,
      rawValue: volumeRaw,
      normalizedValue: volumeRaw,
      contribution: volumeRaw * weights.volumeConfirmation * 100,
    }),
    volatilityFit: ScoreFactorSchema.parse({
      name: 'Volatility Fit',
      weight: weights.volatilityFit,
      rawValue: volatilityRaw,
      normalizedValue: volatilityRaw,
      contribution: volatilityRaw * weights.volatilityFit * 100,
    }),
    catalystQuality: ScoreFactorSchema.parse({
      name: 'Catalyst Quality',
      weight: weights.catalystQuality,
      rawValue: catalystRaw,
      normalizedValue: catalystRaw,
      contribution: catalystRaw * weights.catalystQuality * 100,
    }),
    newsSentiment: ScoreFactorSchema.parse({
      name: 'News Sentiment',
      weight: weights.newsSentiment,
      rawValue: sentimentRaw,
      normalizedValue: sentimentRaw,
      contribution: sentimentRaw * weights.newsSentiment * 100,
    }),
    liquidity: ScoreFactorSchema.parse({
      name: 'Liquidity',
      weight: weights.liquidity,
      rawValue: liquidityRaw,
      normalizedValue: liquidityRaw,
      contribution: liquidityRaw * weights.liquidity * 100,
    }),
    chartStructure: ScoreFactorSchema.parse({
      name: 'Chart Structure',
      weight: weights.chartStructure,
      rawValue: structureRaw,
      normalizedValue: structureRaw,
      contribution: structureRaw * weights.chartStructure * 100,
    }),
    eventPenalty,
    dilutionPenalty,
    factors: [],
  });
}

function generateCatalyst(): z.infer<typeof CatalystSchema> {
  const types = ['EARNINGS', 'FDA_APPROVAL', 'PRODUCT_LAUNCH', 'CONTRACT_AWARD', 'GUIDANCE', 'MACRO_DATA', 'OTHER'] as const;
  const type = randomChoice(types);
  
  const descriptions: Record<string, string> = {
    EARNINGS: 'Beat earnings estimates with strong revenue growth',
    FDA_APPROVAL: 'Received FDA approval for key drug candidate',
    PRODUCT_LAUNCH: 'Announced new flagship product line',
    CONTRACT_AWARD: 'Secured major government contract',
    GUIDANCE: 'Raised full-year guidance above consensus',
    MACRO_DATA: 'Positive macroeconomic data release',
    OTHER: 'Significant corporate development announced',
  };
  
  return CatalystSchema.parse({
    type,
    description: descriptions[type],
    impactScore: parseFloat(randomInRange(0.5, 1).toFixed(2)),
    timeDecayFactor: parseFloat(randomInRange(0.7, 1).toFixed(2)),
    newsHeadlines: HeadlineSchema.array().parse([
      {
        title: `${type} drives stock movement`,
        url: 'https://example.com/news/1',
        source: 'MarketWatch',
        publishedAt: new Date(Date.now() - randomInRange(1, 24) * 3600000).toISOString(),
      },
    ]),
  });
}

function generateNewsHeadlines(symbol: string): z.infer<typeof HeadlineSchema>[] {
  const sources = ['Bloomberg', 'Reuters', 'CNBC', 'MarketWatch', 'Seeking Alpha'];
  const count = Math.floor(randomInRange(1, 4));
  
  return Array.from({ length: count }, (_, i) => HeadlineSchema.parse({
    title: `${symbol} ${randomChoice(['gaps up', 'surges', 'drops', 'trades higher', 'faces pressure'])} on ${randomChoice(['volume', 'news', 'sector strength', 'analyst upgrade', 'market sentiment'])}`,
    url: `https://example.com/news/${generateUUID()}`,
    source: randomChoice(sources),
    publishedAt: new Date(Date.now() - randomInRange(0.5, 23) * 3600000).toISOString(),
  }));
}

function generateStopLoss(entryPrice: number, atr: number, direction: 'LONG' | 'SHORT'): z.infer<typeof StopLossSchema> {
  const types = ['ATR_BASED', 'SUPPORT_LEVEL', 'RESISTANCE_LEVEL', 'PERCENTAGE'] as const;
  const type = randomChoice(types);
  
  let price: number;
  let reason: string;
  
  if (direction === 'LONG') {
    if (type === 'ATR_BASED') {
      price = entryPrice - atr * 2;
      reason = '2x ATR below entry to avoid normal volatility';
    } else if (type === 'SUPPORT_LEVEL') {
      price = entryPrice * (1 - randomInRange(0.03, 0.08));
      reason = 'Below key support level from prior consolidation';
    } else {
      price = entryPrice * (1 - randomInRange(0.05, 0.1));
      reason = 'Fixed percentage stop for risk management';
    }
  } else {
    if (type === 'ATR_BASED') {
      price = entryPrice + atr * 2;
      reason = '2x ATR above entry to avoid normal volatility';
    } else if (type === 'RESISTANCE_LEVEL') {
      price = entryPrice * (1 + randomInRange(0.03, 0.08));
      reason = 'Above key resistance level from prior highs';
    } else {
      price = entryPrice * (1 + randomInRange(0.05, 0.1));
      reason = 'Fixed percentage stop for risk management';
    }
  }
  
  return StopLossSchema.parse({
    price: parseFloat(price.toFixed(2)),
    reason,
    type,
    atrMultiple: type === 'ATR_BASED' ? 2 : undefined,
  });
}

function generateTargets(entryPrice: number, stopPrice: number, direction: 'LONG' | 'SHORT'): z.infer<typeof TargetSchema>[] {
  const risk = Math.abs(entryPrice - stopPrice);
  const targets: z.infer<typeof TargetSchema>[] = [];
  
  if (direction === 'LONG') {
    const t1Price = entryPrice + risk * 1.5;
    const t2Price = entryPrice + risk * 3;
    
    targets.push(
      TargetSchema.parse({
        level: 'T1',
        price: parseFloat(t1Price.toFixed(2)),
        percentOfPosition: 50,
        rationale: '1.5R target at nearest resistance level',
      }),
      TargetSchema.parse({
        level: 'T2',
        price: parseFloat(t2Price.toFixed(2)),
        percentOfPosition: 50,
        rationale: '3R target at extension level',
      })
    );
  } else {
    const t1Price = entryPrice - risk * 1.5;
    const t2Price = entryPrice - risk * 3;
    
    targets.push(
      TargetSchema.parse({
        level: 'T1',
        price: parseFloat(t1Price.toFixed(2)),
        percentOfPosition: 50,
        rationale: '1.5R target at nearest support level',
      }),
      TargetSchema.parse({
        level: 'T2',
        price: parseFloat(t2Price.toFixed(2)),
        percentOfPosition: 50,
        rationale: '3R target at extension level',
      })
    );
  }
  
  return targets;
}

function generatePositionSize(
  equity: number,
  riskPercent: number,
  entryPrice: number,
  stopPrice: number,
  avgVolume: number
): z.infer<typeof PositionSizeSchema> {
  const riskAmount = equity * (riskPercent / 100);
  const riskPerShare = Math.abs(entryPrice - stopPrice);
  const idealShares = Math.floor(riskAmount / riskPerShare);
  
  const liquidityCap = Math.floor(avgVolume * 0.1); // 10% of daily volume
  const shares = Math.min(idealShares, liquidityCap, 100000);
  const notional = shares * entryPrice;
  const actualRiskPercent = (shares * riskPerShare / equity) * 100;
  const expectedRR = randomInRange(2, 4);
  
  return PositionSizeSchema.parse({
    shares,
    notional: parseFloat(notional.toFixed(2)),
    riskAmount: parseFloat((shares * riskPerShare).toFixed(2)),
    riskPercent: parseFloat(actualRiskPercent.toFixed(2)),
    expectedRR: parseFloat(expectedRR.toFixed(2)),
    cappedByLiquidity: idealShares > liquidityCap,
  });
}

function generateRiskFlags(symbol: string): z.infer<typeof RiskFlagSchema>[] {
  const flags: z.infer<typeof RiskFlagSchema>[] = [];
  const flagTypes = ['EARNINGS_TODAY', 'LOW_FLOAT', 'WIDE_SPREAD', 'HALT_RISK', 'DILUTION_RISK'] as const;
  const severities = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as const;
  
  // Randomly add 0-3 risk flags
  const numFlags = Math.floor(randomInRange(0, 4));
  const selectedTypes = new Set<string>();
  
  for (let i = 0; i < numFlags; i++) {
    const type = randomChoice(flagTypes);
    if (!selectedTypes.has(type)) {
      selectedTypes.add(type);
      flags.push(RiskFlagSchema.parse({
        type,
        severity: randomChoice(severities),
        description: `${type.replace(/_/g, ' ').toLowerCase()} detected for ${symbol}`,
      }));
    }
  }
  
  return flags;
}

function generateEntryTrigger(setupType: string, direction: string): string {
  const triggers: Record<string, string> = {
    GAP_AND_GO: direction === 'LONG' 
      ? 'Break above pre-market high with volume confirmation' 
      : 'Break below pre-market low with volume confirmation',
    BREAKOUT: direction === 'LONG'
      ? 'Clean break above consolidation range on elevated volume'
      : 'Clean break below support level on elevated volume',
    VWAP_RECLAIM: direction === 'LONG'
      ? 'Reclaim VWAP after pullback with bullish divergence'
      : 'Reject VWAP after bounce with bearish divergence',
    MOMENTUM_CONTINUATION: direction === 'LONG'
      ? 'Continuation above opening range with strong relative volume'
      : 'Continuation below opening range with strong relative volume',
    REVERSAL: direction === 'LONG'
      ? 'Hammer candle at key support with RSI divergence'
      : 'Shooting star at key resistance with RSI divergence',
    PULLBACK: direction === 'LONG'
      ? 'Pullback to EMA8/EMA21 confluence with decreasing volume'
      : 'Pullback to EMA8/EMA21 confluence with decreasing volume',
  };
  return triggers[setupType] || 'Technical setup trigger';
}

export function generateMockWatchlistEntry(
  ticker: typeof MOCK_TICKERS[0],
  snapshotId: string,
  date: string
): z.infer<typeof WatchlistEntrySchema> {
  const basePrice = randomInRange(10, 500);
  const preMarketChangePercent = randomInRange(-5, 15);
  const direction = randomChoice(DIRECTIONS);
  const setupType = randomChoice(SETUP_TYPES);
  
  const quote = generateQuote(ticker.symbol, basePrice);
  const levels = generateLevels(quote.price, preMarketChangePercent);
  const convictionScore = generateConvictionScore();
  const atr14 = parseFloat((quote.price * randomInRange(0.02, 0.08)).toFixed(2));
  const atrPercent = parseFloat((atr14 / quote.price * 100).toFixed(2));
  
  const entryPrice = direction === 'LONG' 
    ? parseFloat((levels.find(l => l.type === 'PRE_MARKET_HIGH')?.price || quote.price * 1.01).toFixed(2))
    : parseFloat((levels.find(l => l.type === 'PRE_MARKET_LOW')?.price || quote.price * 0.99).toFixed(2));
  
  const stopLoss = generateStopLoss(entryPrice, atr14, direction);
  const targets = generateTargets(entryPrice, stopLoss.price, direction);
  const positionSize = generatePositionSize(100000, 1, entryPrice, stopLoss.price, quote.volume);
  const riskReward = parseFloat(((targets[0].price - entryPrice) / (entryPrice - stopLoss.price)).toFixed(2));
  
  return WatchlistEntrySchema.parse({
    id: generateUUID(),
    snapshotId,
    date,
    createdAt: new Date().toISOString(),
    symbol: ticker.symbol,
    companyName: ticker.name,
    sector: ticker.sector,
    industry: ticker.industry,
    direction,
    setupType,
    convictionScore,
    quote,
    preMarketChangePercent: parseFloat(preMarketChangePercent.toFixed(2)),
    relativeVolume: parseFloat(randomInRange(1.5, 8).toFixed(2)),
    atr14,
    atrPercent,
    levels,
    catalyst: Math.random() > 0.3 ? generateCatalyst() : undefined,
    topNewsHeadlines: generateNewsHeadlines(ticker.symbol),
    newsSentimentScore: parseFloat(randomInRange(-0.5, 0.8).toFixed(2)),
    entryTrigger: generateEntryTrigger(setupType, direction),
    stopLoss,
    targets,
    positionSize,
    expectedRR: Math.max(1.5, riskReward),
    riskFlags: generateRiskFlags(ticker.symbol),
    inputSnapshot: {
      basePrice,
      preMarketChangePercent,
      direction,
      setupType,
      generatedAt: new Date().toISOString(),
    },
  });
}

export function generateMockRejectedCandidate(
  ticker: typeof MOCK_TICKERS[0],
  date: string
): z.infer<typeof RejectedCandidateSchema> {
  const filters = ['MIN_VOLUME', 'MIN_RVOL', 'SPREAD_TOO_WIDE', 'LOW_CONVICTION', 'EVENT_RISK', 'SECTOR_CAP'];
  const reasons = [
    'Average volume below minimum threshold',
    'Relative volume insufficient for momentum play',
    'Bid-ask spread exceeds maximum allowed',
    'Composite score below minimum conviction threshold',
    'Upcoming earnings or corporate event',
    'Sector exposure cap reached',
  ];
  
  const numReasons = Math.floor(randomInRange(1, 3));
  const rejectionReasons = Array.from({ length: numReasons }, (_, i) => ({
    filter: filters[i % filters.length],
    reason: reasons[i % reasons.length],
    threshold: parseFloat(randomInRange(1, 5).toFixed(2)),
    actualValue: parseFloat(randomInRange(0.5, 3).toFixed(2)),
  }));
  
  return RejectedCandidateSchema.parse({
    id: generateUUID(),
    symbol: ticker.symbol,
    date,
    rejectionReasons,
    inputSnapshot: {
      generatedAt: new Date().toISOString(),
    },
  });
}

export async function fetchMockWatchlist(): Promise<{
  entries: z.infer<typeof WatchlistEntrySchema>[];
  rejectedCandidates: z.infer<typeof RejectedCandidateSchema>[];
}> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const snapshotId = generateUUID();
  const date = new Date().toISOString().split('T')[0];
  
  // Select 12-18 tickers for the watchlist
  const numEntries = Math.floor(randomInRange(12, 19));
  const shuffled = [...MOCK_TICKERS].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, numEntries);
  const rejected = shuffled.slice(numEntries, numEntries + 3);
  
  const entries = selected.map(ticker => generateMockWatchlistEntry(ticker, snapshotId, date));
  const rejectedCandidates = rejected.map(ticker => generateMockRejectedCandidate(ticker, date));
  
  // Sort by conviction score descending
  entries.sort((a, b) => b.convictionScore.total - a.convictionScore.total);
  
  return { entries, rejectedCandidates };
}

export async function fetchMockBars(symbol: string, timeframe: '1m' | '5m' | '15m' | '1d', count: number = 50): Promise<z.infer<typeof BarSchema>[]> {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const basePrice = randomInRange(50, 300);
  const bars: z.infer<typeof BarSchema>[] = [];
  let currentPrice = basePrice;
  
  const now = new Date();
  
  for (let i = count - 1; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * (timeframe === '1d' ? 86400000 : timeframe === '15m' ? 900000 : timeframe === '5m' ? 300000 : 60000));
    const volatility = timeframe === '1d' ? 0.03 : timeframe === '15m' ? 0.01 : 0.005;
    
    const open = currentPrice;
    const close = open * (1 + randomInRange(-volatility, volatility));
    const high = Math.max(open, close) * (1 + randomInRange(0, volatility / 2));
    const low = Math.min(open, close) * (1 - randomInRange(0, volatility / 2));
    const volume = Math.floor(randomInRange(10000, 1000000));
    const vwap = (open + high + low + close) / 4;
    
    bars.push(BarSchema.parse({
      timestamp: timestamp.toISOString(),
      open: parseFloat(open.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)),
      close: parseFloat(close.toFixed(2)),
      volume,
      vwap: parseFloat(vwap.toFixed(2)),
    }));
    
    currentPrice = close;
  }
  
  return bars;
}

export async function fetchMockNews(symbol: string): Promise<z.infer<typeof NewsItemSchema>[]> {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const count = Math.floor(randomInRange(3, 8));
  const sentiments: Array<'POSITIVE' | 'NEGATIVE' | 'NEUTRAL'> = ['POSITIVE', 'NEGATIVE', 'NEUTRAL'];
  
  return Array.from({ length: count }, (_, i) => {
    const sentimentScore = randomInRange(-0.8, 0.8);
    const sentiment = sentimentScore > 0.2 ? 'POSITIVE' : sentimentScore < -0.2 ? 'NEGATIVE' : 'NEUTRAL';
    
    return NewsItemSchema.parse({
      id: generateUUID(),
      headline: `${symbol} ${randomChoice(['reports strong', 'faces challenges with', 'announces', 'updates guidance on', 'sees growth in'])} ${randomChoice(['quarterly results', 'new product line', 'market expansion', 'revenue projections', 'strategic partnership'])}`,
      summary: `Latest news about ${symbol} indicates ${sentiment.toLowerCase()} developments in recent trading sessions. Analysts are watching key levels.`,
      url: `https://example.com/news/${generateUUID()}`,
      source: randomChoice(['Bloomberg', 'Reuters', 'CNBC', 'MarketWatch', 'Seeking Alpha']),
      publishedAt: new Date(Date.now() - randomInRange(1, 48) * 3600000).toISOString(),
      sentimentScore: parseFloat(sentimentScore.toFixed(2)),
      sentiment,
      relevanceScore: parseFloat(randomInRange(0.5, 1).toFixed(2)),
    });
  });
}
