export interface Project {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  teamId: string;
  createdById: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectMember {
  id: string;
  name: string;
  role: string;
  capacity: number;
  tasksCount: number;
}

export interface ProjectWithMembers {
  id: string;
  name: string;
  members: ProjectMember[];
}
