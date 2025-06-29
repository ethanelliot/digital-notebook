import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  BookA,
  BookCopy,
  Calendar,
  Home,
  Pencil,
  Plus,
  Settings,
  StickyNote,
  type LucideIcon,
} from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { SidebarItemGroup } from "./sidebar-group";
import { useDashboardContext } from "@/contexts/dashboard-context";
import { useEffect, useState } from "react";
import { Skeleton } from "../ui/skeleton";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";

const data = {
  navHead: {
    version: ["1.0.0"],
  },
  navMain: [
    {
      title: "Home",
      url: "/",
      icon: Home,
    },
    {
      title: "Calendar",
      url: "/calendar",
      icon: Calendar,
    },
    {
      title: "Notes",
      url: "/notes",
      icon: StickyNote,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/settings",
      icon: Settings,
    },
  ],
};

export function DashboardSidebar() {
  const { loading, groups } = useDashboardContext();
  const [groupsData, setGroupsData] = useState<
    { title: string; url: string; icon: LucideIcon; isActive?: boolean }[]
  >([]);

  useEffect(() => {
    setGroupsData(
      groups
        .filter((group) => !group.isHidden)
        .map((group) => ({
          title: group.name,
          url: "/" + group.id,
          icon: BookCopy,
        }))
    );
  }, [groups]);

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <span>
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <BookA className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-medium">Notes</span>
                  <span className="">{data.navHead.version}</span>
                </div>
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {/*  ADD BUTTON */}
        <SidebarGroup>
          <SidebarMenu>
            <Dialog>
              <DialogTrigger className="inline-flex items-center justify-center w-full h-12 rounded-md px-6 border bg-background shadow-xs gap-2 whitespace-nowrap text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50">
                <Plus className="size-4" />
              </DialogTrigger>
              <DialogContent>yes</DialogContent>
            </Dialog>
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarItemGroup items={data.navMain} />
        </SidebarGroup>

        <SidebarGroup className="flex-1">
          <SidebarGroupLabel>Groups</SidebarGroupLabel>
          <SidebarGroupAction title="Edit Group" asChild>
            <Button variant="ghost" asChild className="p-0 -translate-y-2">
              <Link to="groups">
                <Pencil size={16} />
              </Link>
            </Button>
          </SidebarGroupAction>
          {loading ? (
            <Skeleton className=" w-full h-full" />
          ) : (
            <SidebarItemGroup items={groupsData} />
          )}
        </SidebarGroup>
        <SidebarGroup className="">
          <SidebarItemGroup items={data.navSecondary} />
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

export default DashboardSidebar;
