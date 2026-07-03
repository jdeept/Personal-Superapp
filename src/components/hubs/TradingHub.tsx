"use client";

import { useAppStore, TradingViewType } from "@/store/appStore";
import { PreFlightRiskMatrix } from "@/components/trading/PreFlightRiskMatrix";
import { TradeJournal } from "@/components/trading/TradeJournal";
import { CsvImport } from "@/components/trading/CsvImport";
import { TradingAnalytics } from "@/components/trading/TradingAnalytics";

export function TradingHub() {
  const { activeTradingView, setActiveTradingView } = useAppStore();

  const renderView = () => {
    switch (activeTradingView) {
      case 'position-sizer':
        return <PreFlightRiskMatrix />;
      case 'dashboard':
        return <TradingAnalytics />;
      case 'journal':
        return <TradeJournal />;
      case 'import':
        return <CsvImport />;
      default:
        return null;
    }
  };

  const navItems: { id: TradingViewType; label: string }[] = [
    { id: 'dashboard', label: 'Analytics' },
    { id: 'position-sizer', label: 'Position Sizer' },
    { id: 'journal', label: 'Trade Journal' },
    { id: 'import', label: 'CSV Import' },
  ];

  return (
    <div className="animate-in fade-in duration-500">
      
      {/* Sub Navigation */}
      <div className="flex space-x-2 border-b border-white/20 pb-4 mb-8 overflow-x-auto whitespace-nowrap hide-scrollbar">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTradingView(item.id)}
            className={`px-4 py-2 rounded-md text-sm font-bold uppercase tracking-widest transition-colors ${
              activeTradingView === item.id 
                ? "bg-white text-black" 
                : "text-gray-400 hover:bg-white/10 hover:text-white"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {renderView()}

    </div>
  );
}
