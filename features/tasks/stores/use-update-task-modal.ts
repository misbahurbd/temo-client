import { create } from "zustand";

interface TaskModelState {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  taskId: string | null;
  setTaskId: (taskId: string | null) => void;
}

export const useUpdateTaskModel = create<TaskModelState>()((set) => ({
  isOpen: false,
  setIsOpen: (open) => set({ isOpen: open }),
  taskId: null,
  setTaskId: (taskId) => set({ taskId }),
}));
