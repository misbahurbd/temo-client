"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TASK_PRIORITY } from "../constant";
import { TaskPriority } from "../types/task.type";
import { updateTask } from "../actions/update-task.action";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface TaskPrioritySelectProps {
  taskId: string;
  currentPriority: TaskPriority;
  currentDueDate?: string;
}

export const TaskPrioritySelect = ({
  taskId,
  currentPriority,
  currentDueDate,
}: TaskPrioritySelectProps) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handlePriorityChange = (newPriority: string) => {
    if (newPriority === currentPriority) return;

    startTransition(async () => {
      const response = await updateTask(taskId, {
        priority: newPriority as TaskPriority,
        dueDate: currentDueDate ? new Date(currentDueDate) : undefined,
      });

      if (response.success) {
        toast.success("Task priority updated successfully");
        router.refresh();
      } else {
        toast.error(response.message || "Failed to update task priority");
      }
    });
  };

  return (
    <Select
      value={currentPriority}
      onValueChange={handlePriorityChange}
      disabled={isPending}
    >
      <SelectTrigger
        className={cn(
          "test-sm! px-2.5! py-1.5! h-auto! [&_svg]:opacity-100 font-medium w-fit",
          currentPriority === "LOW" &&
            "border-green-500 bg-green-500 text-white [&_svg]:text-white!",
          currentPriority === "MEDIUM" &&
            "border-yellow-500 bg-yellow-500 text-white [&_svg]:text-white!",
          currentPriority === "HIGH" &&
            "border-red-500 bg-red-500 text-white [&_svg]:text-white!",
          isPending && "opacity-50"
        )}
      >
        {isPending ? (
          <Loader2 className="h-3 w-3 animate-spin" />
        ) : (
          <SelectValue>
            {
              TASK_PRIORITY.find(
                (priority: { value: string; label: string }) =>
                  priority.value === currentPriority
              )?.label
            }
          </SelectValue>
        )}
      </SelectTrigger>
      <SelectContent align="end">
        {TASK_PRIORITY.map((priority: { value: string; label: string }) => (
          <SelectItem key={priority.value} value={priority.value}>
            {priority.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
