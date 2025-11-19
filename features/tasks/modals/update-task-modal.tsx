"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUpdateTaskModel } from "../stores/use-update-task-modal";

import { useEffect } from "react";
import { UpdateTaskForm } from "../components/form/update-task-form";

export const UpdateTaskModal = () => {
  const { isOpen, setIsOpen, taskId, setTaskId } = useUpdateTaskModel();

  useEffect(() => {
    return () => {
      if (taskId && isOpen) {
        setTaskId(null);
      }
    };
  }, [taskId, setTaskId, isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen} modal={true}>
      <DialogContent className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <DialogTitle>Update Task</DialogTitle>
        <DialogDescription>Update the task details.</DialogDescription>
        <UpdateTaskForm />
      </DialogContent>
    </Dialog>
  );
};
