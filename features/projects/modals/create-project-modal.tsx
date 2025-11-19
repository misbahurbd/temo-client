"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCreateProjectModel } from "../stores/use-create-project-model";
import { CreateProjectForm } from "../components/form/create-project-form";

export const CreateProjectModal = () => {
  const { isOpen, setIsOpen } = useCreateProjectModel();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen} modal={true}>
      <DialogContent className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <DialogTitle>Create Project</DialogTitle>
        <DialogDescription>
          Create a new project to manage your tasks and resources.
        </DialogDescription>
        <CreateProjectForm />
      </DialogContent>
    </Dialog>
  );
};
