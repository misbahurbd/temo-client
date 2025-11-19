"use client";

import { Button } from "@/components/ui/button";

import { PlusIcon } from "lucide-react";
import { useCreateProjectModel } from "../stores/use-create-project-model";

export const CreateProjectButton = () => {
  const { setIsOpen } = useCreateProjectModel();

  return (
    <Button
      className="rounded-full cursor-pointer ml-auto"
      onClick={() => setIsOpen(true)}
    >
      <PlusIcon className="size-4" />
      Add Project
    </Button>
  );
};
