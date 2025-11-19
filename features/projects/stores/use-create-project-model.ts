import { create } from "zustand";

interface ProjectModelState {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export const useCreateProjectModel = create<ProjectModelState>()((set) => ({
  isOpen: false,
  setIsOpen: (open) => set({ isOpen: open }),
}));
