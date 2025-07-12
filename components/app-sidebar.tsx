"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"
import { Home, TrendingUp, Clock, Star, Tag, Users, Settings, HelpCircle } from "lucide-react"

const navigationItems = [
  { title: "All Questions", icon: Home, filter: "all", count: 1247 },
  { title: "Trending", icon: TrendingUp, filter: "trending", count: 23 },
  { title: "Recent", icon: Clock, filter: "recent", count: 156 },
  { title: "Unanswered", icon: HelpCircle, filter: "unanswered", count: 89 },
  { title: "My Questions", icon: Star, filter: "my-questions", count: 12 },
]

const popularTags = [
  { name: "React", count: 234 },
  { name: "JavaScript", count: 189 },
  { name: "Next.js", count: 156 },
  { name: "TypeScript", count: 134 },
  { name: "CSS", count: 98 },
  { name: "Node.js", count: 87 },
  { name: "Python", count: 76 },
  { name: "API", count: 65 },
]

interface AppSidebarProps {
  selectedFilter: string
  onFilterChange: (filter: string) => void
}

export function AppSidebar({ selectedFilter, onFilterChange }: AppSidebarProps) {
  return (
    <Sidebar className="border-r">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">S</span>
          </div>
          <span className="font-bold text-lg">StackIt</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.filter}>
                  <SidebarMenuButton
                    onClick={() => onFilterChange(item.filter)}
                    isActive={selectedFilter === item.filter}
                    className="w-full justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {item.count}
                    </Badge>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center gap-2">
            <Tag className="w-4 h-4" />
            Popular Tags
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="space-y-2 p-2">
              {popularTags.map((tag) => (
                <div
                  key={tag.name}
                  className="flex items-center justify-between p-2 rounded-md hover:bg-accent cursor-pointer"
                >
                  <span className="text-sm font-medium">{tag.name}</span>
                  <Badge variant="outline" className="text-xs">
                    {tag.count}
                  </Badge>
                </div>
              ))}
            </div>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Community</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton className="w-full justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>Members</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    2.4k
                  </Badge>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
