import { create } from "zustand";

interface AppState {
  isSearchOpen: boolean;
  setIsSearchOpen: (isOpen: boolean) => void;
}

const useStore = create<AppState>((set) => ({
  isSearchOpen: false,
  setIsSearchOpen: (isOpen: boolean) => set({ isSearchOpen: isOpen }),
}));

export default useStore;
