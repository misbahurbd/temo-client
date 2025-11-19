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
import { useEffect, useState, useTransition } from "react";
import {
  fetchTeamSelectList,
  TeamSelectList,
} from "@/features/teams/actions/fetch-team-select-list.action";
import { toast } from "sonner";
import { SelectItem } from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { ArrowRightIcon, LoaderCircleIcon } from "lucide-react";
import { useUpdateProjectModel } from "../../stores/use-update-project-model";
import { updateProject } from "../../actions/update-project.action";
import { fetchProjectById } from "../../actions/fetch-project-by-id.action";

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  teamId: z.string().min(1, { message: "Team is required" }),
  serverError: z.string().optional(),
});

export type UpdateProjectFormData = z.infer<typeof formSchema>;

export const UpdateProjectForm = () => {
  const [teamList, setTeamlist] = useState<TeamSelectList[]>([]);
  const [isPending, startTransition] = useTransition();
  const [isSubmitting, startSubmitting] = useTransition();
  const [isPendingUpdate, startTransitionUpdate] = useTransition();
  const { setIsOpen, triggerRefresh, projectId } = useUpdateProjectModel();
  const router = useRouter();

  const form = useForm<UpdateProjectFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      teamId: "",
      serverError: undefined,
    },
  });

  const onSubmit = (data: UpdateProjectFormData) => {
    console.log(data);
    startSubmitting(async () => {
      if (!projectId) {
        toast.error("Project ID is required");
        return;
      }

      const response = await updateProject(projectId, data);
      if (response.success) {
        toast.success(response.message || "Project updated successfully");
        form.reset();
        form.clearErrors();
        router.refresh();
        triggerRefresh();
        setIsOpen(false);
      } else {
        toast.error(response.message || "An error occurred");
        form.setError("serverError", {
          message: response.message,
        });
      }
    });
  };

  useEffect(() => {
    startTransition(async () => {
      const response = await fetchTeamSelectList();
      if (response.success) {
        setTeamlist(response.data);
      } else {
        toast.error(response.message || "An error occurred");
      }
    });
  }, []);

  useEffect(() => {
    if (projectId) {
      startTransitionUpdate(async () => {
        const response = await fetchProjectById(projectId);
        if (response.success) {
          form.reset(response.data);
        } else {
          toast.error(response.message || "An error occurred");
        }
      });
    }
  }, [projectId, form]);

  if (isPendingUpdate) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <LoaderCircleIcon className="size-4 animate-spin mr-2" />
        <span className="text-sm text-muted-foreground">
          Loading project data...
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
          placeholder="Enter project name"
          required={true}
        />
        <FormTextarea
          name="description"
          label="Description"
          control={form.control}
          placeholder="Enter project description"
          required={true}
        />
        <FormSelect
          name="teamId"
          label="Team"
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
