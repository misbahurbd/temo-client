import { DashboardHeader } from "@/components/shared/dashboard-header";
import { SearchBox } from "@/components/shared/search-box";
import { TablePagination } from "@/components/shared/table-pagination";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fetchProjectsList } from "@/features/projects/actions/fetch-projects-list";
import { CreateProjectButton } from "@/features/projects/components/create-project-button";
import { ProjectTableAction } from "@/features/projects/components/project-table-action";
import { formatDate } from "@/lib/utils";
import { Circle } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects - Temo",
  description: "View all your projects",
};

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

  const projects = await fetchProjectsList({
    page: page ? Number(page) : 1,
    limit: limit ? Number(limit) : 10,
    search: search || "",
  });

  if (!projects.success) {
    return <div>{projects.message}</div>;
  }

  return (
    <div className="space-y-4">
      <DashboardHeader title="Projects" />

      <div className="flex items-center gap-4 justify-between">
        <SearchBox />
        <CreateProjectButton />
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Team</TableHead>
              <TableHead>Tasks</TableHead>
              <TableHead>Created Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[100px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.data?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12">
                  <div className="flex flex-col items-center gap-3">
                    <Circle className="h-12 w-12 text-muted-foreground/50" />
                    <div className="text-muted-foreground">
                      No projects found
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              projects.data?.map((project) => (
                <TableRow key={project.id}>
                  <TableCell>{project.name}</TableCell>
                  <TableCell>{project.team?.name}</TableCell>
                  <TableCell>{project.tasks?.length}</TableCell>
                  <TableCell>{formatDate(project.createdAt)}</TableCell>
                  <TableCell>
                    {project.isActive ? (
                      <Badge variant="default">Active</Badge>
                    ) : (
                      <Badge variant="destructive">Inactive</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right w-[100px] flex justify-end">
                    <ProjectTableAction id={project.id} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
          {projects.success && projects.data.length > 0 && (
            <TableFooter>
              <TableRow>
                <TableCell colSpan={2}></TableCell>
                <TableCell colSpan={4}>
                  <TablePagination
                    page={projects.meta?.page || 1}
                    totalPage={projects.meta?.totalPages || 0}
                  />
                </TableCell>
              </TableRow>
            </TableFooter>
          )}
        </Table>
      </div>
    </div>
  );
}
