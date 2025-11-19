"use client";

import { Controller, useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  FormDatePicker,
  FormInput,
  FormSelect,
  FormTextarea,
} from "@/components/shared/form-fields";
import { Button } from "@/components/ui/button";
import {
  startTransition,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { ArrowRightIcon, LoaderCircleIcon, SparklesIcon } from "lucide-react";
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useUpdateTaskModel } from "../../stores/use-update-task-modal";
import { TaskPriority, TaskStatus } from "../../types/task.type";
import { TASK_STATUS, TASK_PRIORITY } from "../../constant";
import { fetchProjectWithMembers } from "@/features/projects/actions/fetch-project-with-members.action";
import { ProjectMember } from "@/features/projects/types/project.type";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogCancel,
  AlertDialogFooter,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { fetchTaskById } from "../../actions/fetch-task-by-id.action";
import { updateTask } from "../../actions/update-task.action";

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  status: z.enum(TaskStatus),
  priority: z.enum(TaskPriority),
  dueDate: z.date().min(new Date(), { message: "Due date is required" }),
  assigneeId: z.string().nullable().optional(),
  projectId: z.string().min(1, { message: "Project ID is required" }),
  serverError: z.string().optional(),
});

export type UpdateTaskFormData = z.infer<typeof formSchema>;

