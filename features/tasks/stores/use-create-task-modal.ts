import { create } from "zustand";

interface TaskModelState {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export const useCreateTaskModel = create<TaskModelState>()((set) => ({
  isOpen: false,
  setIsOpen: (open) => set({ isOpen: open }),
}));
