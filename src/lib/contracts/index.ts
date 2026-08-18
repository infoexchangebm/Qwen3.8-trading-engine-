/**
 * Core data contracts for Qwen3.8 Trading Engine
 * All schemas use Zod for runtime validation and type inference
 */

import { z } from 'zod';

// ============================================================================
// Basic Types
// ============================================================================

export const DirectionSchema = z.enum(['LONG', 'SHORT']);
export type Direction = z.infer<typeof DirectionSchema>;

export const SetupTypeSchema = z.enum([
  'GAP_AND_GO',
  'BREAKOUT',
  'VWAP_RECLAIM',
  'MOMENTUM_CONTINUATION',
  'REVERSAL',
  'PULLBACK',
]);
export type SetupType = z.infer<typeof SetupTypeSchema>;

export const SentimentSchema = z.enum(['POSITIVE', 'NEGATIVE', 'NEUTRAL']);
export type Sentiment = z.infer<typeof SentimentSchema>;

export const RiskFlagTypeSchema = z.enum([
  'EARNINGS_TODAY',
  'LOW_FLOAT',
  'WIDE_SPREAD',
  'HALT_RISK',
  'DILUTION_RISK',
  'CONCENTRATION_RISK',
]);
export type RiskFlagType = z.infer<typeof RiskFlagTypeSchema>;

// ============================================================================
// Market Data Contracts
// ============================================================================

export const QuoteSchema = z.object({
  symbol: z.string().min(1).max(10),
  price: z.number().positive(),
  change: z.number(),
  changePercent: z.number(),
  volume: z.number().nonnegative(),
  timestamp: z.string().datetime(),
});
export type Quote = z.infer<typeof QuoteSchema>;

export const BarSchema = z.object({
  timestamp: z.string().datetime(),
  open: z.number().positive(),
  high: z.number().positive(),
  low: z.number().positive(),
  close: z.number().positive(),
  volume: z.number().nonnegative(),
  vwap: z.number().positive().optional(),
});
export type Bar = z.infer<typeof BarSchema>;

export const LevelSchema = z.object({
  type: z.enum(['PRE_MARKET_HIGH', 'PRE_MARKET_LOW', 'PRIOR_DAY_HIGH', 'PRIOR_DAY_LOW', 'VWAP']),
  price: z.number().positive(),
  touched: z.boolean().default(false),
});
export type Level = z.infer<typeof LevelSchema>;

// ============================================================================
// News & Catalyst Contracts
// ============================================================================

export const HeadlineSchema = z.object({
  title: z.string().min(1),
  url: z.string().url(),
  source: z.string().min(1),
  publishedAt: z.string().datetime(),
});
export type Headline = z.infer<typeof HeadlineSchema>;

export const NewsItemSchema = z.object({
  id: z.string().uuid(),
  headline: z.string().min(1),
  summary: z.string().max(500),
  url: z.string().url(),
  source: z.string().min(1),
  publishedAt: z.string().datetime(),
  sentimentScore: z.number().min(-1).max(1),
  sentiment: SentimentSchema,
  relevanceScore: z.number().min(0).max(1),
});
export type NewsItem = z.infer<typeof NewsItemSchema>;

export const CatalystSchema = z.object({
  type: z.enum(['EARNINGS', 'FDA_APPROVAL', 'PRODUCT_LAUNCH', 'CONTRACT_AWARD', 'GUIDANCE', 'MACRO_DATA', 'OTHER']),
  description: z.string().min(1),
  impactScore: z.number().min(0).max(1),
  timeDecayFactor: z.number().min(0).max(1),
  newsHeadlines: HeadlineSchema.array().max(3),
});
export type Catalyst = z.infer<typeof CatalystSchema>;

// ============================================================================
// Scoring Contracts
// ============================================================================

export const ScoreFactorSchema = z.object({
  name: z.string().min(1),
  weight: z.number().min(0).max(1),
  rawValue: z.number(),
  normalizedValue: z.number().min(0).max(1),
  contribution: z.number(),
});
export type ScoreFactor = z.infer<typeof ScoreFactorSchema>;

export const ConvictionScoreSchema = z.object({
  total: z.number().min(0).max(100),
  momentum: ScoreFactorSchema,
  volumeConfirmation: ScoreFactorSchema,
  volatilityFit: ScoreFactorSchema,
  catalystQuality: ScoreFactorSchema,
  newsSentiment: ScoreFactorSchema,
  liquidity: ScoreFactorSchema,
  chartStructure: ScoreFactorSchema,
  eventPenalty: z.number().min(-20).max(0),
  dilutionPenalty: z.number().min(-20).max(0),
  factors: ScoreFactorSchema.array(),
});
export type ConvictionScore = z.infer<typeof ConvictionScoreSchema>;

// ============================================================================
// Risk & Position Sizing Contracts
// ============================================================================

