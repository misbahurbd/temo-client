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
import { createProject } from "../../actions/create-project.action";
import { useCreateProjectModel } from "../../stores/use-create-project-model";
import { useRouter } from "next/navigation";
import { ArrowRightIcon, LoaderCircleIcon } from "lucide-react";
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  teamId: z.string().min(1, { message: "Team is required" }),
  serverError: z.string().optional(),
});

export type CreateProjectFormData = z.infer<typeof formSchema>;

export const CreateProjectForm = () => {
  const [isSubmitting, startSubmitting] = useTransition();
  const { setIsOpen } = useCreateProjectModel();
  const router = useRouter();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      teamId: "",
      serverError: undefined,
    },
  });

  const { data: teamListData, isPending } = useQuery({
    queryKey: ["team-select-list"],
    queryFn: () => fetchTeamSelectList(),
    placeholderData: keepPreviousData,
  });

  const teamList = teamListData?.success ? teamListData.data : [];

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log(data);
    startSubmitting(async () => {
      const response = await createProject(data);
      if (response.success) {
        toast.success(response.message || "Project created successfully");
        form.reset();
        form.clearErrors();
        router.refresh();
        queryClient.invalidateQueries({ queryKey: ["projects"] });
        setIsOpen(false);
      } else {
        toast.error(response.message || "An error occurred");
      }
    });
  };

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
              <span>Create Project</span>
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
