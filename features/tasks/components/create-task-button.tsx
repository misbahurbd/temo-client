"use client";

import { Button } from "@/components/ui/button";

import { PlusIcon } from "lucide-react";
import { useCreateTaskModel } from "../stores/use-create-task-modal";

export const CreateTaskButton = () => {
  const { setIsOpen } = useCreateTaskModel();

  return (
    <Button
      className="rounded-full cursor-pointer ml-auto"
      onClick={() => setIsOpen(true)}
    >
      <PlusIcon className="size-4" />
      Add Task
    </Button>
  );
};
