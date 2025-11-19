"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontalIcon, PencilIcon, TrashIcon } from "lucide-react";
import { useUpdateTaskModel } from "../stores/use-update-task-modal";
import { useState } from "react";
import { DeleteTaskModal } from "../modals/delete-task-modal";

export const TaskTableAction = ({ id }: { id: string }) => {
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
  const { setTaskId, setIsOpen } = useUpdateTaskModel();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreHorizontalIcon className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-36" align="end" side="bottom">
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => {
            setTaskId(id);
            setIsOpen(true);
          }}
        >
          <PencilIcon className="size-4" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => {
            setIsDeleteOpen(true);
          }}
        >
          <TrashIcon className="size-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
      <DeleteTaskModal
        taskId={id}
        isOpen={isDeleteOpen}
        setIsOpen={setIsDeleteOpen}
      />
    </DropdownMenu>
  );
};
