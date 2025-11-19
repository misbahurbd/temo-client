"use client";

import { Button } from "@/components/ui/button";

import { LoaderCircleIcon, PlusIcon, SparklesIcon } from "lucide-react";
import { useCreateTaskModel } from "../stores/use-create-task-modal";
import { useTransition } from "react";
import { reassignTasks } from "../actions/reassign-tasks.action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const TaskActionButtons = ({ projectId }: { projectId: string }) => {
  const { setIsOpen, setProjectId } = useCreateTaskModel();
  const [isReassigning, startReassigning] = useTransition();
  const router = useRouter();

  const onReassignTasks = () => {
    startReassigning(async () => {
      const response = await reassignTasks(projectId);
      if (response.success) {
        toast.success(response.message || "Tasks reassigned successfully");
        router.refresh();
      } else {
        toast.error(response.message || "An error occurred");
      }
    });
  };

  return (
    <div className="flex items-center gap-3 ml-auto">
      <Button
        variant="outline"
        className="rounded-full cursor-pointer "
        onClick={() => onReassignTasks()}
        disabled={isReassigning}
      >
        {isReassigning ? (
          <LoaderCircleIcon className="size-4 animate-spin" />
        ) : (
          <SparklesIcon className="size-4" />
        )}
        Reassign Tasks
      </Button>

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
