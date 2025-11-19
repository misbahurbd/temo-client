import { DashboardHeader } from "@/components/shared/dashboard-header";
import { SearchBox } from "@/components/shared/search-box";
import { Badge } from "@/components/ui/badge";

import { TableHead, TableHeader } from "@/components/ui/table";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableRow,
} from "@/components/ui/table";
import { getTeamListWithPagination } from "@/features/teams/actions/team-list.action";
import { formatDate } from "@/lib/utils";

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

  const teams = await getTeamListWithPagination({
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

      <SearchBox />

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Members</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teams.data?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12">
                  No teams found
                </TableCell>
              </TableRow>
            ) : (
              teams.data?.map((team) => (
                <TableRow key={team.id}>
                  <TableCell>{team.name}</TableCell>
                  <TableCell>{team.members?.length}</TableCell>
                  <TableCell>
                    {team.isActive ? (
                      <Badge variant="default">Active</Badge>
                    ) : (
                      <Badge variant="destructive">Inactive</Badge>
                    )}
                  </TableCell>
                  <TableCell>{formatDate(team.createdAt)}</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
          {teams.data?.length && teams.data?.length > 0 && (
            <TableFooter>
              <TableRow>
                <TableCell colSpan={2}></TableCell>
              </TableRow>
            </TableFooter>
          )}
        </Table>
      </div>
    </div>
  );
}
