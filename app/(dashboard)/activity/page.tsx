import { DashboardHeader } from "@/components/shared/dashboard-header";
import { SearchBox } from "@/components/shared/search-box";
import { TablePagination } from "@/components/shared/table-pagination";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { TableHead, TableHeader } from "@/components/ui/table";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableRow,
} from "@/components/ui/table";
import { format, formatDistanceToNow } from "date-fns";
import {
  ArrowRight,
  Clock,
  Circle,
  ArrowRightLeft,
  Plus,
  Edit,
  CheckSquare,
  Star,
  Calendar,
  UserPlus,
  UserMinus,
} from "lucide-react";
import { fetchTaskActivities } from "@/features/tasks/actions/fetch-task-activities.action";
import {
  TaskActivityType,
  TaskPriority,
  TaskStatus,
} from "@/features/tasks/types/task.type";
import { cn, formatDate } from "@/lib/utils";
import { TaskPriorityBadge } from "@/features/tasks/components/task-priority-badge";
import { TaskStatusBadge } from "@/features/tasks/components/task-status-badge";
import Link from "next/link";

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default async function ActivityPage({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
    page?: string;
    limit?: string;
  }>;
}) {
  const query = await searchParams;

  const activities = await fetchTaskActivities({ query });
  const activitiesData = activities.success ? activities.data : [];

  return (
    <div className="space-y-4">
      <DashboardHeader title="Activity" />

      <div className="flex items-center gap-4 justify-between">
        <SearchBox />
      </div>

      <div className="border rounded-lg bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[50px]"></TableHead>
              <TableHead>Task</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Activity</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activitiesData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-12">
                  <div className="flex flex-col items-center gap-3">
                    <Circle className="h-12 w-12 text-muted-foreground/50" />
                    <div className="text-muted-foreground">
                      No activity found for this task
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              activitiesData.map((activity, index) => {
                const activityType = activity.activityType;
                const isLast = index === activitiesData.length - 1;
                const isFirst = index === 0;
                let Icon = null;

                let iconBgClassName = "";
                switch (activityType) {
                  case TaskActivityType.TASK_CREATED:
                    iconBgClassName =
                      "bg-blue-500/10 text-blue-600 dark:text-blue-400";
                    Icon = Plus;
                    break;
                  case TaskActivityType.TASK_UPDATED:
                    iconBgClassName =
                      "bg-green-500/10 text-green-600 dark:text-green-400";
                    Icon = Edit;
                    break;
                  case TaskActivityType.TASK_STATUS_UPDATED:
                    iconBgClassName =
                      "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400";
                    Icon = CheckSquare;
                    break;
                  case TaskActivityType.TASK_PRIORITY_UPDATED:
                    iconBgClassName =
                      "bg-purple-500/10 text-purple-600 dark:text-purple-400";
                    Icon = Star;
                    break;
                  case TaskActivityType.TASK_DUE_DATE_UPDATED:
                    iconBgClassName =
                      "bg-orange-500/10 text-orange-600 dark:text-orange-400";
                    Icon = Calendar;
                    break;
                  case TaskActivityType.TASK_ASSIGNED:
                    iconBgClassName =
                      "bg-teal-500/10 text-teal-600 dark:text-teal-400";
                    Icon = UserPlus;
                    break;
                  case TaskActivityType.TASK_UNASSIGNED:
                    iconBgClassName =
                      "bg-red-500/10 text-red-600 dark:text-red-400";
                    Icon = UserMinus;
                    break;
                  case TaskActivityType.TASK_REASSIGNED:
                    iconBgClassName =
                      "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400";
                    Icon = ArrowRightLeft;
                    break;
                  default:
                    iconBgClassName =
                      "bg-gray-500/10 text-gray-600 dark:text-gray-400";
                    Icon = null;
                    break;
                }

                return (
                  <TableRow
                    key={activity.id}
                    className="hover:bg-muted/50 transition-colors"
                  >
                    <TableCell className="relative">
                      {!isLast && (
                        <>
                          <div className="absolute left-1/2 -translate-x-1/2 top-12 bottom-0 w-px bg-border" />
                        </>
                      )}
                      {!isFirst && (
                        <>
                          <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-12 w-px bg-border" />
                        </>
                      )}
                      {!isFirst && !isLast && (
                        <>
                          <div className="absolute left-1/2 -translate-x-1/2 top-12 bottom-0 w-px bg-border" />
                          <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-12 w-px bg-border" />
                        </>
                      )}
                      <div className="relative flex items-center justify-center">
                        <div
                          className={cn(
                            "relative z-10 flex items-center justify-center size-10 rounded-full border-2 border-background",
                            iconBgClassName
                          )}
                        >
                          {Icon && <Icon className="h-4 w-4" />}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Link
                          href={`/tasks/${activity.taskId}`}
                          className="hover:underline font-medium hover:text-primary "
                        >
                          <span>{activity.task?.name || "Unnamed Task"}</span>
                        </Link>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" />
                        <span>
                          {formatDistanceToNow(activity.createdAt)} ago
                        </span>
                        <span className="text-xs">
                          ({format(activity.createdAt, "MMM d, h:mm a")})
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {activityType === TaskActivityType.TASK_CREATED && (
                          <div className="flex items-center gap-2">
                            {activity.assigneeTo?.name && (
                              <Avatar className="size-8 border-2 border-background">
                                <AvatarFallback className="bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs">
                                  {activity.assigneeTo?.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")
                                    .toUpperCase()
                                    .slice(0, 2)}
                                </AvatarFallback>
                              </Avatar>
                            )}
                            <span className="text-sm text-muted-foreground">
                              Created and assigned to{" "}
                              <span className="font-medium text-foreground">
                                {activity.assigneeTo?.name || "Unassigned"}
                              </span>
                            </span>
                          </div>
                        )}
                        {activityType === TaskActivityType.TASK_UPDATED && (
                          <span className="text-sm text-muted-foreground">
                            Task updated
                          </span>
                        )}
                        {activityType ===
                          TaskActivityType.TASK_STATUS_UPDATED && (
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">
                              Status updated
                            </span>
                            <TaskStatusBadge
                              status={activity.fromValue as TaskStatus}
                            />
                            <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                            <TaskStatusBadge
                              status={activity.toValue as TaskStatus}
                            />
                          </div>
                        )}
                        {activityType ===
                          TaskActivityType.TASK_PRIORITY_UPDATED && (
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">
                              Priority updated
                            </span>
                            <TaskPriorityBadge
                              priority={activity.fromValue as TaskPriority}
                            />
                            <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                            <TaskPriorityBadge
                              priority={activity.toValue as TaskPriority}
                            />
                          </div>
                        )}
                        {activityType ===
                          TaskActivityType.TASK_DUE_DATE_UPDATED && (
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">
                              Due date updated
                            </span>
                            <span className="text-sm text-muted-foreground font-medium">
                              {formatDate(activity.fromValue as string)}
                            </span>
                            <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                            <span className="text-sm text-muted-foreground font-medium">
                              {formatDate(activity.toValue as string)}
                            </span>
                          </div>
                        )}
                        {activityType === TaskActivityType.TASK_UNASSIGNED && (
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">
                              Unassigned
                            </span>
                          </div>
                        )}
                        {activityType === TaskActivityType.TASK_REASSIGNED && (
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">
                              Reassigned from
                            </span>
                            <div className="flex items-center gap-2">
                              <Avatar className="size-8 border-2 border-background">
                                <AvatarFallback className="bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs">
                                  {getInitials(
                                    activity.assigneeFrom?.name || ""
                                  )}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm text-muted-foreground">
                                {activity.assigneeFrom?.name?.split(" ")[0] ||
                                  ""}
                              </span>
                            </div>
                            <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                            <div className="flex items-center gap-2">
                              <Avatar className="size-8 border-2 border-background">
                                <AvatarFallback className="bg-green-500/10 text-green-600 dark:text-green-400 text-xs">
                                  {getInitials(activity.assigneeTo?.name || "")}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm font-medium">
                                {activity.assigneeTo?.name?.split(" ")[0] || ""}
                              </span>
                            </div>
                          </div>
                        )}
                        {activityType === TaskActivityType.TASK_ASSIGNED && (
                          <div className="flex items-center gap-2">
                            <Avatar className="size-8 border-2 border-background">
                              <AvatarFallback className="bg-green-500/10 text-green-600 dark:text-green-400 text-xs">
                                {getInitials(activity.assigneeTo?.name || "")}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                              <span className="text-sm text-muted-foreground">
                                Assigned to{" "}
                                <span className="font-medium text-foreground">
                                  {activity.assigneeTo?.name || ""}
                                </span>
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
          {activities.success && activitiesData.length > 0 && (
            <TableFooter>
              <TableRow>
                <TableCell colSpan={5} className="text-right">
                  <TablePagination
                    page={activities?.meta?.page || 1}
                    totalPage={activities.meta?.totalPages || 0}
                  />
                </TableCell>
              </TableRow>
            </TableFooter>
          )}
        </Table>
      </div>
    </div>
  );
}
