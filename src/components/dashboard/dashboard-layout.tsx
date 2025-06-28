import React from "react";
import { SidebarProvider, SidebarTrigger } from "../ui/sidebar";
import DashboardSidebar from "./dashboard-sidebar";
import { Outlet } from "react-router-dom";
import { ModeToggle } from "../mode-toggle";
import { DashbaordProvider } from "@/contexts/dashboard-context";

const DashboardLayout: React.FC = () => {
  return (
    <DashbaordProvider>
      <SidebarProvider>
        <DashboardSidebar />
        <main className="w-full h-full flex flex-col min-h-dvh">
          <header>
            <div className="flex items-center justify-between w-auto p-4 h-16">
              <SidebarTrigger />
              <ModeToggle />
            </div>
          </header>

          <div className=" w-full px-4 py-2">
            <Outlet />
          </div>
        </main>
      </SidebarProvider>
    </DashbaordProvider>
  );
};

export default DashboardLayout;
