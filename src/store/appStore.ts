import { create } from 'zustand';

export type HubType = 'command-center' | 'finance' | 'trading' | 'productivity' | 'decision' | 'analytics' | 'knowledge';
export type TradingViewType = 'dashboard' | 'position-sizer' | 'journal' | 'import';

interface AppState {
  activeHub: HubType;
  setActiveHub: (hub: HubType) => void;
  
  // Trading Hub specific state
  activeTradingView: TradingViewType;
  setActiveTradingView: (view: TradingViewType) => void;
  
  // Command Center state mocks
  netWorth: number;
  cashAvailable: number;
  todayRiskBudget: number;
  
  // To-do toggle action (mock)
  toggleTodo: (id: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  activeHub: 'command-center',
  setActiveHub: (hub) => set({ activeHub: hub }),
  
  activeTradingView: 'dashboard',
  setActiveTradingView: (view) => set({ activeTradingView: view }),
  
  netWorth: 125430.50,
  cashAvailable: 15000.00,
  todayRiskBudget: 250.00,
  
  toggleTodo: (id) => set((state) => {
    // We'd actually update a list here, but this is a placeholder
    return state;
  })
}));
