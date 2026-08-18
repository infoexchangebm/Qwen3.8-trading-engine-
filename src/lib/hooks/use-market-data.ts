/**
 * TanStack Query hooks for data fetching
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { defaultProvider } from '@/lib/providers';
import type { WatchlistData } from '@/lib/providers/provider-interface';

const QUERY_KEYS = {
  watchlist: {
    all: ['watchlist'] as const,
    lists: () => [...QUERY_KEYS.watchlist.all, 'list'] as const,
    list: () => [...QUERY_KEYS.watchlist.lists(), 'current'] as const,
  },
  marketData: {
    all: ['marketData'] as const,
    detail: (symbol: string) => [...QUERY_KEYS.marketData.all, symbol] as const,
    bars: (symbol: string, timeframe: string) => [...QUERY_KEYS.marketData.detail(symbol), 'bars', timeframe] as const,
  },
  news: {
    all: ['news'] as const,
    bySymbol: (symbol: string) => [...QUERY_KEYS.news.all, symbol] as const,
  },
  fundamentals: {
    all: ['fundamentals'] as const,
    bySymbol: (symbol: string) => [...QUERY_KEYS.fundamentals.all, symbol] as const,
  },
};

/**
 * Hook to fetch the daily watchlist
 */
export function useWatchlist() {
  return useQuery<WatchlistData>({
    queryKey: QUERY_KEYS.watchlist.list(),
    queryFn: () => defaultProvider.getWatchlist(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 60 * 1000, // Refetch every minute when active
  });
}

/**
 * Hook to fetch market data for a symbol
 */
export function useMarketData(symbol: string, timeframe: '1m' | '5m' | '15m' | '1d' = '5m') {
  return useQuery({
    queryKey: QUERY_KEYS.marketData.bars(symbol, timeframe),
    queryFn: () => defaultProvider.getMarketData(symbol, timeframe),
    enabled: !!symbol,
    staleTime: 30 * 1000, // 30 seconds
  });
}

/**
 * Hook to fetch news for a symbol
 */
export function useNews(symbol: string) {
  return useQuery({
    queryKey: QUERY_KEYS.news.bySymbol(symbol),
    queryFn: () => defaultProvider.getNews(symbol),
    enabled: !!symbol,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to fetch fundamentals for a symbol
 */
export function useFundamentals(symbol: string) {
  return useQuery({
    queryKey: QUERY_KEYS.fundamentals.bySymbol(symbol),
    queryFn: () => defaultProvider.getFundamentals(symbol),
    enabled: !!symbol,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

export { QUERY_KEYS };
