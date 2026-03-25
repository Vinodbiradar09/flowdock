import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar.client";
import { getSession } from "@/lib/auth/client/get-session";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Flowdock",
  description: "Manage your tasks, track progress and gain insights",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar
          user={{
            name: session.user.name ?? "User",
            email: session.user.email,
            image: session.user.image ?? null,
          }}
        />
        <SidebarInset className="flex flex-col flex-1 min-w-0">
          {children}
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
