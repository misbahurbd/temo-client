"use client";

import { Button } from "@/components/ui/button";
import { useCreateTeamModel } from "../stores/use-create-team-model";
import { PlusIcon } from "lucide-react";

export const CreateTeamButton = () => {
  const { setIsOpen } = useCreateTeamModel();

  return (
    <Button
      className="rounded-full cursor-pointer ml-auto"
      onClick={() => setIsOpen(true)}
    >
      <PlusIcon className="size-4" />
      Add Team
    </Button>
  );
};
