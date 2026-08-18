'use client';

import { useWatchlist } from '@/lib/hooks/use-market-data';
import { formatCurrency, formatNumber, formatPercent } from '@/lib/utils/formatters';
import type { WatchlistEntry } from '@/lib/contracts';

// Simple UI components
function Badge({ children, variant = 'default' }: { children: React.ReactNode; variant?: 'default' | 'success' | 'danger' | 'warning' }) {
  const variants = {
    default: 'bg-neutral-800 text-neutral-300',
    success: 'bg-green-900/30 text-green-400',
    danger: 'bg-red-900/30 text-red-400',
    warning: 'bg-yellow-900/30 text-yellow-400',
  };
  
  return (
    <span className={`px-2 py-0.5 text-xs rounded ${variants[variant]}`}>
      {children}
    </span>
  );
}

function ConvictionScore({ score }: { score: number }) {
  const getColor = (s: number) => {
    if (s >= 70) return 'text-green-400';
    if (s >= 40) return 'text-yellow-400';
    return 'text-red-400';
  };
  
  return (
    <span className={`font-bold tabular-nums ${getColor(score)}`}>
      {score.toFixed(0)}
    </span>
  );
}

function DirectionBadge({ direction }: { direction: 'LONG' | 'SHORT' }) {
  return (
    <Badge variant={direction === 'LONG' ? 'success' : 'danger'}>
      {direction}
    </Badge>
  );
}

function RiskFlagBadge({ type }: { type: string }) {
  const shortLabel = type.replace(/_/g, ' ').split(' ')[0];
  return (
    <span className="px-1.5 py-0.5 text-[10px] bg-red-900/20 text-red-400 rounded border border-red-900/30">
      {shortLabel}
    </span>
  );
}

function WatchlistRow({ entry, onClick }: { entry: WatchlistEntry; onClick: () => void }) {
  return (
    <tr 
      className="table-row-hover border-b border-console cursor-pointer transition-colors"
      onClick={onClick}
    >
      {/* Symbol & Sector */}
      <td className="p-3">
        <div className="font-bold text-white">{entry.symbol}</div>
        <div className="text-xs text-muted">{entry.sector || 'N/A'}</div>
      </td>
      
      {/* Direction */}
      <td className="p-3">
        <DirectionBadge direction={entry.direction} />
      </td>
      
      {/* Conviction Score */}
      <td className="p-3 text-center">
        <ConvictionScore score={entry.convictionScore.total} />
      </td>
      
      {/* Price Action */}
      <td className="p-3 tabular-nums">
        <div className={entry.quote.changePercent >= 0 ? 'text-pnl-up' : 'text-pnl-down'}>
          {formatPercent(entry.quote.changePercent)}
        </div>
        <div className="text-xs text-muted">
          RVOL: {entry.relativeVolume.toFixed(2)}x
        </div>
      </td>
      
      {/* Pre-Market */}
      <td className="p-3 tabular-nums">
        <div className={entry.preMarketChangePercent >= 0 ? 'text-pnl-up' : 'text-pnl-down'}>
          {formatPercent(entry.preMarketChangePercent)}
        </div>
      </td>
      
      {/* ATR */}
      <td className="p-3 tabular-nums text-right">
        <div>{entry.atr14.toFixed(2)}</div>
        <div className="text-xs text-muted">{formatPercent(entry.atrPercent)}</div>
      </td>
      
      {/* Catalyst */}
      <td className="p-3 max-w-[200px]">
        <div className="truncate text-sm">
          {entry.catalyst?.description || entry.topNewsHeadlines[0]?.title || 'No catalyst'}
        </div>
        {entry.catalyst && (
          <div className="text-xs text-muted mt-1">
            {entry.catalyst.type.replace(/_/g, ' ')}
          </div>
        )}
      </td>
      
      {/* Key Levels */}
      <td className="p-3 tabular-nums text-xs">
        <div className="space-y-0.5">
          {entry.levels.slice(0, 3).map((level, i) => (
            <div key={i} className="flex justify-between gap-2">
              <span className="text-muted">{level.type.replace(/_/g, '').slice(0, 3)}</span>
              <span>{level.price.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </td>
      
      {/* Entry Trigger */}
      <td className="p-3 max-w-[150px]">
        <div className="truncate text-xs" title={entry.entryTrigger}>
          {entry.entryTrigger}
        </div>
      </td>
      
      {/* Stop Loss */}
      <td className="p-3 tabular-nums">
        <div className="text-red-400">{entry.stopLoss.price.toFixed(2)}</div>
        <div className="text-[10px] text-muted truncate max-w-[100px]">
          {entry.stopLoss.reason}
        </div>
      </td>
      
      {/* Targets */}
      <td className="p-3 tabular-nums">
        <div className="text-green-400">T1: {entry.targets[0]?.price.toFixed(2)}</div>
        {entry.targets[1] && (
          <div className="text-green-400/70 text-xs">T2: {entry.targets[1].price.toFixed(2)}</div>
        )}
      </td>
      
      {/* R:R */}
      <td className="p-3 text-center tabular-nums">
        <span className={entry.expectedRR >= 3 ? 'text-green-400' : entry.expectedRR >= 2 ? 'text-yellow-400' : 'text-red-400'}>
          {entry.expectedRR.toFixed(2)}R
        </span>
      </td>
      
      {/* Position Size */}
      <td className="p-3 tabular-nums text-right">
        <div>{formatNumber(entry.positionSize.shares)} sh</div>
        <div className="text-xs text-muted">${formatNumber(entry.positionSize.notional)}</div>
      </td>
      
      {/* Risk Flags */}
      <td className="p-3">
        <div className="flex gap-1 flex-wrap">
          {entry.riskFlags.slice(0, 3).map((flag, i) => (
            <RiskFlagBadge key={i} type={flag.type} />
          ))}
          {entry.riskFlags.length > 3 && (
            <span className="text-xs text-muted">+{entry.riskFlags.length - 3}</span>
          )}
        </div>
      </td>
      
      {/* Setup Type */}
      <td className="p-3">
        <Badge>{entry.setupType.replace(/_/g, ' ')}</Badge>
      </td>
    </tr>
  );
}

export function WatchlistTable() {
  const { data, isLoading, error } = useWatchlist();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted">Loading watchlist...</div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-400">Error loading watchlist: {(error as Error).message}</div>
      </div>
    );
  }
  
  if (!data || data.entries.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted">No setups found for today</div>
      </div>
    );
  }
  
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-console text-muted text-xs uppercase tracking-wider">
            <th className="p-3 text-left">Symbol</th>
            <th className="p-3 text-left">Dir</th>
            <th className="p-3 text-center">Score</th>
            <th className="p-3 text-left">Move</th>
            <th className="p-3 text-left">Pre-Mkt</th>
            <th className="p-3 text-right">ATR</th>
            <th className="p-3 text-left">Catalyst</th>
            <th className="p-3 text-left">Levels</th>
            <th className="p-3 text-left">Entry Trigger</th>
            <th className="p-3 text-left">Stop</th>
            <th className="p-3 text-left">Targets</th>
            <th className="p-3 text-center">R:R</th>
            <th className="p-3 text-right">Position</th>
            <th className="p-3 text-left">Flags</th>
            <th className="p-3 text-left">Setup</th>
          </tr>
        </thead>
        <tbody>
          {data.entries.map((entry) => (
            <WatchlistRow 
              key={entry.id} 
              entry={entry} 
              onClick={() => console.log('Clicked:', entry.symbol)}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