export const RiskConfigSchema = z.object({
  accountEquity: z.number().positive(),
  maxRiskPerTradePercent: z.number().min(0.01).max(5),
  maxDailyLossPercent: z.number().min(0.5).max(10),
  maxConcurrentPositions: z.number().int().min(1).max(20),
  sectorExposureCaps: z.record(z.string(), z.number().min(0).max(1)),
  minShares: z.number().int().min(1).default(1),
  maxShares: z.number().int().positive().default(100000),
  liquidityCapPercent: z.number().min(1).max(50).default(10),
});
export type RiskConfig = z.infer<typeof RiskConfigSchema>;

export const StopLossSchema = z.object({
  price: z.number().positive(),
  reason: z.string().min(1),
  type: z.enum(['ATR_BASED', 'SUPPORT_LEVEL', 'RESISTANCE_LEVEL', 'PERCENTAGE', 'VOLATILITY']),
  atrMultiple: z.number().positive().optional(),
});
export type StopLoss = z.infer<typeof StopLossSchema>;

export const TargetSchema = z.object({
  level: z.enum(['T1', 'T2', 'T3']),
  price: z.number().positive(),
  percentOfPosition: z.number().min(0).max(100),
  rationale: z.string().min(1),
});
export type Target = z.infer<typeof TargetSchema>;

export const PositionSizeSchema = z.object({
  shares: z.number().int().positive(),
  notional: z.number().positive(),
  riskAmount: z.number().positive(),
  riskPercent: z.number().min(0).max(100),
  expectedRR: z.number().positive(),
  cappedByLiquidity: z.boolean().default(false),
});
export type PositionSize = z.infer<typeof PositionSizeSchema>;

// ============================================================================
// Watchlist Entry Contract
// ============================================================================

export const RiskFlagSchema = z.object({
  type: RiskFlagTypeSchema,
  severity: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  description: z.string().min(1),
});
export type RiskFlag = z.infer<typeof RiskFlagSchema>;

export const WatchlistEntrySchema = z.object({
  id: z.string().uuid(),
  snapshotId: z.string().uuid(),
  date: z.string().date(),
  createdAt: z.string().datetime(),
  
  // Symbol Info
  symbol: z.string().min(1).max(10),
  companyName: z.string().min(1).optional(),
  sector: z.string().min(1).optional(),
  industry: z.string().min(1).optional(),
  
  // Direction & Setup
  direction: DirectionSchema,
  setupType: SetupTypeSchema,
  convictionScore: ConvictionScoreSchema,
  
  // Price Action
  quote: QuoteSchema,
  preMarketChangePercent: z.number(),
  relativeVolume: z.number().positive(),
  
  // Volatility
  atr14: z.number().positive(),
  atrPercent: z.number().positive(),
  
  // Levels
  levels: LevelSchema.array(),
  
  // Catalyst & News
  catalyst: CatalystSchema.optional(),
  topNewsHeadlines: HeadlineSchema.array().max(3),
  newsSentimentScore: z.number().min(-1).max(1),
  
  // Trade Plan
  entryTrigger: z.string().min(1),
  stopLoss: StopLossSchema,
  targets: TargetSchema.array().min(1).max(3),
  positionSize: PositionSizeSchema,
  expectedRR: z.number().positive(),
  
  // Risk
  riskFlags: RiskFlagSchema.array(),
  
  // Raw input snapshot for replay
  inputSnapshot: z.record(z.string(), z.unknown()),
});
export type WatchlistEntry = z.infer<typeof WatchlistEntrySchema>;

// ============================================================================
// Rejected Candidate Contract
// ============================================================================

export const RejectionReasonSchema = z.object({
  filter: z.string().min(1),
  reason: z.string().min(1),
  threshold: z.number().optional(),
  actualValue: z.number().optional(),
});
export type RejectionReason = z.infer<typeof RejectionReasonSchema>;

export const RejectedCandidateSchema = z.object({
  id: z.string().uuid(),
  symbol: z.string().min(1).max(10),
  date: z.string().date(),
  rejectionReasons: RejectionReasonSchema.array(),
  preliminaryScore: ConvictionScoreSchema.optional(),
  inputSnapshot: z.record(z.string(), z.unknown()),
});
export type RejectedCandidate = z.infer<typeof RejectedCandidateSchema>;

// ============================================================================
// Backtest Contracts
// ============================================================================

export const TradeResultSchema = z.object({
  entryId: z.string().uuid(),
  symbol: z.string(),
  setupType: SetupTypeSchema,
  direction: DirectionSchema,
  entryPrice: z.number().positive(),
  exitPrice: z.number().positive(),
  exitReason: z.enum(['TARGET_HIT', 'STOP_LOSS', 'TIME_EXIT', 'MANUAL']),
  shares: z.number().int().positive(),
  pnl: z.number(),
  rAchieved: z.number(),
  entryDate: z.string().datetime(),
  exitDate: z.string().datetime(),
});
export type TradeResult = z.infer<typeof TradeResultSchema>;

export const BacktestStatsSchema = z.object({
  totalTrades: z.number().int().nonnegative(),
  winningTrades: z.number().int().nonnegative(),
  losingTrades: z.number().int().nonnegative(),
  hitRate: z.number().min(0).max(1),
  averageR: z.number(),
  expectancy: z.number(),
  maxDrawdown: z.number(),
  profitFactor: z.number().nonnegative(),
  bySetupType: z.record(SetupTypeSchema, z.object({
    count: z.number().int().nonnegative(),
    hitRate: z.number().min(0).max(1),
    averageR: z.number(),
  })),
});
export type BacktestStats = z.infer<typeof BacktestStatsSchema>;

