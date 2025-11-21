import { DashboardHeader } from "@/components/shared/dashboard-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { fetchTaskById } from "@/features/tasks/actions/fetch-task-by-id.action";
import { TaskTableAction } from "@/features/tasks/components/task-table-action";
import { TaskStatusSelect } from "@/features/tasks/components/task-status-select";
import { TaskPrioritySelect } from "@/features/tasks/components/task-priority-select";
import { formatDistanceToNow, format } from "date-fns";
import { formatDate, cn } from "@/lib/utils";
import {
  ArrowRight,
  Clock,
  Circle,
  ArrowRightLeft,
  Calendar,
  User,
  FolderKanban,
  FileText,
  Plus,
  Edit,
  CheckSquare,
  Star,
  UserPlus,
  UserMinus,
} from "lucide-react";
import Link from "next/link";
import {
  TaskActivityType,
  TaskPriority,
  TaskStatus,
} from "@/features/tasks/types/task.type";
import { TaskStatusBadge } from "@/features/tasks/components/task-status-badge";
import { TaskPriorityBadge } from "@/features/tasks/components/task-priority-badge";

interface TaskDetailPageProps {
  params: Promise<{ taskId: string }>;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const TaskDetailPage = async ({ params }: TaskDetailPageProps) => {
  const { taskId } = await params;
  const task = await fetchTaskById(taskId);

  if (!task.success) {
    return (
      <div className="space-y-6">
        <DashboardHeader title="Task Details" />
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-muted-foreground">
              {task.message || "Task not found"}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const taskData = task.data;
  const activities = taskData.activities;

  const isOverloaded =
    taskData.assignee &&
    taskData.assignee.tasksCount > taskData.assignee.capacity;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <DashboardHeader title="Task Details" />
      </div>

      {/* Task Information Card */}
      <Card className="py-4 rounded-lg shadow-none drop-shadow-none">
        <CardHeader className="px-4 border-b mb-0">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle className="text-2xl">{taskData.name}</CardTitle>
              <CardDescription>
                Created on {formatDate(taskData.createdAt)}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <TaskPrioritySelect
                taskId={taskId}
                currentPriority={taskData.priority}
                currentDueDate={taskData.dueDate}
              />
              <TaskStatusSelect
                taskId={taskId}
                currentStatus={taskData.status}
                currentDueDate={taskData.dueDate}
              />

              <TaskTableAction id={taskId} />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 px-4">
          {/* Description */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <FileText className="h-4 w-4 text-muted-foreground" />
              Description
            </div>
            <p className="text-sm text-muted-foreground pl-6">
              {taskData.description || "No description provided"}
            </p>
          </div>

          {/* Task Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <FolderKanban className="h-4 w-4 text-muted-foreground" />
                Project
              </div>
              <Link
                href={`/projects/${taskData.projectId}`}
                className="text-sm text-primary hover:underline pl-6"
              >
                {taskData.project?.name}
              </Link>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                Due Date
              </div>
              <p className="text-sm text-muted-foreground pl-6">
                {formatDate(taskData.dueDate)}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <User className="h-4 w-4 text-muted-foreground" />
                Assignee
              </div>
              <div className="pl-6">
                {taskData.assignee?.name ? (
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{taskData.assignee.name}</span>
                    <Badge
                      variant={isOverloaded ? "destructive" : "default"}
                      className={cn(
                        "text-[10px] px-1 py-0.5",
                        isOverloaded
                          ? "bg-red-500 text-white"
                          : taskData.assignee.tasksCount ===
                            taskData.assignee.capacity
                          ? "bg-yellow-500 text-white"
                          : "bg-green-500 text-white"
                      )}
                    >
                      ({taskData.assignee.tasksCount}/
                      {taskData.assignee.capacity})
                    </Badge>
                    {isOverloaded && (
                      <Badge variant="destructive" className="text-[10px]">
                        Overloaded
                      </Badge>
                    )}
                  </div>
                ) : (
                  <span className="text-sm text-muted-foreground">
                    Unassigned
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Clock className="h-4 w-4 text-muted-foreground" />
                Last Updated
              </div>
              <p className="text-sm text-muted-foreground pl-6">
                {format(
                  new Date(taskData.updatedAt),
                  "MMM d, yyyy 'at' h:mm a"
                )}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Activity History */}
      <Card className="border-none shadow-none drop-shadow-none p-0 gap-4">
        <CardHeader className="px-0">
          <CardTitle className="px-0">Activity History</CardTitle>
          <CardDescription>All activities for this task</CardDescription>
        </CardHeader>
        <CardContent className="px-0">
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[50px]"></TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Activity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activities.length === 0 ? (
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
                  activities.map((activity, index) => {
                    const activityType = activity.activityType;
                    const isLast = index === activities.length - 1;
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
                                      {activity.assigneeTo.name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")
                                        .toUpperCase()
                                        .slice(0, 2)}
                                    </AvatarFallback>
                                  </Avatar>
                                )}
                                <span className="text-sm text-muted-foreground">
                                  {activity.assigneeTo?.name ? (
                                    <>
                                      Created and assigned to{" "}
                                      <span className="font-medium text-foreground">
                                        {activity.assigneeTo.name}
                                      </span>
                                    </>
                                  ) : (
                                    <>Created and unassigned to anyone</>
                                  )}
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
                            {activityType ===
                              TaskActivityType.TASK_UNASSIGNED && (
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground">
                                  Unassigned
                                </span>
                              </div>
                            )}
                            {activityType ===
                              TaskActivityType.TASK_REASSIGNED && (
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
                                    {activity.assigneeFrom?.name?.split(
                                      " "
                                    )[0] || ""}
                                  </span>
                                </div>
                                <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                                <div className="flex items-center gap-2">
                                  <Avatar className="size-8 border-2 border-background">
                                    <AvatarFallback className="bg-green-500/10 text-green-600 dark:text-green-400 text-xs">
                                      {getInitials(
                                        activity.assigneeTo?.name || ""
                                      )}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="text-sm font-medium">
                                    {activity.assigneeTo?.name?.split(" ")[0] ||
                                      ""}
                                  </span>
                                </div>
                              </div>
                            )}
                            {activityType ===
                              TaskActivityType.TASK_ASSIGNED && (
                              <div className="flex items-center gap-2">
                                <Avatar className="size-8 border-2 border-background">
                                  <AvatarFallback className="bg-green-500/10 text-green-600 dark:text-green-400 text-xs">
                                    {getInitials(
                                      activity.assigneeTo?.name || ""
                                    )}
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
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaskDetailPage;
