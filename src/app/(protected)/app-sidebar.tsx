"use client";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import useProject from "@/hooks/use-project";
import { cn } from "@/lib/utils";
import {
  BotMessageSquare,
  CreditCardIcon,
  LayoutDashboardIcon,
  Plus,
  PresentationIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboardIcon,
  },
  {
    title: "Q&A",
    url: "/qa",
    icon: BotMessageSquare,
  },
  // {
  //   title: "Meetings",
  //   url: "/meetings",
  //   icon: PresentationIcon,
  // },
  {
    title: "Billing",
    url: "/billing",
    icon: CreditCardIcon,
  },
];

const projects = [
  {
    title: "Project 1",
    url: "/project-1",
  },
  {
    title: "Project 2",
    url: "/project-2",
  },
  {
    title: "Project 3",
    url: "/project-3",
  },
  {
    title: "Project 4",
    url: "/project-4",
  },
];

export function AppSidebar() {
  // Get the current pathname.
  const pathName = usePathname();
  const { open } = useSidebar();
  const { projects, projectId, setProjectId } = useProject();

  return (
    <Sidebar variant="floating" collapsible="icon" className="">
      <SidebarHeader>
        <div
          className={cn(
            "flex items-center gap-3",
            open ? "flex-row p-4" : "flex-col p-3",
          )}
        >
          <div className="flex items-center gap-3">
            <LayoutDashboardIcon className="rounded bg-primary text-white" />
            {open && <span className="text-lg font-bold">Dashboard</span>}
          </div>
          <SidebarTrigger />
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a
                      href={item.url}
                      className={cn(
                        {
                          "!bg-primary !text-white": pathName === item.url,
                        },
                        "list-none",
                      )}
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Projects</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {projects &&
                projects.map((project) => (
                  <SidebarMenuItem key={project.id}>
                    <div className="">
                      <SidebarMenuButton asChild>
                        <a
                          // href={`/project/${project.id}`}
                          className={cn(
                            {
                              "!bg-primary !text-white":
                                projectId === project.id,
                            },
                            "cursor-pointer list-none",
                          )}
                          onClick={() => setProjectId(project.id)}
                        >
                          <div className="flex size-6 items-center justify-center rounded bg-primary text-white">
                            {project.name[0].toUpperCase()}
                          </div>
                          {open && <span>{project.name}</span>}
                        </a>
                      </SidebarMenuButton>
                    </div>
                  </SidebarMenuItem>
                ))}

              <div className="h-2"></div>

              <SidebarMenuItem>
                <Link href="/create">
                  <Button variant="outline" className="w-full" size="sm">
                    <Plus />
                    {open && <span>Create Project</span>}
                  </Button>
                </Link>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
