"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUpdateTeamModel } from "../stores/use-update-team-model";
import { UpdateTeamForm } from "../components/form/update-team-form";
import { useEffect } from "react";

export const UpdateTeamModal = () => {
  const { isOpen, setIsOpen, teamId, setTeamId } = useUpdateTeamModel();

  useEffect(() => {
    return () => {
      if (teamId && isOpen) {
        setTeamId(null);
      }
    };
  }, [teamId, setTeamId, isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen} modal={true}>
      <DialogContent className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <DialogTitle>Update Team</DialogTitle>
        <DialogDescription>Update the team details.</DialogDescription>
        <UpdateTeamForm />
      </DialogContent>
    </Dialog>
  );
};
