"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldError, FieldGroup } from "@/components/ui/field";
import { FormInput, FormTextarea } from "@/components/shared/form-fields";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  serverError: z.string().optional(),
});

export type CreateProjectFormData = z.infer<typeof formSchema>;

export const CreateProjectForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      serverError: undefined,
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log(data);
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
        <Button type="submit">Create Project</Button>
        {form.formState.errors.serverError && (
          <FieldError errors={[form.formState.errors.serverError]} />
        )}
      </FieldGroup>
    </form>
  );
};
