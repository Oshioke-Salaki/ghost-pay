import { create } from "zustand";

interface UIState {
  hideAmounts: boolean;
  toggleHideAmounts: () => void;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (isOpen: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  hideAmounts: false,
  toggleHideAmounts: () =>
    set((state) => ({ hideAmounts: !state.hideAmounts })),
  isSidebarOpen: false,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setSidebarOpen: (isOpen: boolean) => set({ isSidebarOpen: isOpen }),
}));