// ============================================================================
// Journal Entry Contract
// ============================================================================

export const JournalEntrySchema = z.object({
  id: z.string().uuid(),
  watchlistEntryId: z.string().uuid(),
  symbol: z.string(),
  status: z.enum(['TAKEN', 'SKIPPED']),
  skipReason: z.string().optional(),
  plannedEntry: z.number().positive(),
  actualEntry: z.number().positive().optional(),
  plannedStop: z.number().positive(),
  actualStop: z.number().positive().optional(),
  plannedTargets: TargetSchema.array(),
  actualExit: z.number().positive().optional(),
  plannedR: z.number().positive(),
  actualR: z.number().optional(),
  notes: z.string().optional(),
  screenshotUrl: z.string().url().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime().optional(),
});
export type JournalEntry = z.infer<typeof JournalEntrySchema>;

// ============================================================================
// Scoring Weights Config
// ============================================================================

export const ScoringWeightsSchema = z.object({
  momentum: z.number().min(0).max(1).default(0.2),
  volumeConfirmation: z.number().min(0).max(1).default(0.15),
  volatilityFit: z.number().min(0).max(1).default(0.15),
  catalystQuality: z.number().min(0).max(1).default(0.2),
  newsSentiment: z.number().min(0).max(1).default(0.1),
  liquidity: z.number().min(0).max(1).default(0.1),
  chartStructure: z.number().min(0).max(1).default(0.1),
  eventPenaltyMultiplier: z.number().min(0).max(2).default(1),
  dilutionPenaltyMultiplier: z.number().min(0).max(2).default(1),
});
export type ScoringWeights = z.infer<typeof ScoringWeightsSchema>;

// ============================================================================
// API Response Contracts
// ============================================================================

export const WatchlistResponseSchema = z.object({
  entries: WatchlistEntrySchema.array(),
  rejectedCandidates: RejectedCandidateSchema.array(),
  generatedAt: z.string().datetime(),
  marketStatus: z.enum(['PRE_MARKET', 'OPEN', 'CLOSED', 'AFTER_HOURS']),
});
export type WatchlistResponse = z.infer<typeof WatchlistResponseSchema>;

export const SnapshotSchema = z.object({
  id: z.string().uuid(),
  date: z.string().date(),
  createdAt: z.string().datetime(),
  entries: WatchlistEntrySchema.array(),
  rejectedCandidates: RejectedCandidateSchema.array(),
  scoringWeights: ScoringWeightsSchema,
  riskConfig: RiskConfigSchema,
  marketConditions: z.object({
    spyClose: z.number().optional(),
    qqqClose: z.number().optional(),
    vix: z.number().optional(),
    marketRegime: z.enum(['BULL', 'BEAR', 'SIDEWAYS']).optional(),
  }),
});
export type Snapshot = z.infer<typeof SnapshotSchema>;

export const BacktestRequestSchema = z.object({
  startDate: z.string().date(),
  endDate: z.string().date(),
  setupTypes: SetupTypeSchema.array().optional(),
  includeRejected: z.boolean().default(false),
});
export type BacktestRequest = z.infer<typeof BacktestRequestSchema>;

export const BacktestResponseSchema = z.object({
  stats: BacktestStatsSchema,
  trades: TradeResultSchema.array(),
  equityCurve: z.array(z.object({
    date: z.string().date(),
    equity: z.number(),
    drawdown: z.number(),
  })),
});
export type BacktestResponse = z.infer<typeof BacktestResponseSchema>;

// ============================================================================
// Export all schemas for external use
// ============================================================================

export const schemas = {
  Direction: DirectionSchema,
  SetupType: SetupTypeSchema,
  Sentiment: SentimentSchema,
  RiskFlagType: RiskFlagTypeSchema,
  Quote: QuoteSchema,
  Bar: BarSchema,
  Level: LevelSchema,
  Headline: HeadlineSchema,
  NewsItem: NewsItemSchema,
  Catalyst: CatalystSchema,
  ScoreFactor: ScoreFactorSchema,
  ConvictionScore: ConvictionScoreSchema,
  RiskConfig: RiskConfigSchema,
  StopLoss: StopLossSchema,
  Target: TargetSchema,
  PositionSize: PositionSizeSchema,
  RiskFlag: RiskFlagSchema,
  WatchlistEntry: WatchlistEntrySchema,
  RejectionReason: RejectionReasonSchema,
  RejectedCandidate: RejectedCandidateSchema,
  TradeResult: TradeResultSchema,
  BacktestStats: BacktestStatsSchema,
  JournalEntry: JournalEntrySchema,
  ScoringWeights: ScoringWeightsSchema,
  WatchlistResponse: WatchlistResponseSchema,
  Snapshot: SnapshotSchema,
  BacktestRequest: BacktestRequestSchema,
  BacktestResponse: BacktestResponseSchema,
};
