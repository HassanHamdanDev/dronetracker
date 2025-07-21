import { create } from "zustand";

interface UIState {
    sidebarOpen: boolean;
    activePanel: 'map' | 'dashboard';
    toggleSidebar: () => void;
    setActivePanel: (panel: 'map' | 'dashboard') => void;
}

export const useUIStore = create<UIState>((set) => ({
    sidebarOpen: true,
    activePanel: 'map',
    toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
    setActivePanel: (panel) => set({ activePanel: panel }),
}));