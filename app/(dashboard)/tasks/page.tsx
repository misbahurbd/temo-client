import { DashboardHeader } from "@/components/shared/dashboard-header";
import { SearchBox } from "@/components/shared/search-box";
import { fetchTasksList } from "@/features/tasks/actions/fetch-tasks-list.action";
import { CreateTaskButton } from "@/features/tasks/components/create-task-button";

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

      <div className="border rounded-lg"></div>
    </div>
  );
};

export default TasksPage;
