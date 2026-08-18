import { describe, it, expect } from 'vitest';
import { 
  QuoteSchema, 
  WatchlistEntrySchema, 
  ConvictionScoreSchema,
  DirectionSchema,
  SetupTypeSchema
} from './index';

describe('Zod Contracts', () => {
  it('should validate a basic quote', () => {
    const quote = {
      symbol: 'AAPL',
      price: 150.25,
      change: 2.5,
      changePercent: 1.69,
      volume: 1000000,
      timestamp: new Date().toISOString(),
    };
    
    const result = QuoteSchema.safeParse(quote);
    expect(result.success).toBe(true);
  });

  it('should reject invalid quote with negative price', () => {
    const quote = {
      symbol: 'AAPL',
      price: -150.25,
      change: 2.5,
      changePercent: 1.69,
      volume: 1000000,
      timestamp: new Date().toISOString(),
    };
    
    const result = QuoteSchema.safeParse(quote);
    expect(result.success).toBe(false);
  });

  it('should validate direction enum', () => {
    const longResult = DirectionSchema.safeParse('LONG');
    const shortResult = DirectionSchema.safeParse('SHORT');
    const invalidResult = DirectionSchema.safeParse('INVALID');
    
    expect(longResult.success).toBe(true);
    expect(shortResult.success).toBe(true);
    expect(invalidResult.success).toBe(false);
  });

  it('should validate setup type enum', () => {
    const validResult = SetupTypeSchema.safeParse('GAP_AND_GO');
    const invalidResult = SetupTypeSchema.safeParse('INVALID_SETUP');
    
    expect(validResult.success).toBe(true);
    expect(invalidResult.success).toBe(false);
  });

  it('should validate conviction score structure', () => {
    const score = {
      total: 75,
      momentum: {
        name: 'Momentum',
        weight: 0.2,
        rawValue: 0.8,
        normalizedValue: 0.8,
        contribution: 16,
      },
      volumeConfirmation: {
        name: 'Volume Confirmation',
        weight: 0.15,
        rawValue: 0.7,
        normalizedValue: 0.7,
        contribution: 10.5,
      },
      volatilityFit: {
        name: 'Volatility Fit',
        weight: 0.15,
        rawValue: 0.6,
        normalizedValue: 0.6,
        contribution: 9,
      },
      catalystQuality: {
        name: 'Catalyst Quality',
        weight: 0.2,
        rawValue: 0.9,
        normalizedValue: 0.9,
        contribution: 18,
      },
      newsSentiment: {
        name: 'News Sentiment',
        weight: 0.1,
        rawValue: 0.5,
        normalizedValue: 0.5,
        contribution: 5,
      },
      liquidity: {
        name: 'Liquidity',
        weight: 0.1,
        rawValue: 0.8,
        normalizedValue: 0.8,
        contribution: 8,
      },
      chartStructure: {
        name: 'Chart Structure',
        weight: 0.1,
        rawValue: 0.7,
        normalizedValue: 0.7,
        contribution: 7,
      },
      eventPenalty: -5,
      dilutionPenalty: -3,
      factors: [],
    };
    
    const result = ConvictionScoreSchema.safeParse(score);
    expect(result.success).toBe(true);
  });
});
