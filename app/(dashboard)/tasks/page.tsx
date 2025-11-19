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

  return <div>TasksPage</div>;
};

export default TasksPage;
