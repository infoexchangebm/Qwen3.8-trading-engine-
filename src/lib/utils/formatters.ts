/**
 * Utility functions for formatting financial data
 */

/**
 * Format a number with thousands separators
 */
export function formatNumber(num: number, decimals: number = 0): string {
  return num.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/**
 * Format a percentage value
 */
export function formatPercent(value: number, decimals: number = 2): string {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(decimals)}%`;
}

/**
 * Format currency values
 */
export function formatCurrency(value: number, compact: boolean = false): string {
  if (compact && Math.abs(value) >= 1e9) {
    return `$${(value / 1e9).toFixed(2)}B`;
  }
  if (compact && Math.abs(value) >= 1e6) {
    return `$${(value / 1e6).toFixed(2)}M`;
  }
  return `$${formatNumber(value, 2)}`;
}

/**
 * Format price with appropriate decimal places
 */
export function formatPrice(price: number): string {
  if (price >= 1000) {
    return formatNumber(price, 2);
  } else if (price >= 100) {
    return formatNumber(price, 2);
  } else if (price >= 1) {
    return formatNumber(price, 2);
  } else {
    return formatNumber(price, 4);
  }
}

/**
 * Format a date for display
 */
export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Format a timestamp for display
 */
export function formatTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
}

/**
 * Calculate R multiple (risk-reward ratio achieved)
 */
export function calculateRAchieved(entry: number, exit: number, stop: number, direction: 'LONG' | 'SHORT'): number {
  const risk = Math.abs(entry - stop);
  const pnl = direction === 'LONG' ? exit - entry : entry - exit;
  return pnl / risk;
}

/**
 * Clamp a value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Check if market is open
 */
export function isMarketOpen(date: Date = new Date()): boolean {
  const day = date.getDay();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  
  // Weekend
  if (day === 0 || day === 6) return false;
  
  // Market hours: 9:30 AM - 4:00 PM ET
  const time = hours * 60 + minutes;
  return time >= 9 * 60 + 30 && time < 16 * 60;
}

/**
 * Get market status
 */
export function getMarketStatus(date: Date = new Date()): 'PRE_MARKET' | 'OPEN' | 'CLOSED' | 'AFTER_HOURS' {
  const day = date.getDay();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  
  // Weekend
  if (day === 0 || day === 6) return 'CLOSED';
  
  const time = hours * 60 + minutes;
  
  if (time < 9 * 60 + 30) return 'PRE_MARKET';
  if (time < 16 * 60) return 'OPEN';
  if (time < 20 * 60) return 'AFTER_HOURS';
  return 'CLOSED';
}
