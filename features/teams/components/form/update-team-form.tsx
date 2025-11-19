"use client";

import { FormInput, FormTextarea } from "@/components/shared/form-fields";
import { Button } from "@/components/ui/button";
import { FieldError, FieldGroup } from "@/components/ui/field";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState, useTransition } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import z from "zod";
import {
  ArrowRightIcon,
  LoaderCircleIcon,
  PlusIcon,
  TrashIcon,
} from "lucide-react";
import { toast } from "sonner";
import { useUpdateTeamModel } from "../../stores/use-update-team-model";
import { fetchTeamById } from "../../actions/fetch-team-by-id.action";
import { updateTeamById } from "../../actions/update-team-by-id.action";
import { useRouter } from "next/navigation";

const memberSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, { message: "Name is required" }),
  role: z.string().min(1, { message: "Role is required" }),
  capacity: z
    .union([
      z.string().min(1, { message: "Capacity is required" }),
      z.number().min(1, { message: "Capacity is required" }),
    ])
    .transform((val) => (isNaN(Number(val)) ? val : Number(val))),
});

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  members: z.array(memberSchema).min(1, { message: "Add at least one member" }),
  serverError: z.string().optional(),
});

export type UpdateTeamFormData = z.infer<typeof formSchema>;

export const UpdateTeamForm = () => {
  const [showMemberForm, setShowMemberForm] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();
  const [isPendingUpdate, startTransitionUpdate] = useTransition();
  const { setIsOpen, teamId } = useUpdateTeamModel();
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      members: [],
      serverError: undefined,
    },
  });

  const memberForm = useForm<z.infer<typeof memberSchema>>({
    resolver: zodResolver(memberSchema),
    defaultValues: {
      id: undefined,
      name: "",
      role: "",
      capacity: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "members",
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    if (!teamId) {
      toast.error("Team ID is required");
      return;
    }

    startTransition(async () => {
      const response = await updateTeamById(teamId, data);

      if (response.success) {
        toast.success(response.message || "Team updated successfully");
        form.reset();
        form.clearErrors();
        setShowMemberForm(false);
        setIsOpen(false);
        router.refresh();
      } else {
        toast.error(response.message || "An error occurred");
        form.setError("serverError", {
          message: response.message,
        });
      }
    });
  };

  useEffect(() => {
    if (teamId) {
      startTransitionUpdate(async () => {
        const response = await fetchTeamById(teamId);
        if (response.success) {
          form.reset(response.data);
        } else {
          toast.error(response.message || "An error occurred");
          form.setError("serverError", {
            message: response.message,
          });
        }
      });
    }
  }, [teamId, startTransitionUpdate, form]);

  if (isPendingUpdate) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <LoaderCircleIcon className="size-4 animate-spin mr-2" />
        <span className="text-sm text-muted-foreground">
          Loading team data...
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
          placeholder="Enter team name"
          required={true}
        />
        <FormTextarea
          name="description"
          label="Description"
          control={form.control}
          placeholder="Enter team description"
          required={true}
        />
        <FieldGroup className="gap-2 w-full p-3 bg-muted rounded-md">
          <div className="flex items-center justify-between gap-2 w-full border-b border-border pb-2">
            <span>Members</span>
            {!showMemberForm && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="rounded-full cursor-pointer"
                onClick={() => setShowMemberForm(true)}
              >
                <PlusIcon className="size-4" />
                Add Member
              </Button>
            )}
          </div>

          <FieldGroup className="gap-0">
            {fields.length === 0 ? (
              <div className="text-sm text-center text-muted-foreground">
                No team members added
              </div>
            ) : (
              <div>
                <div className="grid grid-cols-[3fr_2fr_1.5fr_40px] gap-4 items-center py-2 border-b border-border">
                  <div className="col-span-1 font-medium text-sm">Name</div>
                  <div className="col-span-1 font-medium text-sm">Role</div>
                  <div className="col-span-1 font-medium text-sm">Capacity</div>
                  <div className="col-span-1 font-medium text-sm"></div>
                </div>

                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="grid grid-cols-[3fr_2fr_1.5fr_40px] gap-4 items-center py-1 not-last:border-b not-last:border-border"
                  >
                    <div className="col-span-1 text-sm">{field.name}</div>
                    <div className="col-span-1 text-sm">{field.role}</div>
                    <div className="col-span-1 text-sm">{field.capacity}</div>
                    <div className="col-span-1">
                      <Button
                        type="button"
                        size="icon"
                        variant="destructive"
                        className="rounded-full size-8 cursor-pointer text-destructive bg-transparent hover:text-white hover:bg-destructive"
                        onClick={() => remove(index)}
                      >
                        <TrashIcon className="size-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {form.formState.errors.members && (
              <FieldError errors={[form.formState.errors.members]} />
            )}
          </FieldGroup>

          {showMemberForm && (
            <div>
              <FieldGroup className="gap-4">
                <FormInput
                  name="name"
                  label="Name"
                  control={memberForm.control}
                  placeholder="Enter member name"
                  required={true}
                />
                <div className="flex gap-4">
                  <FormInput
                    name="role"
                    label="Role"
                    control={memberForm.control}
                    placeholder="Enter member role"
                    required={true}
                  />
                  <FormInput
                    name="capacity"
                    label="Capacity"
                    control={memberForm.control}
                    placeholder="Enter member capacity"
                    required={true}
                  />
                </div>
              </FieldGroup>

              <div className="grid grid-cols-1 items-center gap-2 mt-4">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="cursor-pointer"
                  onClick={memberForm.handleSubmit((data) => {
                    append(data);
                    memberForm.reset();
                    memberForm.clearErrors();
                    memberForm.setFocus("name");
                    setShowMemberForm(false);
                  })}
                >
                  <PlusIcon className="size-4" />
                  Add Member
                </Button>
              </div>
            </div>
          )}
        </FieldGroup>
        <Button
          type="submit"
          className="rounded-full cursor-pointer"
          disabled={isPending}
        >
          {isPending ? (
            <LoaderCircleIcon className="size-4 animate-spin" />
          ) : (
            <span className="flex items-center gap-2">
              <span>Update Team</span>
              <ArrowRightIcon className="size-4" />
            </span>
          )}
        </Button>
      </FieldGroup>
    </form>
  );
};
