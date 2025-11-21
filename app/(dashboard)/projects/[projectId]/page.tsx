import { DashboardHeader } from "@/components/shared/dashboard-header";
import { SearchBox } from "@/components/shared/search-box";
import { fetchProjectWithTask } from "@/features/projects/actions/fetch-project-with-task.action";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { TaskTableAction } from "@/features/tasks/components/task-table-action";
import { TaskActionButtons } from "@/features/tasks/components/task-action-buttons";
import { Circle } from "lucide-react";
import { TablePagination } from "@/components/shared/table-pagination";
import Link from "next/link";
import { TaskPriorityBadge } from "@/features/tasks/components/task-priority-badge";
import { TaskStatusBadge } from "@/features/tasks/components/task-status-badge";

const DashboardProjectPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ projectId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const { projectId } = await params;
  const query = await searchParams;
  const project = await fetchProjectWithTask(projectId, query);

  if (!project.success) {
    return <div>{project.message}</div>;
  }

  const memberCount = new Set(
    project.data.tasks?.map((task) => task.assignee?.id)
  );
  const overloadedMemberCount = Array.from(memberCount).filter((member) => {
    const memberTasks = project.data.tasks?.filter(
      (task) => task.assignee?.id === member
    );
    return memberTasks?.some(
      (task) => task.assignee?.tasksCount > task.assignee?.capacity
    );
  }).length;

  return (
    <div className="space-y-4">
      <DashboardHeader
        title={project.data?.name + " project tasks" || "Project tasks"}
      />

      <div className="flex items-center gap-4 justify-between">
        <SearchBox />
        <TaskActionButtons
          projectId={projectId}
          overloadedMemberCount={overloadedMemberCount || 0}
        />
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>
                Assignee{" "}
                <span className="text-xs text-muted-foreground">
                  (Tasks/Capacity)
                </span>
              </TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead className="text-center">Priority</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-right w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {project.data.tasks?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-12">
                  <div className="flex flex-col items-center gap-3">
                    <Circle className="h-12 w-12 text-muted-foreground/50" />
                    <div className="text-muted-foreground">No tasks found</div>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              project.data.tasks?.map((task) => (
                <TableRow key={task.id}>
                  <TableCell>{formatDate(task.createdAt)}</TableCell>
                  <TableCell>
                    <Link
                      href={`/tasks/${task.id}`}
                      className="hover:underline font-medium hover:text-primary"
                    >
                      {task.name}
                    </Link>
                  </TableCell>
                  <TableCell>
                    {task.assignee ? (
                      <span className="text-sm ">
                        {task.assignee?.name}
                        <Badge
                          variant={
                            task.assignee?.tasksCount > task.assignee?.capacity
                              ? "destructive"
                              : "default"
                          }
                          className={cn(
                            "text-[10px] px-1 py-0.5 ml-2",
                            task.assignee?.tasksCount > task.assignee?.capacity
                              ? "bg-red-500 text-white"
                              : task.assignee?.tasksCount ===
                                task.assignee?.capacity
                              ? "bg-yellow-500 text-white"
                              : "bg-green-500 text-white"
                          )}
                        >
                          ({task.assignee?.tasksCount}/{task.assignee?.capacity}
                          )
                        </Badge>
                      </span>
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        Unassigned
                      </span>
                    )}
                  </TableCell>

                  <TableCell>{formatDate(task.dueDate)}</TableCell>

                  <TableCell className="text-center">
                    <TaskPriorityBadge priority={task.priority} />
                  </TableCell>
                  <TableCell className="text-center">
                    <TaskStatusBadge status={task.status} />
                  </TableCell>
                  <TableCell className="text-right w-[100px]">
                    <TaskTableAction id={task.id} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={8}>
                <TablePagination
                  page={project.meta?.page || 1}
                  totalPage={project.meta?.totalPages || 0}
                />
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  );
};

export default DashboardProjectPage;
