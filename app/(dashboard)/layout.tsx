import { AppSidebar } from "@/components/shared/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { CreateTeamModal } from "@/features/teams/modals/create-team-modal";
import { UpdateTeamModal } from "@/features/teams/modals/update-team-modal";
import { UpdateProjectModal } from "@/features/projects/modals/update-project-modal";
import { cookies } from "next/headers";
import { CreateProjectModal } from "@/features/projects/modals/create-project-modal";
import { CreateTaskModal } from "@/features/tasks/modals/create-task-modal";
import { UpdateTaskModal } from "@/features/tasks/modals/update-task-modal";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
    <SidebarProvider className="gap-0" defaultOpen={defaultOpen}>
      <AppSidebar />
      <main className="p-4 flex-1">{children}</main>

      {/* All models */}
      <CreateTeamModal />
      <UpdateTeamModal />
      <CreateProjectModal />
      <UpdateProjectModal />
      <CreateTaskModal />
      <UpdateTaskModal />
    </SidebarProvider>
  );
};

export default DashboardLayout;
