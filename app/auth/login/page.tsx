import { LoginForm } from "@/features/auth/components/form/login-form";

const LoginPage = () => {
  return (
    <div className="flex items-center justify-center h-screen p-4">
      <div className="hidden lg:block w-1/2 bg-linear-to-t from-primary to-primary/50 h-full rounded-lg"></div>
      <div className="w-full lg:w-1/2 px-20 py-24 flex flex-col gap-8">
        <h2 className="text-2xl font-bold text-center">LOGO</h2>

        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
