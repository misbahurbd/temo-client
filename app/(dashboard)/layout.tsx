import { AppSidebar } from "@/components/shared/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { CreateTeamModel } from "@/features/teams/models/create-team-model";
import { cookies } from "next/headers";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar />
      <main className="p-2 flex-1">{children}</main>

      {/* All models */}
      <CreateTeamModel />
    </SidebarProvider>
  );
};

export default DashboardLayout;
