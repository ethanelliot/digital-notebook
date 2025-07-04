import { type LucideIcon } from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
export function SidebarItemGroup({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    color?: string;
    isActive?: boolean;
  }[];
}) {
  return (
    <SidebarMenu>
      {items.map((item) => (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton asChild isActive={item.isActive}>
            <Link to={item.url}>
              {item.icon ? (
                <item.icon />
              ) : (
                <div
                  className={cn(
                    "h-4 w-4 rounded-full bg-slate-200",
                    item.color
                  )}
                ></div>
              )}

              <span>{item.title}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
