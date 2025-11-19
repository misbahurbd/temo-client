import { DashboardHeader } from "@/components/shared/dashboard-header";
import { SearchBox } from "@/components/shared/search-box";
import { TablePagination } from "@/components/shared/table-pagination";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fetchTasksList } from "@/features/tasks/actions/fetch-tasks-list.action";
import { CreateTaskButton } from "@/features/tasks/components/create-task-button";
import { TASK_PRIORITY, TASK_STATUS } from "@/features/tasks/constant";
import { formatDate } from "@/lib/utils";

export interface TaskQueryParams {
  search?: string;
  page?: string;
  limit?: string;
  projectId?: string;
  teamId?: string;
  status?: string;
  memberId?: string;
  priority?: string;
}

interface TasksPageProps {
  searchParams: Promise<TaskQueryParams>;
}

const TasksPage = async ({ searchParams }: TasksPageProps) => {
  const query = await searchParams;
  const tasks = await fetchTasksList(query);

  if (!tasks.success) {
    return <div>{tasks.message}</div>;
  }

  return (
    <div className="space-y-4">
      <DashboardHeader title="Tasks" />

      <div className="flex items-center gap-4 justify-between">
        <SearchBox />
        <CreateTaskButton />
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Project</TableHead>
              <TableHead>Assignee</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.data?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-12">
                  No tasks found
                </TableCell>
              </TableRow>
            ) : (
              tasks.data?.map((task) => (
                <TableRow key={task.id}>
                  <TableCell>{formatDate(task.createdAt)}</TableCell>
                  <TableCell>{task.name}</TableCell>
                  <TableCell>{task.project?.name}</TableCell>
                  <TableCell>
                    {task.assignee ? (
                      <span className="text-sm ">
                        {task.assignee?.name}
                        <Badge
                          variant={
                            task.assignee?.tasksCount >= task.assignee?.capacity
                              ? "destructive"
                              : "default"
                          }
                          className="text-[10px] px-1 py-0.5 ml-2"
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

                  <TableCell>
                    <Badge
                      variant={
                        task.priority === "LOW"
                          ? "default"
                          : task.priority === "MEDIUM"
                          ? "default"
                          : "destructive"
                      }
                      className="text-[10px] px-2 py-0.5"
                    >
                      {
                        TASK_PRIORITY.find(
                          (priority: { value: string; label: string }) =>
                            priority.value === task.priority
                        )?.label
                      }
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        task.status === "PENDING"
                          ? "outline"
                          : task.status === "IN_PROGRESS"
                          ? "secondary"
                          : "default"
                      }
                      className="text-[10px] px-2 py-0.5"
                    >
                      {
                        TASK_STATUS.find(
                          (status: { value: string; label: string }) =>
                            status.value === task.status
                        )?.label
                      }
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {/* <TaskTableAction id={task.id} /> */}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={8}>
                <TablePagination
                  page={tasks.meta?.page || 1}
                  totalPage={tasks.meta?.totalPages || 0}
                />
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  );
};

export default TasksPage;
