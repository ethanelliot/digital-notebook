import React from "react";
import { SidebarProvider, SidebarTrigger } from "../ui/sidebar";
import DashboardSidebar from "./dashboard-sidebar";
import { Outlet } from "react-router-dom";
import { ModeToggle } from "../mode-toggle";
import { Button } from "../ui/button";
import { Settings } from "lucide-react";

const DashboardLayout: React.FC = () => {
  return (
    <SidebarProvider>
      <DashboardSidebar />
      <main className="w-full h-full flex flex-col">
        <header>
          <div className="flex items-center justify-between w-auto p-2 h-16">
            <SidebarTrigger />
            <ModeToggle />
          </div>
        </header>

        <div className=" w-full p-2">
          <Outlet />
        </div>
      </main>
    </SidebarProvider>
  );
};

export default DashboardLayout;
