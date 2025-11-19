"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontalIcon, PencilIcon, TrashIcon } from "lucide-react";
import { useUpdateTeamModel } from "../stores/use-update-team-model";
import { useState } from "react";
import { DeleteTeamModal } from "../modals/delete-team-modal";

export const TeamTableAction = ({ id }: { id: string }) => {
  const { setTeamId, setIsOpen } = useUpdateTeamModel();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

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
            setTeamId(id);
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
      <DeleteTeamModal
        teamId={id}
        isOpen={isDeleteOpen}
        setIsOpen={setIsDeleteOpen}
      />
    </DropdownMenu>
  );
};
