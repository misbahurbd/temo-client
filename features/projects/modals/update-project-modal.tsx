"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUpdateProjectModel } from "../stores/use-update-project-model";
import { UpdateProjectForm } from "../components/form/update-project-form";
import { useEffect } from "react";

export const UpdateProjectModal = () => {
  const { isOpen, setIsOpen, projectId, setProjectId } =
    useUpdateProjectModel();

  useEffect(() => {
    return () => {
      if (projectId && isOpen) {
        setProjectId(null);
      }
    };
  }, [projectId, setProjectId, isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen} modal={true}>
      <DialogContent className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <DialogTitle>Update Project</DialogTitle>
        <DialogDescription>Update the project details.</DialogDescription>
        <UpdateProjectForm />
      </DialogContent>
    </Dialog>
  );
};
