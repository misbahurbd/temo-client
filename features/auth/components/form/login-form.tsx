"use client";

import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { login } from "../../actions/login.action";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FormCheckbox, FormInput } from "@/components/shared/form-fields";

const loginSchema = z.object({
  email: z.email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),
  remember: z.boolean().optional(),
  serverError: z.string().optional(),
});

export const LoginForm = () => {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");
  const router = useRouter();
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: false,
      serverError: undefined,
    },
  });

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    const response = await login(data.email, data.password);
    if (response.success) {
      toast.success(response.message || "Login successful");
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
      <h3 className="text-2xl font-bold text-center mb-2">Login</h3>
      <p className="text-sm text-center text-muted-foreground">
        Please enter your details to Login
      </p>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup className="gap-5">
          <FormInput
            name="email"
            label="Email"
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

          <div className="flex items-center justify-between">
            <FormCheckbox
              name="remember"
              label="Remember me"
              control={form.control}
              className="w-max"
            />

            <Link href="/forgot-password" className="text-sm text-primary">
              Forgot password?
            </Link>
          </div>
        </FieldGroup>

        {form.formState.errors.root?.serverError && (
          <Alert
            variant="destructive"
            className="mt-4 bg-destructive/10 border-destructive/20"
          >
            <AlertCircleIcon className="size-4" />
            <AlertTitle className="text-destructive font-medium">
              Login failed
            </AlertTitle>
            <AlertDescription className="text-destructive">
              {form.formState.errors.root.serverError.message ||
                "An error occurred"}
            </AlertDescription>
          </Alert>
        )}

        <Button type="submit" className="w-full mt-4 cursor-pointer">
          <span className="flex items-center gap-2">
            <span>Login</span>
            <ArrowRightIcon />
          </span>
        </Button>
      </form>
      <p className="text-sm text-center text-muted-foreground mt-4">
        Don&apos;t have an account?{" "}
        <Link
          href={
            redirect
              ? `/auth/register?redirect=${encodeURIComponent(redirect)}`
              : "/auth/register"
          }
          className="text-primary"
        >
          Register
        </Link>
      </p>
    </div>
  );
};
