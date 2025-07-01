import React from "react";
import { SidebarProvider, SidebarTrigger } from "../ui/sidebar";
import DashboardSidebar from "./dashboard-sidebar";
import { Outlet } from "react-router-dom";
import { ModeToggle } from "../mode-toggle";

const DashboardLayout: React.FC = () => {
  return (
    <SidebarProvider>
      <DashboardSidebar />
      <main className="w-full min-h-dvh grid grid-rows-[auto_1fr]">
        <header className="h-16  w-auto p-4 flex items-center justify-between ">
          <SidebarTrigger />
          <ModeToggle />
        </header>

        <div className=" h-full w-full px-4 ">
          <Outlet />
        </div>
      </main>
    </SidebarProvider>
  );
};

export default DashboardLayout;
