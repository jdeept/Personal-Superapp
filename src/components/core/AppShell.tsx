"use client";

import { useAppStore } from "@/store/appStore";
import { Sidebar } from "@/components/core/Sidebar";
import { CommandCenter } from "@/components/core/CommandCenter";
import { TradingHub } from "@/components/hubs/TradingHub";
import { FinanceHub } from "@/components/hubs/FinanceHub";
import { ProductivityHub } from "@/components/hubs/ProductivityHub";
import { DecisionHub } from "@/components/hubs/DecisionHub";
import { AnalyticsHub } from "@/components/hubs/AnalyticsHub";
import { KnowledgeHub } from "@/components/hubs/KnowledgeHub";

export function AppShell() {
  const { activeHub } = useAppStore();

  const renderActiveHub = () => {
    switch (activeHub) {
      case 'command-center':
        return <CommandCenter />;
      case 'finance':
        return <FinanceHub />;
      case 'trading':
        return <TradingHub />;
      case 'productivity':
        return <ProductivityHub />;
      case 'decision':
        return <DecisionHub />;
      case 'analytics':
        return <AnalyticsHub />;
      case 'knowledge':
        return <KnowledgeHub />;
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-black text-white">
      {/* Sidebar fixed on the left */}
      <Sidebar />
      
      {/* Main content area offset by sidebar width (w-64 = 16rem = 256px) */}
      <main className="flex-1 ml-64 p-8">
        {renderActiveHub()}
      </main>
    </div>
  );
}
