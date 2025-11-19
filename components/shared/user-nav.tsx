"use client";

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { toast } from "sonner";
import { usePathname, useRouter } from "next/navigation";
import { logout } from "@/features/auth/actions/logout.action";
import { useEffect, useState, useTransition } from "react";
import { User } from "@/features/auth/types/user.type";
import { getCurrentUser } from "@/features/auth/actions/current-user.action";

export function UserNav() {
  const { isMobile } = useSidebar();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    startTransition(async () => {
      const response = await getCurrentUser();
      if (response.success) {
        setUser(response.data);
      } else {
        toast.error(response.message || "An error occurred");
      }
    });
  }, [startTransition]);

  const onLogout = async () => {
    startTransition(async () => {
      const response = await logout();
      if (response.success) {
        toast.success(response.message || "Logout successful");
        const loginUrl = new URL("/auth/login", window.location.href);
        loginUrl.searchParams.set("redirect", pathname);
        router.push(loginUrl.toString());
      } else {
        toast.error(response.message || "An error occurred");
      }
    });
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarFallback className="rounded-lg">
                  {user && (
                    <>
                      <AvatarImage
                        src={user?.photo}
                        alt={user?.firstName + user?.lastName}
                      />
                      <AvatarFallback className="rounded-lg">
                        {user?.firstName.charAt(0) + user?.lastName.charAt(0)}
                      </AvatarFallback>
                    </>
                  )}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {user?.firstName} {user?.lastName}
                </span>
                <span className="truncate text-xs">{user?.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "top" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  {user && (
                    <>
                      <AvatarImage
                        src={user?.photo}
                        alt={user?.firstName + user?.lastName}
                      />
                      <AvatarFallback className="rounded-lg">
                        {user?.firstName.charAt(0) + user?.lastName.charAt(0)}
                      </AvatarFallback>
                    </>
                  )}
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    {user?.firstName} {user?.lastName}
                  </span>
                  <span className="truncate text-xs">{user?.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem className="cursor-pointer">
                <BadgeCheck />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <CreditCard />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Bell />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={onLogout}
              disabled={isPending}
            >
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
