/**
 * Mock provider implementation for development and testing
 * Uses generated mock data - no API keys required
 */

import { BaseProvider } from './provider-interface';
import type { MarketData, NewsData, WatchlistData } from './provider-interface';
import {
  fetchMockWatchlist,
  fetchMockBars,
  fetchMockNews,
} from './mock-provider';

export class MockProvider extends BaseProvider {
  constructor() {
    super({ baseUrl: 'mock://localhost' });
  }

  async getMarketData(
    symbol: string,
    timeframe: '1m' | '5m' | '15m' | '1d' = '5m',
    count: number = 50
  ): Promise<MarketData> {
    const bars = await fetchMockBars(symbol, timeframe, count);
    const latestBar = bars[bars.length - 1];
    
    return {
      quote: {
        symbol,
        price: latestBar.close,
        change: latestBar.close - latestBar.open,
        changePercent: ((latestBar.close - latestBar.open) / latestBar.open) * 100,
        volume: latestBar.volume,
        timestamp: latestBar.timestamp,
      },
      bars,
    };
  }

  async getNews(symbol: string): Promise<NewsData> {
    const items = await fetchMockNews(symbol);
    return { items };
  }

  async getWatchlist(): Promise<WatchlistData> {
    const { entries, rejectedCandidates } = await fetchMockWatchlist();
    
    return {
      entries,
      rejectedCandidates,
      generatedAt: new Date().toISOString(),
      marketStatus: 'PRE_MARKET',
    };
  }

  async getFundamentals(symbol: string): Promise<{
    marketCap: number;
    float: number;
    avgVolume: number;
    peRatio?: number;
    eps?: number;
  }> {
    // Generate realistic mock fundamentals
    const marketCap = Math.floor(Math.random() * 500 + 10) * 1e9; // 10B - 510B
    const float = Math.floor(Math.random() * 400 + 10) * 1e6; // 10M - 410M
    const avgVolume = Math.floor(Math.random() * 20 + 1) * 1e6; // 1M - 21M
    
    return {
      marketCap,
      float,
      avgVolume,
      peRatio: Math.random() > 0.3 ? parseFloat((Math.random() * 80 + 5).toFixed(2)) : undefined,
      eps: Math.random() > 0.3 ? parseFloat((Math.random() * 10 - 2).toFixed(2)) : undefined,
    };
  }

  async getMacroCalendar(start: Date, end: Date): Promise<Array<{
    date: string;
    event: string;
    impact: 'LOW' | 'MEDIUM' | 'HIGH';
    actual?: string;
    forecast?: string;
    previous?: string;
  }>> {
    const events = [
      { event: 'CPI Release', impact: 'HIGH' as const },
      { event: 'Non-Farm Payrolls', impact: 'HIGH' as const },
      { event: 'FOMC Meeting', impact: 'HIGH' as const },
      { event: 'GDP Report', impact: 'MEDIUM' as const },
      { event: 'Retail Sales', impact: 'MEDIUM' as const },
      { event: 'ISM Manufacturing', impact: 'MEDIUM' as const },
      { event: 'Initial Jobless Claims', impact: 'LOW' as const },
    ];
    
    const daysBetween = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    const numEvents = Math.min(daysBetween, 5);
    
    return Array.from({ length: numEvents }, (_, i) => {
      const eventDate = new Date(start.getTime() + i * 24 * 60 * 60 * 1000);
      const event = events[i % events.length];
      
      return {
        date: eventDate.toISOString().split('T')[0],
        event: event.event,
        impact: event.impact,
        forecast: `${(Math.random() * 5 + 1).toFixed(1)}%`,
        previous: `${(Math.random() * 5 + 1).toFixed(1)}%`,
      };
    });
  }
}

/**
 * Singleton instance of the mock provider
 */
export const mockProvider = new MockProvider();
