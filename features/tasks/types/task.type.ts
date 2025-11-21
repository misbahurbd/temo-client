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

export enum TaskActivityType {
  TASK_CREATED = "TASK_CREATED",
  TASK_UPDATED = "TASK_UPDATED",
  TASK_STATUS_UPDATED = "TASK_STATUS_UPDATED",
  TASK_PRIORITY_UPDATED = "TASK_PRIORITY_UPDATED",
  TASK_DUE_DATE_UPDATED = "TASK_DUE_DATE_UPDATED",
  TASK_ASSIGNED = "TASK_ASSIGNED",
  TASK_UNASSIGNED = "TASK_UNASSIGNED",
  TASK_REASSIGNED = "TASK_REASSIGNED",
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
  fromValue: string | null;
  toValue: string | null;
  assigneeToId: string | null;
  assigneeFromId: string | null;
  activityType: TaskActivityType;
  createdAt: string;
  assigneeFrom: {
    id: string;
    name: string;
  } | null;
  assigneeTo: {
    id: string;
    name: string;
  };
  task?: {
    id: string;
    name: string;
  };
}


export interface TaskDetail {
  id: string;
  name: "New task here";
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  assigneeId: string | null;
  projectId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  assignee?: {
    id: string;
    name: string;
    capacity: number;
    _count: {
      tasks: number;
    };
    tasksCount: number;
  };
  project: {
    id: string;
    name: string;
  };
  activities: TaskActivity[];
}
