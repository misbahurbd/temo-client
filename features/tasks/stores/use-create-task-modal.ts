import { create } from "zustand";

interface TaskModelState {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  projectId: string | null;
  setProjectId: (projectId: string | null) => void;
}

export const useCreateTaskModel = create<TaskModelState>()((set) => ({
  isOpen: false,
  setIsOpen: (open) => set({ isOpen: open }),
  projectId: null,
  setProjectId: (projectId) => set({ projectId }),
}));
