import { Suspense } from "react";
import { RegisterForm } from "@/features/auth/components/form/register-form";
import { Logo } from "@/components/shared/logo";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register",
  description: "Register a new account",
};

const RegisterPage = () => {
  return (
    <div className="flex items-center justify-center h-screen p-4">
      <div className="hidden lg:block w-1/2 bg-linear-to-t from-primary to-primary/50 h-full rounded-lg"></div>
      <div className="w-full lg:w-1/2 px-20 py-24 flex flex-col gap-8">
        <div className="flex items-center justify-center">
          <Logo />
        </div>

        <Suspense fallback={<div>Loading...</div>}>
          <RegisterForm />
        </Suspense>
      </div>
    </div>
  );
};

export default RegisterPage;
