"use client";
import { SquaresFour, CheckSquare } from "@phosphor-icons/react";
import { SidebarUser } from "./sidebar-user.client";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import Link from "next/link";

type AppSidebarProps = {
  user: {
    name: string;
    email: string;
    image: string | null;
  };
};

const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: SquaresFour,
    description: "Analytics and overview",
  },
  {
    label: "Tasks",
    href: "/tasks",
    icon: CheckSquare,
    description: "Manage your tasks",
  },
];

export function AppSidebar({ user }: AppSidebarProps) {
  const pathname = usePathname();

  return (
    <Sidebar className="border-r border-border">
      <SidebarHeader className="border-b border-border px-4 py-4">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 shrink-0" />
          <div className="flex flex-col">
            <span className="text-sm font-mono font-medium tracking-tight text-foreground">
              FLOWDOCK
            </span>
            <span className="text-xs font-mono text-muted-foreground">
              Task tracking platform
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="px-2 mb-1 text-xs font-mono uppercase tracking-widest text-muted-foreground">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      className={cn(
                        "rounded-none h-10 px-3 font-mono text-sm transition-colors",
                        isActive
                          ? "bg-foreground text-background hover:bg-foreground hover:text-background"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted",
                      )}
                    >
                      <Link href={item.href}>
                        <Icon
                          size={16}
                          weight={isActive ? "fill" : "regular"}
                        />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-4">
          <SidebarGroupLabel className="px-2 mb-1 text-xs font-mono uppercase tracking-widest text-muted-foreground">
            Workspace
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="mx-2 border border-border p-3 flex flex-col gap-1">
              <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
                Status
              </p>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-green-500 shrink-0" />
                <p className="text-xs font-mono text-foreground">
                  All systems operational
                </p>
              </div>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border p-2">
        <SidebarUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
