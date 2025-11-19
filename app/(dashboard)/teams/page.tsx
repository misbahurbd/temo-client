import { DashboardHeader } from "@/components/shared/dashboard-header";
import { SearchBox } from "@/components/shared/search-box";
import { TablePagination } from "@/components/shared/table-pagination";
import { Badge } from "@/components/ui/badge";

import { TableHead, TableHeader } from "@/components/ui/table";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { fetchTeamList } from "@/features/teams/actions/fetch-team-list";
import { CreateTeamButton } from "@/features/teams/components/create-team-button";
import { TeamTableAction } from "@/features/teams/components/team-table-action";
import { formatDate } from "@/lib/utils";
import { Circle } from "lucide-react";

export default async function TeamsPage({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
    page?: string;
    limit?: string;
  }>;
}) {
  const { search, page, limit } = await searchParams;

  const teams = await fetchTeamList({
    page: page ? Number(page) : 1,
    limit: limit ? Number(limit) : 10,
    search: search || "",
  });

  if (!teams.success) {
    return <div>{teams.message}</div>;
  }

  return (
    <div className="space-y-4">
      <DashboardHeader title="Teams" />

      <div className="flex items-center gap-4 justify-between">
        <SearchBox />
        <CreateTeamButton />
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Members</TableHead>
              <TableHead>Created Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[100px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teams.data?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12">
                  <div className="flex flex-col items-center gap-3">
                    <Circle className="h-12 w-12 text-muted-foreground/50" />
                    <div className="text-muted-foreground">No teams found</div>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              teams.data?.map((team) => (
                <TableRow key={team.id}>
                  <TableCell>{team.name}</TableCell>
                  <TableCell>
                    {team.members?.length > 0 ? (
                      <div className="flex items-center -space-x-3">
                        {team.members?.slice(0, 3).map((member) => (
                          <Tooltip key={member.id}>
                            <TooltipTrigger asChild>
                              <div className="size-8 relative cursor-default hover:z-10 rounded-full bg-secondary text-primary border-2 border-white flex items-center justify-center">
                                {member.name.charAt(0) + member.name.charAt(1)}
                              </div>
                            </TooltipTrigger>
                            <TooltipContent side="bottom">
                              {member.name}
                            </TooltipContent>
                          </Tooltip>
                        ))}
                        {team.members?.length > 3 && (
                          <div className="size-8 relative cursor-default rounded-full bg-secondary text-primary border-2 border-white flex items-center justify-center">
                            +{team.members?.length - 3}
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">No members</span>
                    )}
                  </TableCell>
                  <TableCell>{formatDate(team.createdAt)}</TableCell>
                  <TableCell>
                    {team.isActive ? (
                      <Badge variant="default">Active</Badge>
                    ) : (
                      <Badge variant="destructive">Inactive</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right w-[100px] flex justify-end">
                    <TeamTableAction id={team.id} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
          {teams.success && teams.data.length > 0 && (
            <TableFooter>
              <TableRow>
                <TableCell colSpan={2}></TableCell>
                <TableCell colSpan={3}>
                  <TablePagination
                    page={teams.meta?.page || 1}
                    totalPage={teams.meta?.totalPages || 0}
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
