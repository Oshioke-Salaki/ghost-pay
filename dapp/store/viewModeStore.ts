import { create } from "zustand";
import { persist } from "zustand/middleware";

type ViewMode = "organization" | "personal";

interface ViewModeState {
  mode: ViewMode;
  isSwitching: boolean;
  setMode: (mode: ViewMode) => void;
  toggleMode: () => void;
}

export const useViewModeStore = create<ViewModeState>()(
  persist(
    (set, get) => ({
      mode: "organization",
      isSwitching: false,
      setMode: (mode) => {
        const current = get().mode;
        if (current === mode) return;
        set({ isSwitching: true });
        setTimeout(() => {
          set({ mode, isSwitching: false });
        }, 600);
      },
      toggleMode: () => {
        const current = get().mode;
        const next = current === "organization" ? "personal" : "organization";
        set({ isSwitching: true });
        setTimeout(() => {
          set({ mode: next, isSwitching: false });
        }, 600);
      },
    }),
    {
      name: "view-mode-storage",
      partialize: (state) => ({ mode: state.mode }), // Only persist mode, not isSwitching
    }
  )
);
