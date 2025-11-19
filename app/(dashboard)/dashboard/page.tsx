import { DashboardHeader } from "@/components/shared/dashboard-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FolderKanban, CheckSquare, Users, RefreshCw, ArrowRight } from "lucide-react";
import { formatDate } from "@/lib/utils";

// Dummy data - Replace with API calls later
const DUMMY_STATS = {
  totalProjects: 12,
  totalTasks: 48,
};

const DUMMY_TEAM_MEMBERS = [
  {
    id: "1",
    name: "John Doe",
    currentTasks: 8,
    capacity: 10,
  },
  {
    id: "2",
    name: "Jane Smith",
    currentTasks: 12,
    capacity: 10,
  },
  {
    id: "3",
    name: "Mike Johnson",
    currentTasks: 6,
    capacity: 10,
  },
  {
    id: "4",
    name: "Sarah Williams",
    currentTasks: 11,
    capacity: 10,
  },
  {
    id: "5",
    name: "David Brown",
    currentTasks: 9,
    capacity: 10,
  },
];

const DUMMY_RECENT_REASSIGNMENTS = [
  {
    id: "1",
    taskName: "Implement user authentication",
    fromMember: "Jane Smith",
    toMember: "Mike Johnson",
    reassignedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
  },
  {
    id: "2",
    taskName: "Design landing page",
    fromMember: "Sarah Williams",
    toMember: "David Brown",
    reassignedAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
  },
  {
    id: "3",
    taskName: "Setup database schema",
    fromMember: "John Doe",
    toMember: "Jane Smith",
    reassignedAt: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
  },
  {
    id: "4",
    taskName: "Write API documentation",
    fromMember: "Mike Johnson",
    toMember: "John Doe",
    reassignedAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
  },
  {
    id: "5",
    taskName: "Fix bug in payment module",
    fromMember: "David Brown",
    toMember: "Sarah Williams",
    reassignedAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 24 hours ago
  },
];

const DashboardPage = () => {
  return (
    <div className="space-y-6">
      <DashboardHeader title="Dashboard" />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FolderKanban className="h-5 w-5 text-primary" />
              Total Projects
            </CardTitle>
            <CardDescription>Active projects in your workspace</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{DUMMY_STATS.totalProjects}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckSquare className="h-5 w-5 text-primary" />
              Total Tasks
            </CardTitle>
            <CardDescription>All tasks across all projects</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{DUMMY_STATS.totalTasks}</div>
          </CardContent>
        </Card>
      </div>

      {/* Team Summary */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Team Summary
              </CardTitle>
              <CardDescription>
                Current tasks vs. capacity for each team member
              </CardDescription>
            </div>
            <Button>
              <RefreshCw className="h-4 w-4 mr-2" />
              Reassign Tasks
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member</TableHead>
                  <TableHead>Current Tasks</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Utilization</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {DUMMY_TEAM_MEMBERS.map((member) => {
                  const isOverloaded = member.currentTasks > member.capacity;
                  const utilization = Math.round(
                    (member.currentTasks / member.capacity) * 100
                  );

                  return (
                    <TableRow
                      key={member.id}
                      className={isOverloaded ? "bg-destructive/10" : ""}
                    >
                      <TableCell className="font-medium">{member.name}</TableCell>
                      <TableCell>
                        <span
                          className={
                            isOverloaded ? "text-destructive font-semibold" : ""
                          }
                        >
                          {member.currentTasks}
                        </span>
                      </TableCell>
                      <TableCell>{member.capacity}</TableCell>
                      <TableCell>
                        {isOverloaded ? (
                          <Badge variant="destructive">Overloaded</Badge>
                        ) : (
                          <Badge variant="default">Normal</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-secondary rounded-full overflow-hidden">
                            <div
                              className={`h-full ${
                                isOverloaded
                                  ? "bg-destructive"
                                  : utilization > 80
                                  ? "bg-yellow-500"
                                  : "bg-primary"
                              }`}
                              style={{ width: `${Math.min(utilization, 100)}%` }}
                            />
                          </div>
                          <span
                            className={`text-sm ${
                              isOverloaded ? "text-destructive font-semibold" : ""
                            }`}
                          >
                            {utilization}%
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Recent Reassignments */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Reassignments</CardTitle>
          <CardDescription>Last 5 moved tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Task</TableHead>
                  <TableHead>From</TableHead>
                  <TableHead>To</TableHead>
                  <TableHead>Reassigned At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {DUMMY_RECENT_REASSIGNMENTS.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-12">
                      No recent reassignments
                    </TableCell>
                  </TableRow>
                ) : (
                  DUMMY_RECENT_REASSIGNMENTS.map((reassignment) => (
                    <TableRow key={reassignment.id}>
                      <TableCell className="font-medium">
                        {reassignment.taskName}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{reassignment.fromMember}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <ArrowRight className="h-4 w-4 text-muted-foreground" />
                          <Badge variant="default">{reassignment.toMember}</Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(reassignment.reassignedAt.toISOString())}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;
