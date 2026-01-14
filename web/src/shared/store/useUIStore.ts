import { create } from 'zustand';

type TabType = 'DIALER' | 'CONTACTS' | 'STATS' | 'SETTINGS' | 'MONITOR';

interface UIState {
    activeTab: TabType;
    setActiveTab: (tab: TabType) => void;
}

export const useUIStore = create<UIState>((set) => ({
    activeTab: 'DIALER',
    setActiveTab: (tab) => set({ activeTab: tab }),
}));
