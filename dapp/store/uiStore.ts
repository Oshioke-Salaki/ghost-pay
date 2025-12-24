import { create } from "zustand";

interface UIState {
  hideAmounts: boolean;
  toggleHideAmounts: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  hideAmounts: false,
  toggleHideAmounts: () =>
    set((state) => ({ hideAmounts: !state.hideAmounts })),
}));
