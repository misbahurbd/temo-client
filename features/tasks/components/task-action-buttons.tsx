"use client";

import { Button } from "@/components/ui/button";

import { PlusIcon } from "lucide-react";
import { useCreateTaskModel } from "../stores/use-create-task-modal";
import { useTransition } from "react";
import { reassignProjectTasks } from "../actions/reassign-tasks.action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { ReassignButton } from "@/components/shared/reassign-button";

export const TaskActionButtons = ({
  projectId,
  overloadedMemberCount,
}: {
  projectId: string;
  overloadedMemberCount: number;
}) => {
  const queryClient = useQueryClient();
  const { setIsOpen, setProjectId } = useCreateTaskModel();
  const [isReassigning, startReassigning] = useTransition();
  const router = useRouter();

  const onReassignTasks = () => {
    startReassigning(async () => {
      const response = await reassignProjectTasks(projectId);
      if (response.success) {
        toast.success(response.message || "Tasks reassigned successfully");
        router.refresh();
        queryClient.invalidateQueries({
          queryKey: ["overloaded-member-count"],
        });
        queryClient.invalidateQueries({
          queryKey: ["team-select-list"],
        });
      } else {
        toast.error(response.message || "An error occurred");
      }
    });
  };

  return (
    <div className="flex items-center gap-3 ml-auto">
      <ReassignButton
        onClick={() => onReassignTasks()}
        isLoading={isReassigning}
        disabled={overloadedMemberCount === 0 || isReassigning}
        taskCount={overloadedMemberCount || 0}
      />

      <Button
        className="rounded-full cursor-pointer"
        onClick={() => {
          setProjectId(projectId);
          setIsOpen(true);
        }}
        disabled={isReassigning}
      >
        <PlusIcon className="size-4" />
        Add Task
      </Button>
    </div>
  );
};
