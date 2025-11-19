"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EyeIcon, MoreHorizontalIcon, PencilIcon } from "lucide-react";
import { useUpdateProjectModel } from "../stores/use-update-project-model";
import Link from "next/link";

export const ProjectTableAction = ({ id }: { id: string }) => {
  const { setProjectId, setIsOpen } = useUpdateProjectModel();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreHorizontalIcon className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-36" align="end" side="bottom">
        <DropdownMenuItem className="cursor-pointer" asChild>
          <Link href={`/projects/${id}`}>
            <EyeIcon className="size-4" />
            View Tasks
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => {
            setProjectId(id);
            setIsOpen(true);
          }}
        >
          <PencilIcon className="size-4" />
          Edit
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
