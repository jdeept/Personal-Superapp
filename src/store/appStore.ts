import { create } from 'zustand';

export type HubType = 'command-center' | 'finance' | 'trading' | 'productivity' | 'decision' | 'analytics' | 'knowledge';
export type TradingViewType = 'dashboard' | 'position-sizer' | 'journal' | 'import';

interface AppState {
  activeHub: HubType;
  setActiveHub: (hub: HubType) => void;
  
  // Trading Hub specific state
  activeTradingView: TradingViewType;
  setActiveTradingView: (view: TradingViewType) => void;
  // Mobile Sidebar state
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (isOpen: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  activeHub: 'command-center',
  setActiveHub: (hub) => set({ activeHub: hub, isMobileMenuOpen: false }),
  
  activeTradingView: 'dashboard',
  setActiveTradingView: (view) => set({ activeTradingView: view }),
  
  isMobileMenuOpen: false,
  setIsMobileMenuOpen: (isOpen) => set({ isMobileMenuOpen: isOpen })
}));
