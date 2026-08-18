/**
 * Provider-agnostic data interface
 * All market data providers must implement this interface
 */

import type { Bar, NewsItem, WatchlistEntry, RejectedCandidate } from '@/lib/contracts';

export interface MarketData {
  quote: {
    symbol: string;
    price: number;
    change: number;
    changePercent: number;
    volume: number;
    timestamp: string;
  };
  bars: Bar[];
}

export interface NewsData {
  items: NewsItem[];
}

export interface WatchlistData {
  entries: WatchlistEntry[];
  rejectedCandidates: RejectedCandidate[];
  generatedAt: string;
  marketStatus: 'PRE_MARKET' | 'OPEN' | 'CLOSED' | 'AFTER_HOURS';
}

export interface IMarketDataProvider {
  /**
   * Fetch current quote and recent bars for a symbol
   */
  getMarketData(symbol: string, timeframe?: '1m' | '5m' | '15m' | '1d', count?: number): Promise<MarketData>;
  
  /**
   * Fetch news items for a symbol
   */
  getNews(symbol: string): Promise<NewsData>;
  
  /**
   * Fetch the daily watchlist with ranked setups
   */
  getWatchlist(): Promise<WatchlistData>;
  
  /**
   * Get account fundamentals and float data
   */
  getFundamentals(symbol: string): Promise<{
    marketCap: number;
    float: number;
    avgVolume: number;
    peRatio?: number;
    eps?: number;
  }>;
  
  /**
   * Get macroeconomic calendar events
   */
  getMacroCalendar(start: Date, end: Date): Promise<Array<{
    date: string;
    event: string;
    impact: 'LOW' | 'MEDIUM' | 'HIGH';
    actual?: string;
    forecast?: string;
    previous?: string;
  }>>;
}

/**
 * Abstract base class for providers
 * Provides common functionality and validation
 */
export abstract class BaseProvider implements IMarketDataProvider {
  protected apiKey?: string;
  protected baseUrl: string;
  protected timeout: number = 30000;
  
  constructor(config: { apiKey?: string; baseUrl: string; timeout?: number }) {
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl;
    this.timeout = config.timeout ?? this.timeout;
  }
  
  abstract getMarketData(symbol: string, timeframe?: '1m' | '5m' | '15m' | '1d', count?: number): Promise<MarketData>;
  abstract getNews(symbol: string): Promise<NewsData>;
  abstract getWatchlist(): Promise<WatchlistData>;
  abstract getFundamentals(symbol: string): Promise<{ marketCap: number; float: number; avgVolume: number; peRatio?: number; eps?: number }>;
  abstract getMacroCalendar(start: Date, end: Date): Promise<Array<{ date: string; event: string; impact: 'LOW' | 'MEDIUM' | 'HIGH'; actual?: string; forecast?: string; previous?: string }>>;
  
  protected async fetchWithTimeout<T>(url: string, options?: RequestInit): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);
    
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json() as T;
    } finally {
      clearTimeout(timeoutId);
    }
  }
}
