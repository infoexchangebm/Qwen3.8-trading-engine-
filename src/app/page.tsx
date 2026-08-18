import { WatchlistTable } from '@/components/watchlist/watchlist-table';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-console">
      {/* Header */}
      <header className="border-b border-console bg-console-elevated">
        <div className="max-w-[1920px] mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-white">Qwen3.8 Trading Engine</h1>
              <p className="text-xs text-muted mt-1">Daily Watchlist • {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-xs text-muted">Market Status</div>
                <div className="text-sm font-bold text-green-400">PRE-MARKET</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1920px] mx-auto px-4 py-6">
        <WatchlistTable />
      </main>
    </div>
  );
}
