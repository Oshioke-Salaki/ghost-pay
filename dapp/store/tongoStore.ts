import { create } from "zustand";
import { Account as TongoAccount } from "@fatsolutions/tongo-sdk";

interface TongoStoreState {
  tongoAccounts: Record<string, TongoAccount>;
  conversionRates: Record<string, bigint>;
  isInitializing: boolean;

  setTongoAccounts: (accounts: Record<string, TongoAccount>) => void;
  setConversionRates: (rates: Record<string, bigint>) => void;
  setIsInitializing: (loading: boolean) => void;
  reset: () => void;
}

export const useTongoStore = create<TongoStoreState>((set) => ({
  tongoAccounts: {},
  conversionRates: {},
  isInitializing: false,

  setTongoAccounts: (accounts) => set({ tongoAccounts: accounts }),
  setConversionRates: (rates) => set({ conversionRates: rates }),
  setIsInitializing: (loading) => set({ isInitializing: loading }),
  reset: () =>
    set({ tongoAccounts: {}, conversionRates: {}, isInitializing: false }),
}));
