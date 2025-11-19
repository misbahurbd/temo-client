import { create } from "zustand";

interface ProjectModelState {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  refreshTrigger: number;
  triggerRefresh: () => void;
}

export const useCreateProjectModel = create<ProjectModelState>()((set) => ({
  isOpen: false,
  setIsOpen: (open) => set({ isOpen: open }),
  refreshTrigger: 0,
  triggerRefresh: () =>
    set((state) => ({ refreshTrigger: state.refreshTrigger + 1 })),
}));
