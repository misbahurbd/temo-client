export enum TaskStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  DONE = "DONE",
}

export enum TaskPriority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
}

interface Project {
  id: string;
  name: string;
}

interface ProjectMember {
  id: string;
  name: string;
  capacity: number;
  tasksCount: number;
}

export interface Task {
  id: string;
  name: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  isActive: boolean;
  projectId: string;
  dueDate: string;
  assigneeId: string;
  project: Project;
  assignee: ProjectMember;
  createdAt: string;
  updatedAt: string;
}

export interface TaskActivity {
  id: string;
  taskId: string;
  userId: string;
  assigneeToId: string;
  assigneeFromId?: string;
  createdAt: string;
  task: {
    id: string;
    name: string;
  };
  assigneeFrom: {
    id: string;
    name: string;
  } | null;
  assigneeTo: {
    id: string;
    name: string;
  };
}
