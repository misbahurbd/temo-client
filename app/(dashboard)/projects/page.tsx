import { DashboardHeader } from "@/components/shared/dashboard-header";
import { SearchBox } from "@/components/shared/search-box";
import { CreateProjectButton } from "@/features/projects/components/create-project-button";

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
    page?: string;
    limit?: string;
  }>;
}) {
  const { search, page, limit } = await searchParams;

  return (
    <div className="space-y-4">
      <DashboardHeader title="Projects" />

      <div className="flex items-center gap-4 justify-between">
        <SearchBox />
        <CreateProjectButton />
      </div>

      <div className="border rounded-lg"></div>
    </div>
  );
}
