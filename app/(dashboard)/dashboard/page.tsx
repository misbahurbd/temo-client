import { DashboardHeader } from "@/components/shared/dashboard-header";
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
import { FolderKanban, CheckSquare, Users } from "lucide-react";
import { fetchMemberTask } from "@/features/teams/actions/fetch-member-task.action";
import { fetchTaskActivity } from "@/features/tasks/actions/fetch-task-activity.action";
import { format } from "date-fns";
import { fetchTaskAndProjectCount } from "@/features/tasks/actions/fetch-task-and-project-count.action";

const DashboardPage = async () => {
  const taskAndProjectCount = await fetchTaskAndProjectCount();
  const taskAndProjectCountData = taskAndProjectCount.success
    ? taskAndProjectCount.data
    : {
        taskCount: 0,
        projectCount: 0,
      };

  const memberTask = await fetchMemberTask();
  const memberTaskList = memberTask.success ? memberTask.data : [];

  const teamMemberList = memberTaskList.map((member) => ({
    id: member.id,
    name: member.name,
    currentTasks: member.tasksCount,
    capacity: member.capacity,
  }));

  const taskActivity = await fetchTaskActivity();
  const taskActivityList = taskActivity.success ? taskActivity.data : [];

  const recentReassignments = taskActivityList.slice(0, 5).map((activity) => ({
    id: activity.id,
    taskName: activity.task.name,
    fromMember: activity.assigneeFrom?.name || "Unknown",
    toMember: activity.assigneeTo.name,
    reassignedAt: activity.createdAt,
  }));

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
            <div className="text-3xl font-bold">
              {taskAndProjectCountData.projectCount}
            </div>
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
            <div className="text-3xl font-bold">
              {taskAndProjectCountData.taskCount}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Team Summary */}
      <Card className="border-none shadow-none drop-shadow-none p-0 gap-4 mt-8">
        <CardHeader className="px-0">
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
          </div>
        </CardHeader>
        <CardContent className="px-0">
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
                {teamMemberList.map((member) => {
                  const isOverloaded = member.currentTasks > member.capacity;
                  const utilization = Math.round(
                    (member.currentTasks / member.capacity) * 100
                  );

                  return (
                    <TableRow
                      key={member.id}
                      className={isOverloaded ? "bg-destructive/10" : ""}
                    >
                      <TableCell className="font-medium">
                        {member.name}
                      </TableCell>
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
                              style={{
                                width: `${Math.min(utilization, 100)}%`,
                              }}
                            />
                          </div>
                          <span
                            className={`text-sm ${
                              isOverloaded
                                ? "text-destructive font-semibold"
                                : ""
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
      <Card className="border-none shadow-none drop-shadow-none p-0 gap-4 mt-8">
        <CardHeader className="px-0">
          <CardTitle className="px-0">Recent Reassignments</CardTitle>
          <CardDescription>Last 5 moved tasks</CardDescription>
        </CardHeader>
        <CardContent className="px-0">
          <div className="border rounded-lg">
            <Table>
              <TableBody>
                {recentReassignments.length === 0 ? (
                  <TableRow>
                    <TableCell className="text-center py-12">
                      No recent reassignments
                    </TableCell>
                  </TableRow>
                ) : (
                  recentReassignments.map((reassignment) => (
                    <TableRow key={reassignment.id}>
                      <TableCell className="text-sm text-muted-foreground">
                        {reassignment.fromMember ? (
                          <>
                            <span className="text-foreground font-medium">
                              {format(
                                new Date(reassignment.reassignedAt),
                                "hh:mm a"
                              )}
                            </span>{" "}
                            -{" "}
                            <span className="text-foreground font-medium">
                              {reassignment.taskName}
                            </span>{" "}
                            reassigned from{" "}
                            <span className="text-foreground font-medium">
                              {reassignment.fromMember}
                            </span>{" "}
                            to{" "}
                            <span className="text-foreground font-medium">
                              {reassignment.toMember}
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="text-foreground font-medium">
                              {format(
                                new Date(reassignment.reassignedAt),
                                "hh:mm a"
                              )}
                            </span>{" "}
                            -{" "}
                            <span className="text-foreground font-medium">
                              {reassignment.taskName}
                            </span>{" "}
                            assigned to{" "}
                            <span className="text-foreground font-medium">
                              {reassignment.toMember}
                            </span>
                          </>
                        )}
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
