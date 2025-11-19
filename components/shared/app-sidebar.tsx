"use client";

import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
} from "../ui/sidebar";
import Image from "next/image";
import {
  ActivityIcon,
  ClockIcon,
  FolderIcon,
  HomeIcon,
  PlusIcon,
  SettingsIcon,
  UsersIcon,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { UserNav } from "./user-nav";
import { useEffect, useState, useTransition } from "react";
import { Project } from "@/features/projects/types/project.type";
import { fetchProjectsList } from "@/features/projects/actions/fetch-projects-list";
import { toast } from "sonner";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { Button } from "../ui/button";
import { useCreateProjectModel } from "@/features/projects/stores/use-create-project-model";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export const AppSidebar = () => {
  const pathname = usePathname();
  const { setIsOpen } = useCreateProjectModel();

  const { data: projects, isPending } = useQuery({
    queryKey: ["projects"],
    queryFn: () => fetchProjectsList({ page: 1, limit: 10 }),
    placeholderData: keepPreviousData,
  });

  const projectsList = projects?.success ? projects.data : [];

  const navItems = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: HomeIcon,
    },
    {
      label: "Projects",
      href: "/projects",
      icon: FolderIcon,
      children: projectsList.map((project) => ({
        id: project.id,
        label: project.name,
        href: `/projects/${project.id}`,
      })),
    },
    {
      label: "Teams",
      href: "/teams",
      icon: UsersIcon,
    },
    {
      label: "Tasks",
      href: "/tasks",
      icon: ClockIcon,
    },
    {
      label: "Activity Log",
      href: "/activity",
      icon: ActivityIcon,
    },
    {
      label: "Settings",
      href: "/settings",
      icon: SettingsIcon,
    },
  ];

  return (
    <Sidebar variant="floating" collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              asChild
              className="md:h-8 md:p-0 hover:bg-transparent"
            >
              <Link href="/dashboard">
                <div className="text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg bg-none">
                  <Image
                    src="/images/logo.png"
                    alt="logo"
                    width={32}
                    height={32}
                  />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Temo</span>
                  <span className="truncate text-xs">Dashboard</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                if (item.children) {
                  return (
                    <Collapsible
                      key={item.href}
                      defaultOpen
                      className="group/collapsible"
                    >
                      <div className="flex items-center gap-2">
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton
                            tooltip={item.label}
                            className="cursor-pointer"
                            isActive={
                              pathname === item.href ||
                              pathname.startsWith(item.href)
                            }
                          >
                            <item.icon className="size-4" />
                            <span className="truncate">{item.label}</span>
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        {item.label === "Projects" && (
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            className="cursor-pointer group-data-[state=collapsed]:hidden"
                            onClick={() => setIsOpen(true)}
                          >
                            <PlusIcon className="size-4" />
                            <span className="sr-only">Add Project</span>
                          </Button>
                        )}
                      </div>

                      <CollapsibleContent>
                        <SidebarMenuSub className="max-h-[200px] overflow-y-auto">
                          {isPending && (
                            <>
                              {Array.from({ length: 4 }).map((_, index) => (
                                <SidebarMenuSkeleton key={index} />
                              ))}
                            </>
                          )}

                          {!isPending && projectsList.length > 0 && (
                            <>
                              {item.children.map((child) => (
                                <SidebarMenuItem key={child.href}>
                                  <SidebarMenuButton
                                    tooltip={child.label}
                                    className="cursor-pointer"
                                    asChild
                                  >
                                    <Link href={child.href}>
                                      <span className="truncate">
                                        {child.label}
                                      </span>
                                    </Link>
                                  </SidebarMenuButton>
                                </SidebarMenuItem>
                              ))}
                              <SidebarMenuItem>
                                <SidebarMenuButton
                                  tooltip="View All Projects"
                                  className="cursor-pointer"
                                  asChild
                                >
                                  <Link href="/projects">
                                    <span className="truncate">View All</span>
                                  </Link>
                                </SidebarMenuButton>
                              </SidebarMenuItem>
                            </>
                          )}

                          {!isPending && projectsList.length === 0 && (
                            <SidebarMenuItem>
                              <SidebarMenuButton
                                tooltip="No projects found"
                                className="cursor-pointer"
                              >
                                <span className="truncate text-muted-foreground">
                                  No projects found
                                </span>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                          )}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </Collapsible>
                  );
                }

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      tooltip={item.label}
                      className="cursor-pointer"
                      asChild
                      isActive={pathname === item.href}
                    >
                      <Link href={item.href}>
                        <item.icon className="size-4" />
                        <span className="truncate">{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <UserNav />
      </SidebarFooter>
    </Sidebar>
  );
};
