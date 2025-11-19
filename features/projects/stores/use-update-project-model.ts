import { create } from "zustand";

interface ProjectModelState {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  projectId: string | null;
  setProjectId: (projectId: string | null) => void;
}

export const useUpdateProjectModel = create<ProjectModelState>()((set) => ({
  isOpen: false,
  setIsOpen: (open) => set({ isOpen: open }),
  projectId: null,
  setProjectId: (projectId) => set({ projectId }),
}));
