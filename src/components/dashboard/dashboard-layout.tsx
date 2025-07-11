import React from 'react'
import { Outlet } from 'react-router-dom'
import { ModeToggle } from '../mode-toggle'
import { SidebarProvider, SidebarTrigger } from '../ui/sidebar'
import DashboardSidebar from './sidebar/dashboard-sidebar'

const DashboardLayout: React.FC = () => {
  return (
    <SidebarProvider>
      <DashboardSidebar />
      <main className="w-full min-h-dvh grid grid-rows-[auto_1fr] grid-cols-1  max-w-dvw">
        <header className="h-16 p-4 flex items-center justify-between ">
          <SidebarTrigger />
          <ModeToggle />
        </header>

        <div className="w-full h-full px-4 ">
          <Outlet />
        </div>
      </main>
    </SidebarProvider>
  )
}

export default DashboardLayout
