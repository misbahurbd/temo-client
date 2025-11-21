"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TASK_STATUS } from "../constant";
import { TaskStatus } from "../types/task.type";
import { updateTask } from "../actions/update-task.action";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface TaskStatusSelectProps {
  taskId: string;
  currentStatus: TaskStatus;
  currentDueDate?: string;
}

export const TaskStatusSelect = ({
  taskId,
  currentStatus,
  currentDueDate,
}: TaskStatusSelectProps) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleStatusChange = (newStatus: string) => {
    if (newStatus === currentStatus) return;

    startTransition(async () => {
      const response = await updateTask(taskId, {
        status: newStatus as TaskStatus,
        dueDate: currentDueDate ? new Date(currentDueDate) : undefined,
      });

      if (response.success) {
        toast.success("Task status updated successfully");
        router.refresh();
      } else {
        toast.error(response.message || "Failed to update task status");
      }
    });
  };

  return (
    <Select
      value={currentStatus}
      onValueChange={handleStatusChange}
      disabled={isPending}
    >
      <SelectTrigger
        className={cn(
          "test-sm! px-2.5! py-1.5! h-auto! [&_svg]:opacity-100 font-medium w-fit",
          currentStatus === "PENDING" &&
            "border-blue-500 bg-blue-500 text-white [&_svg]:text-white!",
          currentStatus === "IN_PROGRESS" &&
            "border-yellow-500 bg-yellow-500 text-white [&_svg]:text-white!",
          currentStatus === "DONE" &&
            "border-green-500 bg-green-500 text-white [&_svg]:text-white!",
          isPending && "opacity-50"
        )}
      >
        {isPending ? (
          <Loader2 className="h-3 w-3 animate-spin" />
        ) : (
          <SelectValue>
            {
              TASK_STATUS.find(
                (status: { value: string; label: string }) =>
                  status.value === currentStatus
              )?.label
            }
          </SelectValue>
        )}
      </SelectTrigger>
      <SelectContent align="end">
        {TASK_STATUS.map((status: { value: string; label: string }) => (
          <SelectItem key={status.value} value={status.value}>
            {status.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
