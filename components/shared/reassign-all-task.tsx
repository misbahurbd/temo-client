"use client";

import { toast } from "sonner";
import { reassignTasks } from "@/features/tasks/actions/reassign-tasks.action";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchOverloadedMemberCount } from "@/features/tasks/actions/fetch-overloaded-member-count.action";
import { useTransition } from "react";
import { ReassignButton } from "./reassign-button";

const ReassignAllTask = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isPendding, startTransition] = useTransition();

  const { data: overloadedMemberCountData, isLoading } = useQuery({
    queryKey: ["overloaded-member-count"],
    queryFn: () => fetchOverloadedMemberCount(),
    select: (data) => (data.success ? data.data : 0),
  });

  const handleReassignAllTasks = async () => {
    startTransition(async () => {
      const response = await reassignTasks();
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
    <ReassignButton
      onClick={handleReassignAllTasks}
      isLoading={isPendding}
      disabled={overloadedMemberCountData === 0 || isLoading}
      taskCount={overloadedMemberCountData || 0}
    />
  );
};

export default ReassignAllTask;
