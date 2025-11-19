"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCreateTaskModel } from "../stores/use-create-task-modal";
import { CreateTaskForm } from "../components/form/create-task-form";
import { useEffect } from "react";

export const CreateTaskModal = () => {
  const { isOpen, setIsOpen, setProjectId, projectId } = useCreateTaskModel();

  // useEffect(() => {
  //   return () => {
  //     if (projectId && isOpen) {
  //       setProjectId(null);
  //     }
  //   };
  // }, [isOpen, setProjectId, projectId]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen} modal={true}>
      <DialogContent className="w-full max-w-xl! max-h-[90vh] overflow-y-auto">
        <DialogTitle>Create Task</DialogTitle>
        <DialogDescription>
          Create a new task to manage your projects and resources.
        </DialogDescription>
        <CreateTaskForm />
      </DialogContent>
    </Dialog>
  );
};
