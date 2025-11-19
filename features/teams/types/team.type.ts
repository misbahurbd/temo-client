export type Team = {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  members: TeamMember[];
  createdAt: string;
  updatedAt: string;
};

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  capacity: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type MemberTask = {
  id: string;
  name: string;
  capacity: number;
  tasksCount: number;
};
