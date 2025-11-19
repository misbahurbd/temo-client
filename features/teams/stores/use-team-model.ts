import { create } from "zustand";

interface TeamModelState {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export const useTeamModel = create<TeamModelState>()((set) => ({
  isOpen: false,
  setIsOpen: (open) => set({ isOpen: open }),
}));
