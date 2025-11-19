"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  AlertCircleIcon,
  ArrowRightIcon,
  LockIcon,
  MailIcon,
  UserIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useRouter, useSearchParams } from "next/navigation";
import { register } from "../../actions/register.action";
import { toast } from "sonner";
import { FormInput } from "@/components/shared/form-fields";
import { FieldGroup } from "@/components/ui/field";

const registerSchema = z
  .object({
    firstName: z.string().min(1, { message: "First name is required" }),
    lastName: z.string().min(1, { message: "Last name is required" }),
    email: z.email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" }),
    confirmPassword: z.string().min(8, {
      message: "Confirm password must be at least 8 characters long",
    }),
    serverError: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const RegisterForm = () => {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");
  const router = useRouter();
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      serverError: undefined,
    },
  });

  const onSubmit = async (data: z.infer<typeof registerSchema>) => {
    const response = await register(
      data.firstName,
      data.lastName,
      data.email,
      data.password
    );
    if (response.success) {
      toast.success(response.message || "Register successful");
      if (redirect) {
        router.push(redirect);
      } else {
        router.push("/");
      }
    } else {
      toast.error(response.message || "An error occurred");
      form.setError("root.serverError", {
        message: response.message,
      });
    }
  };

  return (
    <div className="space-y-4 p-8 border rounded-sm bg-white w-full max-w-md mx-auto">
      <h3 className="text-2xl font-bold text-center mb-2">Register</h3>
      <p className="text-sm text-center text-muted-foreground">
        Please enter your details to Register
      </p>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup className="gap-5">
          <div className="flex gap-5">
            <FormInput
              name="firstName"
              label="First Name"
              required={true}
              control={form.control}
              placeholder="Enter your first name"
              renderField={({ field, fieldState }) => (
                <InputGroup>
                  <InputGroupInput
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter your first name"
                    autoComplete="off"
                    type="text"
                  />
                  <InputGroupAddon align="inline-start">
                    <UserIcon />
                  </InputGroupAddon>
                </InputGroup>
              )}
            />
            <FormInput
              name="lastName"
              label="Last Name"
              required={true}
              control={form.control}
              placeholder="Enter your last name"
              renderField={({ field, fieldState }) => (
                <InputGroup>
                  <InputGroupInput
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter your last name"
                    autoComplete="off"
                    type="text"
                  />
                  <InputGroupAddon align="inline-start">
                    <UserIcon />
                  </InputGroupAddon>
                </InputGroup>
              )}
            />
          </div>

          <FormInput
            name="email"
            label="Email"
            required={true}
            control={form.control}
            placeholder="Enter your email"
            renderField={({ field, fieldState }) => (
              <InputGroup>
                <InputGroupInput
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  placeholder="Enter your email"
                  autoComplete="off"
                  type="email"
                />
                <InputGroupAddon align="inline-start">
                  <MailIcon />
                </InputGroupAddon>
              </InputGroup>
            )}
          />

          <FormInput
            name="password"
            label="Password"
            required={true}
            control={form.control}
            placeholder="Enter your password"
            renderField={({ field, fieldState }) => (
              <InputGroup>
                <InputGroupInput
                  {...field}
                  id={field.name}
                  type="password"
                  aria-invalid={fieldState.invalid}
                  placeholder="Enter your password"
                  autoComplete="off"
                />
                <InputGroupAddon align="inline-start">
                  <LockIcon />
                </InputGroupAddon>
              </InputGroup>
            )}
          />

          <FormInput
            name="confirmPassword"
            label="Confirm Password"
            required={true}
            control={form.control}
            renderField={({ field, fieldState }) => (
              <InputGroup>
                <InputGroupInput
                  {...field}
                  id={field.name}
                  type="password"
                  aria-invalid={fieldState.invalid}
                  placeholder="Confirm your password"
                  autoComplete="off"
                />
                <InputGroupAddon align="inline-start">
                  <LockIcon />
                </InputGroupAddon>
              </InputGroup>
            )}
          />
        </FieldGroup>

        {form.formState.errors.root?.serverError && (
          <Alert
            variant="destructive"
            className="mt-4 bg-destructive/10 border-destructive/20"
          >
            <AlertCircleIcon className="size-4" />
            <AlertTitle className="text-destructive font-medium">
              Register failed
            </AlertTitle>
            <AlertDescription className="text-destructive">
              {form.formState.errors.root.serverError.message ||
                "An error occurred"}
            </AlertDescription>
          </Alert>
        )}

        <Button type="submit" className="w-full mt-4 cursor-pointer">
          <span className="flex items-center gap-2">
            <span>Register</span>
            <ArrowRightIcon />
          </span>
        </Button>
      </form>
      <p className="text-sm text-center text-muted-foreground mt-4">
        Already have an account?{" "}
        <Link
          href={
            redirect
              ? `/auth/login?redirect=${encodeURIComponent(redirect)}`
              : "/auth/login"
          }
          className="text-primary"
        >
          Login
        </Link>
      </p>
    </div>
  );
};
