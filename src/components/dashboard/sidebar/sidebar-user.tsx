import { LogOut, MoreVertical, Settings, UserCircle } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { useAuth } from '@/contexts/auth-context'
import { useIsMobile } from '@/hooks/use-mobile'

const data = {
  actions: [
    {
      title: 'Account',
      url: '/settings',
      icon: UserCircle,
    },
    {
      title: 'Settings',
      url: '/settings',
      icon: Settings,
    },
  ],
}

const SidebarUser: React.FC = () => {
  const isMobile = useIsMobile()
  const { authUser, logout } = useAuth()
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage
                  src={authUser?.photoURL ?? undefined}
                  alt={authUser?.displayName ?? undefined}
                />
                <AvatarFallback className="rounded-lg">NA</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {authUser?.displayName}
                </span>
                <span className="text-muted-foreground truncate text-xs">
                  {authUser?.email}
                </span>
              </div>
              <MoreVertical className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src={authUser?.photoURL ?? undefined}
                    alt={authUser?.displayName ?? undefined}
                  />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    {authUser?.displayName}
                  </span>
                  <span className="text-muted-foreground truncate text-xs">
                    {authUser?.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {data.actions.map((item) => (
                <Link key={item.title} to={item.url}>
                  <DropdownMenuItem>
                    <item.icon />
                    <span>{item.title}</span>
                  </DropdownMenuItem>
                </Link>
              ))}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => void logout()}>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

export default SidebarUser
