import { AppSidebar } from "@/components/shared/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { CreateTeamModal } from "@/features/teams/modals/create-team-modal";
import { UpdateTeamModal } from "@/features/teams/modals/update-team-modal";
import { cookies } from "next/headers";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar />
      <main className="p-2 flex-1">{children}</main>

      {/* All models */}
      <CreateTeamModal />
      <UpdateTeamModal />
    </SidebarProvider>
  );
};

export default DashboardLayout;
