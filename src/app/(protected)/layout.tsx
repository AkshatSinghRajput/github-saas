import { SidebarProvider } from "@/components/ui/sidebar";
import { UserButton } from "@clerk/nextjs";
import React from "react";
import { AppSidebar } from "./app-sidebar";

type Props = {
  children: React.ReactNode;
};

const Layout = ({ children }: Props) => {
  return (
    <SidebarProvider>
      <AppSidebar></AppSidebar>
      <main className="m-2 w-full">
        <div className="flex items-center gap-2 rounded-md bg-sidebar pb-2 shadow">
          <div className="ml-auto"> </div>
          <UserButton />
        </div>
        <div className="h-4"></div>
        <div className="h-[calc(100vh-6rem)] overflow-y-scroll rounded-md bg-sidebar shadow">
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
};

export default Layout;
