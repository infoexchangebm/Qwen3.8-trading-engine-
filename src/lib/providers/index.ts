/**
 * Provider registry and factory
 * Selects the appropriate provider based on configuration
 */

import type { IMarketDataProvider } from './provider-interface';
import { MockProvider } from './mock-provider-impl';

export type ProviderType = 'mock' | 'polygon' | 'alpaca' | 'custom';

export interface ProviderConfig {
  type: ProviderType;
  apiKey?: string;
  baseUrl?: string;
  timeout?: number;
}

/**
 * Factory function to create a market data provider
 */
export function createProvider(config?: ProviderConfig): IMarketDataProvider {
  const providerType = config?.type ?? 'mock';
  
  switch (providerType) {
    case 'mock':
      return new MockProvider();
    
    case 'polygon':
      // TODO: Implement Polygon provider
      // return new PolygonProvider({ apiKey: config?.apiKey });
      console.warn('Polygon provider not yet implemented, falling back to mock');
      return new MockProvider();
    
    case 'alpaca':
      // TODO: Implement Alpaca provider
      // return new AlpacaProvider({ apiKey: config?.apiKey });
      console.warn('Alpaca provider not yet implemented, falling back to mock');
      return new MockProvider();
    
    case 'custom':
      // TODO: Allow custom provider registration
      console.warn('Custom provider not configured, falling back to mock');
      return new MockProvider();
    
    default:
      console.warn(`Unknown provider type "${providerType}", falling back to mock`);
      return new MockProvider();
  }
}

/**
 * Get the current provider based on environment variables
 */
export function getProviderFromEnv(): IMarketDataProvider {
  const providerType = (process.env.NEXT_PUBLIC_DATA_PROVIDER as ProviderType) || 'mock';
  const apiKey = process.env.DATA_API_KEY;
  const baseUrl = process.env.DATA_API_BASE_URL;
  const timeout = process.env.DATA_API_TIMEOUT 
    ? parseInt(process.env.DATA_API_TIMEOUT, 10) 
    : undefined;
  
  return createProvider({
    type: providerType,
    apiKey,
    baseUrl,
    timeout,
  });
}

/**
 * Default provider instance
 */
export const defaultProvider = getProviderFromEnv();
