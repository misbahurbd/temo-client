"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCreateTeamModel } from "../stores/use-create-team-model";
import { CreateTeamForm } from "../components/form/create-team-form";

export const CreateTeamModal = () => {
  const { isOpen, setIsOpen } = useCreateTeamModel();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen} modal={true}>
      <DialogContent className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <DialogTitle>Create Team</DialogTitle>
        <DialogDescription>
          Create a new team to manage your projects and resources.
        </DialogDescription>
        <CreateTeamForm />
      </DialogContent>
    </Dialog>
  );
};