export const UpdateTaskForm = () => {
  const [assigneeList, setAssigneeList] = useState<ProjectMember[]>([]);
  const [isSubmitting, startSubmitting] = useTransition();
  const [isPendingUpdate, startTransitionUpdate] = useTransition();
  const [member, setMember] = useState<ProjectMember | null>(null);
  const [showMemberCapacityModal, setShowMemberCapacityModal] =
    useState<boolean>(false);
  const { setIsOpen, taskId } = useUpdateTaskModel();
  const router = useRouter();
  const queryClient = useQueryClient();

  const form = useForm<UpdateTaskFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      status: TaskStatus.PENDING,
      priority: TaskPriority.LOW,
      dueDate: undefined,
      assigneeId: "",
      projectId: "",
      serverError: undefined,
    },
  });

  const { data: projectListData, isPending } = useQuery({
    queryKey: ["project-list-with-members"],
    queryFn: () => fetchProjectWithMembers(),
    placeholderData: keepPreviousData,
  });

  const projectList = useMemo(
    () => (projectListData?.success ? projectListData.data : []),
    [projectListData]
  );

  const selectedProjectId = useWatch({
    control: form.control,
    name: "projectId",
  });

  const onSubmit = (data: UpdateTaskFormData) => {
    startSubmitting(async () => {
      if (!taskId) {
        toast.error("Task ID is required");
        return;
      }

      const response = await updateTask(taskId, {
        name: data.name,
        description: data.description,
        status: data.status,
        priority: data.priority,
        dueDate: new Date(data.dueDate),
        assigneeId: data.assigneeId || null,
      });
      if (response.success) {
        toast.success(response.message || "Task updated successfully");
        form.reset();
        form.clearErrors();
        router.refresh();
        queryClient.invalidateQueries({ queryKey: ["tasks"] });
        queryClient.invalidateQueries({
          queryKey: ["project-list-with-members"],
        });
        queryClient.invalidateQueries({
          queryKey: ["task-list"],
        });
        setIsOpen(false);
      } else {
        toast.error(response.message || "An error occurred");
        form.setError("serverError", {
          message: response.message,
        });
      }
    });
  };

  const handleAutoAssign = () => {
    if (!selectedProjectId || assigneeList.length === 0) {
      return;
    }

    const bestAssignee = assigneeList.reduce((best, current) => {
      const bestAvailable = best.capacity - best.tasksCount;
      const currentAvailable = current.capacity - current.tasksCount;

      if (currentAvailable > bestAvailable) {
        return current;
      }

      if (
        currentAvailable === bestAvailable &&
        current.capacity > best.capacity
      ) {
        return current;
      }
      return best;
    });

    form.setValue("assigneeId", bestAssignee.id);
  };

  const handleOnAssigneeChange = (memberId: string) => {
    const member = assigneeList.find((assignee) => assignee.id === memberId);
    if (!member) {
      return;
    }
    if (member.tasksCount > member.capacity) {
      setMember(member);
      setShowMemberCapacityModal(true);
      return;
    }

    setMember(null);
    setShowMemberCapacityModal(false);
    form.setValue("assigneeId", memberId);
  };

  useEffect(() => {
    if (selectedProjectId) {
      const members =
        projectList.find((project) => project.id === selectedProjectId)
          ?.members || [];
      startTransition(() => {
        setAssigneeList(members);
      });
    }
  }, [selectedProjectId, projectList]);

  useEffect(() => {
    if (taskId) {
      startTransitionUpdate(async () => {
        const response = await fetchTaskById(taskId);
        if (response.success) {
          form.reset({
            name: response.data.name,
            description: response.data.description,
            status: response.data.status,
            priority: response.data.priority,
            dueDate: response.data.dueDate
              ? new Date(response.data.dueDate)
              : undefined,
            assigneeId: response.data.assigneeId,
            projectId: response.data.projectId,
          });
        } else {
          toast.error(response.message || "An error occurred");
          form.setError("serverError", {
            message: response.message,
          });
        }
      });
    }
  }, [taskId, startTransitionUpdate, form]);

  if (isPendingUpdate) {
    return (
      <div className="flex justify-center items-center h-full">
        <LoaderCircleIcon className="w-4 h-4 animate-spin" />
      </div>
    );
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup className="gap-4">
        <FormSelect
          name="projectId"
          label="Project"
          control={form.control}
          placeholder="Select a project"
          required={true}
          disabled={true}
          description="You can't change the project after creating the task"
        >
          {isPending && <SelectItem value="loading">Loading...</SelectItem>}
          {projectList.length === 0 && (
            <SelectItem value="no-projects">No projects found</SelectItem>
          )}
          {projectList.map((project) => (
            <SelectItem key={project.id} value={project.id}>
              {project.name}
            </SelectItem>
          ))}
        </FormSelect>
        <FormInput
          name="name"
          label="Name"
          control={form.control}
          placeholder="Enter task name"
          required={true}
          disabled={!selectedProjectId}
        />
        <FormTextarea
          name="description"
          label="Description"
          control={form.control}
          placeholder="Enter task description"
          required={true}
          disabled={!selectedProjectId}
        />

        <div className="flex flex-col *:flex-1 sm:flex-row gap-4">
          <FormDatePicker
            name="dueDate"
            label="Due Date"
            control={form.control}
            placeholder="Select a due date"
            required={true}
            disabled={!selectedProjectId}
          />
          <div className="flex items-center gap-2 min-w-0 max-w-full">
            <Controller
              control={form.control}
              name="assigneeId"
              render={({ field, fieldState }) => (
                <Field className="flex-1 min-w-0">
                  <FieldLabel>Assignee</FieldLabel>
                  <FieldContent>
                    <Select
                      value={field.value || undefined}
                      onValueChange={(value) => handleOnAssigneeChange(value)}
                      disabled={!selectedProjectId}
                    >
                      <SelectTrigger className="w-full truncate">
                        <SelectValue placeholder="Select an assignee" />
                      </SelectTrigger>
                      <SelectContent>
                        {isPending && (
                          <SelectItem value="loading">Loading...</SelectItem>
                        )}
                        {assigneeList.length === 0 && (
                          <SelectItem value="no-assignees">
                            No assignees found
                          </SelectItem>
                        )}
                        {assigneeList.map((assignee) => (
                          <SelectItem key={assignee.id} value={assignee.id}>
                            {assignee.name}{" "}
                            <Badge
                              variant={
                                assignee.tasksCount >= assignee.capacity
                                  ? "destructive"
                                  : "default"
                              }
                              className="text-[10px] px-1 py-0.5"
                            >
                              ({assignee.tasksCount}/{assignee.capacity})
                            </Badge>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FieldContent>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Tooltip>
              <TooltipTrigger asChild className="shrink-0">
                <Button
                  type="button"
                  onClick={handleAutoAssign}
                  variant="outline"
                  size="icon"
                  className="cursor-pointer mt-8"
                  disabled={!selectedProjectId}
                >
                  <SparklesIcon className="size-4" />
                  <span className="sr-only">
                    Auto assign to the best assignee
                  </span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" align="end">
                <p className="text-xs">Auto assign to the best assignee</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormSelect
            name="status"
            label="Status"
            control={form.control}
            placeholder="Select a status"
            required={true}
            disabled={!selectedProjectId}
          >
            {TASK_STATUS.map((status) => (
              <SelectItem key={status.value} value={status.value}>
                {status.label}
              </SelectItem>
            ))}
          </FormSelect>
          <FormSelect
            name="priority"
            label="Priority"
            control={form.control}
            placeholder="Select a priority"
            required={true}
            disabled={!selectedProjectId}
          >
            {TASK_PRIORITY.map((priority) => (
              <SelectItem key={priority.value} value={priority.value}>
                {priority.label}
              </SelectItem>
            ))}
          </FormSelect>
        </div>

        <Button
          type="submit"
          className="rounded-full cursor-pointer"
          disabled={isSubmitting || !selectedProjectId || !taskId}
        >
          {isSubmitting ? (
            <LoaderCircleIcon className="w-4 h-4 animate-spin" />
          ) : (
            <span className="flex items-center gap-2">
              <span>Update Task</span>
              <ArrowRightIcon className="size-4" />
            </span>
          )}
        </Button>
        {form.formState.errors.serverError && (
          <FieldError errors={[form.formState.errors.serverError]} />
        )}
      </FieldGroup>
      <MemberCapacityModal
        member={member}
        isOpen={showMemberCapacityModal}
        onOpenChange={setShowMemberCapacityModal}
        onAssign={(memberId) => {
          form.setValue("assigneeId", memberId, {
            shouldValidate: true,
            shouldDirty: true,
            shouldTouch: true,
          });
          setShowMemberCapacityModal(false);
          setMember(null);
        }}
      />
    </form>
  );
};

const MemberCapacityModal = ({
  member,
  isOpen,
  onOpenChange,
  onAssign,
}: {
  member: ProjectMember | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAssign: (memberId: string) => void;
}) => {
  if (!member) {
    return null;
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Member Capacity</AlertDialogTitle>
          <AlertDialogDescription>
            <span className="font-semibold">{member.name}</span> already has{" "}
            <span className="font-semibold">{member.tasksCount}</span>{" "}
            {member.tasksCount === 1 ? "task" : "tasks"}
            assigned to them but their capacity is{" "}
            <span className="font-semibold">{member.capacity}</span>. Assign
            this task anyway?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            className="cursor-pointer"
            onClick={() => onOpenChange(false)}
          >
            Choose Another
          </AlertDialogCancel>
          <AlertDialogAction
            className="cursor-pointer"
            onClick={() => onAssign(member.id)}
          >
            Assign Anyway
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
