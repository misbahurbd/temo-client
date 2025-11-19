import { create } from "zustand";

interface TeamModelState {
  teamId: string | null;
  setTeamId: (teamId: string | null) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export const useUpdateTeamModel = create<TeamModelState>()((set) => ({
  teamId: null,
  setTeamId: (teamId) => set({ teamId }),
  isOpen: false,
  setIsOpen: (open) => set({ isOpen: open }),
}));
