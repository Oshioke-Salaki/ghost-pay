import { create } from "zustand";

interface UIState {
  hideAmounts: boolean;
  toggleHideAmounts: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  hideAmounts: true,
  toggleHideAmounts: () =>
    set((state) => ({ hideAmounts: !state.hideAmounts })),
}));
