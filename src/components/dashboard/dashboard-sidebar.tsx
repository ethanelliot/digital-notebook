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
  Book,
  BookA,
  Calendar,
  Home,
  Layers,
  Pencil,
  Plus,
  Settings,
  StickyNote,
  type LucideIcon,
} from "lucide-react";
import { SidebarItemGroup } from "./sidebar-group";
import { useWorkspaceContext } from "@/contexts/workspace-context";
import { useEffect, useState } from "react";
import { Skeleton } from "../ui/skeleton";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { groupColors } from "@/lib/constants";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useDialog } from "@/contexts/dialog-context";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const { loading, groups } = useWorkspaceContext();
  const { openDialog } = useDialog();
  const isMobile = useIsMobile();
  const [groupsData, setGroupsData] = useState<
    { title: string; url: string; icon?: LucideIcon; color: string }[]
  >([]);

  useEffect(() => {
    setGroupsData(
      groups
        .filter((group) => !group.isHidden)
        .map((group) => ({
          title: group.name,
          url: "/" + group.id,
          color: groupColors[group.color].background,
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="w-full h-12">
                  <Plus className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                align="start"
                side={isMobile ? "bottom" : "right"}
                sideOffset={4}
              >
                <DropdownMenuItem onClick={() => openDialog("noteForm", {})}>
                  <div className="flex size-6 items-center justify-center rounded-md border">
                    <StickyNote className="size-3.5 shrink-0" />
                  </div>
                  New Note
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => openDialog("notebookForm", {})}
                >
                  <div className="flex size-6 items-center justify-center rounded-md border">
                    <Book className="size-3.5 shrink-0" />
                  </div>
                  New Notebook
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => openDialog("groupForm", {})}>
                  <div className="flex size-6 items-center justify-center rounded-md border">
                    <Layers className="size-3.5 shrink-0" />
                  </div>
                  New Group
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
