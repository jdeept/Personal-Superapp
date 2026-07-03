"use client";

import { useAppStore, HubType } from "@/store/appStore";
import { 
  Home, 
  Wallet, 
  LineChart, 
  CheckSquare, 
  Lightbulb, 
  BarChart2, 
  BookOpen 
} from "lucide-react";
import { cn } from "@/lib/utils";

const HUBS: { id: HubType; label: string; icon: React.FC<{className?: string}> }[] = [
  { id: 'command-center', label: 'Command Center', icon: Home },
  { id: 'finance', label: 'Finance Hub', icon: Wallet },
  { id: 'trading', label: 'Trading Hub', icon: LineChart },
  { id: 'productivity', label: 'Productivity Hub', icon: CheckSquare },
  { id: 'decision', label: 'Decision Hub', icon: Lightbulb },
  { id: 'analytics', label: 'Analytics Hub', icon: BarChart2 },
  { id: 'knowledge', label: 'Knowledge Hub', icon: BookOpen },
];

export function Sidebar() {
  const { activeHub, setActiveHub } = useAppStore();

  return (
    <aside className="w-64 bg-black border-r border-white/10 h-screen flex flex-col fixed left-0 top-0 text-white">
      <div className="p-6">
        <h1 className="font-bold text-xl tracking-widest uppercase">Personal OS</h1>
      </div>
      
      <nav className="flex-1 px-4 py-4 space-y-2">
        {HUBS.map((hub) => {
          const Icon = hub.icon;
          const isActive = activeHub === hub.id;
          
          return (
            <button
              key={hub.id}
              onClick={() => setActiveHub(hub.id)}
              className={cn(
                "w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors text-left",
                isActive 
                  ? "bg-white text-black" 
                  : "text-gray-400 hover:bg-white/10 hover:text-white"
              )}
            >
              <Icon className="w-5 h-5" />
              <span>{hub.label}</span>
            </button>
          )
        })}
      </nav>
      
      <div className="p-6 border-t border-white/10 text-xs text-gray-500 uppercase tracking-widest">
        Version 1.0.0
      </div>
    </aside>
  );
}
