import { SidebarTrigger } from "../ui/sidebar";

export const DashboardHeader = ({ title }: { title: string }) => {
  return (
    <div className="flex items-center gap-4">
      <SidebarTrigger className="size-10 rounded-full border cursor-pointer border-gray-200 [&_svg]:size-5" />
      <h1 className="text-2xl font-bold">{title}</h1>
    </div>
  );
};
