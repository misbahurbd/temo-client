import { cn } from "@/lib/utils";
import { TASK_STATUS } from "../constant";
import { Badge } from "@/components/ui/badge";

export const TaskStatusBadge = ({ status }: { status: string }) => {
  const statusLabel = TASK_STATUS.find((s) => s.value === status)
    ?.label as string;

  if (!statusLabel) {
    return (
      <Badge className="text-xs font-medium rounded-full px-2 py-0.5">
        Unknown
      </Badge>
    );
  }

  return (
    <Badge
      className={cn(
        "text-xs font-medium rounded-full px-2 py-0.5",
        status === "PENDING" && "bg-blue-500 text-white",
        status === "IN_PROGRESS" && "bg-yellow-500 text-white",
        status === "DONE" && "bg-green-500 text-white"
      )}
    >
      {statusLabel}
    </Badge>
  );
};
