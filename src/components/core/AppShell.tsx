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

import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AppShell() {
  const { activeHub, isMobileMenuOpen, setIsMobileMenuOpen } = useAppStore();

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
      {/* Sidebar (Responsive overlay on mobile, fixed on desktop) */}
      <Sidebar />
      
      {/* Main content area */}
      <div className="flex-1 flex flex-col md:ml-64 w-full min-h-screen">
        
        {/* Mobile Top Bar */}
        <header className="md:hidden flex items-center justify-between p-4 border-b border-white/10 bg-black sticky top-0 z-30">
          <h1 className="font-bold text-lg tracking-widest uppercase">Personal OS</h1>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-white"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </Button>
        </header>

        <main className="flex-1 p-4 md:p-8 overflow-x-hidden">
          {renderActiveHub()}
        </main>
      </div>
    </div>
  );
}
