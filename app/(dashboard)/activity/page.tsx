import { DashboardHeader } from "@/components/shared/dashboard-header";
import { SearchBox } from "@/components/shared/search-box";
import { TablePagination } from "@/components/shared/table-pagination";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { TableHead, TableHeader } from "@/components/ui/table";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TaskActivity } from "@/features/tasks/types/task.type";
import { format } from "date-fns";
import {
  ArrowRight,
  Clock,
  CheckCircle2,
  Circle,
  ArrowRightLeft,
} from "lucide-react";
import { fetchTaskActivities } from "@/features/tasks/actions/fetch-task-activities.action";

// Demo data for task activity
const demoActivityData: TaskActivity[] = [
  {
    id: "1",
    taskId: "task-1",
    userId: "user-1",
    assigneeToId: "user-2",
    assigneeFromId: "user-1",
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 minutes ago
    task: {
      id: "task-1",
      name: "Implement user authentication",
    },
    assigneeFrom: {
      id: "user-1",
      name: "John Doe",
    },
    assigneeTo: {
      id: "user-2",
      name: "Sarah Smith",
    },
  },
  {
    id: "2",
    taskId: "task-2",
    userId: "user-3",
    assigneeToId: "user-4",
    assigneeFromId: "",
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 minutes ago
    task: {
      id: "task-2",
      name: "Design dashboard UI",
    },
    assigneeFrom: null,
    assigneeTo: {
      id: "user-4",
      name: "Mike Johnson",
    },
  } as TaskActivity,
  {
    id: "3",
    taskId: "task-3",
    userId: "user-5",
    assigneeToId: "user-6",
    assigneeFromId: "user-5",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    task: {
      id: "task-3",
      name: "Setup database schema",
    },
    assigneeFrom: {
      id: "user-5",
      name: "Emily Chen",
    },
    assigneeTo: {
      id: "user-6",
      name: "David Wilson",
    },
  },
  {
    id: "4",
    taskId: "task-4",
    userId: "user-7",
    assigneeToId: "user-8",
    assigneeFromId: "user-7",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), // 4 hours ago
    task: {
      id: "task-4",
      name: "Write API documentation",
    },
    assigneeFrom: {
      id: "user-7",
      name: "Alex Brown",
    },
    assigneeTo: {
      id: "user-8",
      name: "Lisa Anderson",
    },
  },
  {
    id: "5",
    taskId: "task-5",
    userId: "user-9",
    assigneeToId: "user-10",
    assigneeFromId: "",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(), // 6 hours ago
    task: {
      id: "task-5",
      name: "Fix login bug",
    },
    assigneeFrom: null,
    assigneeTo: {
      id: "user-10",
      name: "Tom Martinez",
    },
  } as TaskActivity,
  {
    id: "6",
    taskId: "task-6",
    userId: "user-11",
    assigneeToId: "user-12",
    assigneeFromId: "user-11",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), // 8 hours ago
    task: {
      id: "task-6",
      name: "Optimize database queries",
    },
    assigneeFrom: {
      id: "user-11",
      name: "Rachel Green",
    },
    assigneeTo: {
      id: "user-12",
      name: "Chris Taylor",
    },
  },
  {
    id: "7",
    taskId: "task-7",
    userId: "user-13",
    assigneeToId: "user-14",
    assigneeFromId: "user-13",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), // 12 hours ago
    task: {
      id: "task-7",
      name: "Add email notifications",
    },
    assigneeFrom: {
      id: "user-13",
      name: "Kevin Lee",
    },
    assigneeTo: {
      id: "user-14",
      name: "Amanda White",
    },
  },
  {
    id: "8",
    taskId: "task-8",
    userId: "user-15",
    assigneeToId: "user-16",
    assigneeFromId: "",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    task: {
      id: "task-8",
      name: "Create user profile page",
    },
    assigneeFrom: null,
    assigneeTo: {
      id: "user-16",
      name: "Ryan Cooper",
    },
  } as TaskActivity,
];

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function getTimeAgo(date: string): string {
  const now = new Date();
  const activityDate = new Date(date);
  const diffInSeconds = Math.floor(
    (now.getTime() - activityDate.getTime()) / 1000
  );

  if (diffInSeconds < 60) {
    return "Just now";
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
  } else {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} ${days === 1 ? "day" : "days"} ago`;
  }
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
                <TableCell colSpan={5} className="text-center py-16">
                  <div className="flex flex-col items-center gap-3">
                    <Circle className="h-12 w-12 text-muted-foreground/50" />
                    <div className="text-muted-foreground">
                      No activity found
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              activitiesData.map((activity, index) => {
                const isReassignment = activity.assigneeFrom !== null;
                const isLast = index === activitiesData.length - 1;
                const isFirst = index === 0;

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
                          className={`relative z-10 flex items-center justify-center size-10 rounded-full border-2 border-background ${
                            isReassignment
                              ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                              : "bg-green-500/10 text-green-600 dark:text-green-400"
                          }`}
                        >
                          {isReassignment ? (
                            <ArrowRightLeft className="h-4 w-4" />
                          ) : (
                            <CheckCircle2 className="h-4 w-4" />
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col">
                          <span className="font-medium text-sm">
                            {activity.task.name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            Task #{activity.task.id.slice(-6)}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{getTimeAgo(activity.createdAt)}</span>
                        <span className="text-xs">
                          (
                          {format(
                            new Date(activity.createdAt),
                            "MMM d, h:mm a"
                          )}
                          )
                        </span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-3">
                        {isReassignment ? (
                          <>
                            <div className="flex items-center gap-2">
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Avatar className="size-8 border-2 border-background">
                                    <AvatarFallback className="bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs">
                                      {getInitials(activity.assigneeFrom!.name)}
                                    </AvatarFallback>
                                  </Avatar>
                                </TooltipTrigger>
                                <TooltipContent>
                                  {activity.assigneeFrom!.name}
                                </TooltipContent>
                              </Tooltip>
                              <span className="text-sm text-muted-foreground">
                                {activity.assigneeFrom!.name.split(" ")[0]}
                              </span>
                            </div>
                            <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                            <div className="flex items-center gap-2">
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Avatar className="size-8 border-2 border-background">
                                    <AvatarFallback className="bg-green-500/10 text-green-600 dark:text-green-400 text-xs">
                                      {getInitials(activity.assigneeTo.name)}
                                    </AvatarFallback>
                                  </Avatar>
                                </TooltipTrigger>
                                <TooltipContent>
                                  {activity.assigneeTo.name}
                                </TooltipContent>
                              </Tooltip>
                              <span className="text-sm font-medium">
                                {activity.assigneeTo.name.split(" ")[0]}
                              </span>
                            </div>
                          </>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Avatar className="size-8 border-2 border-background">
                                  <AvatarFallback className="bg-green-500/10 text-green-600 dark:text-green-400 text-xs">
                                    {getInitials(activity.assigneeTo.name)}
                                  </AvatarFallback>
                                </Avatar>
                              </TooltipTrigger>
                              <TooltipContent>
                                {activity.assigneeTo.name}
                              </TooltipContent>
                            </Tooltip>
                            <div className="flex flex-col">
                              <span className="text-sm font-medium">
                                Assigned to {activity.assigneeTo.name}
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
          {activities.success && activities.data.length > 0 && (
            <TableFooter>
              <TableRow>
                <TableCell colSpan={5} className="text-right">
                  <TablePagination
                    page={activities.meta?.page || 1}
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
