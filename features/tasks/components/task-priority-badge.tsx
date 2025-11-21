import { cn } from "@/lib/utils";
import { TASK_PRIORITY } from "../constant";
import { Badge } from "@/components/ui/badge";

export const TaskPriorityBadge = ({ priority }: { priority: string }) => {
  const priorityLabel = TASK_PRIORITY.find((p) => p.value === priority)
    ?.label as string;

  if (!priorityLabel) {
    return (
      <Badge className="text-xs font-medium rounded-full px-2 py-0.5">Unknown</Badge>
    );
  }

  return (
    <Badge
      className={cn(
        "text-xs font-medium rounded-full px-2 py-0.5",
        priority === "LOW" && "bg-green-500 text-white",
        priority === "MEDIUM" && "bg-yellow-500 text-white",
        priority === "HIGH" && "bg-red-500 text-white"
      )}
    >
      {priorityLabel}
    </Badge>
  );
};
