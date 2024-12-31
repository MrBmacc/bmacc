import { create } from "zustand";

interface AppState {
  isSearchOpen: boolean;
  hasEthForGas: boolean;
  setIsSearchOpen: (isOpen: boolean) => void;
  setHasEthForGas: (hasEth: boolean) => void;
}

const useStore = create<AppState>((set) => ({
  isSearchOpen: false,
  hasEthForGas: false,
  setIsSearchOpen: (isOpen: boolean) => set({ isSearchOpen: isOpen }),
  setHasEthForGas: (hasEth: boolean) => set({ hasEthForGas: hasEth }),
}));

export default useStore;
