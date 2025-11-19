"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldError, FieldGroup } from "@/components/ui/field";
import {
  FormInput,
  FormSelect,
  FormTextarea,
} from "@/components/shared/form-fields";
import { Button } from "@/components/ui/button";
import { useEffect, useTransition } from "react";
import { fetchTeamSelectList } from "@/features/teams/actions/fetch-team-select-list.action";
import { toast } from "sonner";
import { SelectItem } from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { ArrowRightIcon, LoaderCircleIcon } from "lucide-react";
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useUpdateTaskModel } from "../../stores/use-update-task-modal";

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  teamId: z.string().min(1, { message: "Team is required" }),
  serverError: z.string().optional(),
});

export type UpdateTaskFormData = z.infer<typeof formSchema>;

export const UpdateTaskForm = () => {
  const [isSubmitting, startSubmitting] = useTransition();
  const { taskId } = useUpdateTaskModel();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: teamListData, isPending } = useQuery({
    queryKey: ["team-select-list"],
    queryFn: () => fetchTeamSelectList(),
    placeholderData: keepPreviousData,
  });

  const teamList = teamListData?.success ? teamListData.data : [];

  const form = useForm<UpdateTaskFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      teamId: "",
      serverError: undefined,
    },
  });

  const onSubmit = (data: UpdateTaskFormData) => {
    console.log(data);
    startSubmitting(async () => {
      if (!taskId) {
        toast.error("Task ID is required");
        return;
      }

      console.log(data);
    });
  };

  useEffect(() => {
    if (taskId) {
      // startTransitionUpdate(async () => {
      //   const response = await fetchTaskById(taskId);
      //   if (response.success) {
      //     form.reset(response.data);
      //   } else {
      //     toast.error(response.message || "An error occurred");
      //   }
      // });
    }
  }, [taskId, form]);

  if (isPending) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <LoaderCircleIcon className="size-4 animate-spin mr-2" />
        <span className="text-sm text-muted-foreground">
          Loading task data...
        </span>
      </div>
    );
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup className="gap-4">
        <FormInput
          name="name"
          label="Name"
          control={form.control}
          placeholder="Enter task name"
          required={true}
        />
        <FormTextarea
          name="description"
          label="Description"
          control={form.control}
          placeholder="Enter task description"
          required={true}
        />
        <FormSelect
          name="teamId"
          label="Project"
          control={form.control}
          placeholder="Select a team"
          required={true}
        >
          {teamList.map((team) => (
            <SelectItem key={team.id} value={team.id}>
              {team.name}
            </SelectItem>
          ))}
          {isPending && <SelectItem value="loading">Loading...</SelectItem>}
          {teamList.length === 0 && (
            <SelectItem value="no-teams">No teams found</SelectItem>
          )}
        </FormSelect>
        <Button
          type="submit"
          className="rounded-full cursor-pointer"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <LoaderCircleIcon className="w-4 h-4 animate-spin" />
          ) : (
            <span className="flex items-center gap-2">
              <span>Update Project</span>
              <ArrowRightIcon className="size-4" />
            </span>
          )}
        </Button>
        {form.formState.errors.serverError && (
          <FieldError errors={[form.formState.errors.serverError]} />
        )}
      </FieldGroup>
    </form>
  );
};
