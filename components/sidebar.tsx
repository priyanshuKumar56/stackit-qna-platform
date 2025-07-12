"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  Home,
  TrendingUp,
  Clock,
  HelpCircle,
  Star,
  MessageSquare,
  Users,
  Lightbulb,
  UserCheck,
  BookOpen,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { setFilter } from "@/store/questionsSlice"
import { toggleSidebar } from "@/store/uiSlice"

const navigationItems = [
  { title: "All Questions", icon: Home, filter: "all", count: 1247 },
  { title: "Trending", icon: TrendingUp, filter: "trending", count: 23 },
  { title: "Recent", icon: Clock, filter: "recent", count: 156 },
  { title: "Unanswered", icon: HelpCircle, filter: "unanswered", count: 89 },
  { title: "My Questions", icon: Star, filter: "my-questions", count: 12 },
]

const categories = [
  { title: "Fin Q&A", icon: MessageSquare, filter: "fin-qa", count: 234 },
  { title: "Fin Community", icon: Users, filter: "fin-community", count: 189 },
  { title: "Product Q&A", icon: HelpCircle, filter: "product-qa", count: 156 },
  { title: "Product Wishlist", icon: Lightbulb, filter: "product-wishlist", count: 87 },
  { title: "Groups", icon: UserCheck, filter: "groups", count: 65 },
  { title: "User Tips", icon: BookOpen, filter: "user-tips", count: 43 },
]

export function Sidebar() {
  const dispatch = useAppDispatch()
  const { filter } = useAppSelector((state) => state.questions)
  const { sidebarCollapsed } = useAppSelector((state) => state.ui)

  return (
    <div
      className={`fixed left-0 top-16 h-[calc(100vh-4rem)] overflow-y-scroll bg-white border-r border-gray-200 transition-all duration-300 shadow-sm ${
        sidebarCollapsed ? "w-16" : "w-64"
      }`}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        {!sidebarCollapsed && <h2 className="font-semibold text-gray-900">Navigation</h2>}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => dispatch(toggleSidebar())}
          className="h-8 w-8 hover:bg-gray-100"
        >
          {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </Button>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-6">
          <div>
            {!sidebarCollapsed && (
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">OVERVIEW</h3>
            )}
            <div className="space-y-1">
              {navigationItems.map((item) => (
                <Button
                  key={item.filter}
                  variant={filter === item.filter ? "secondary" : "ghost"}
                  className={`w-full justify-start gap-3 ${sidebarCollapsed ? "px-2" : ""} ${
                    filter === item.filter
                      ? "bg-blue-50 text-blue-700 hover:bg-blue-100"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                  onClick={() => dispatch(setFilter(item.filter))}
                >
                  <item.icon className="w-4 h-4" />
                  {!sidebarCollapsed && (
                    <>
                      <span className="flex-1 text-left">{item.title}</span>
                      <Badge
                        variant="secondary"
                        className={`text-xs ${
                          filter === item.filter ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {item.count}
                      </Badge>
                    </>
                  )}
                </Button>
              ))}
            </div>
          </div>

          <Separator />

          <div>
            {!sidebarCollapsed && (
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">CATEGORIES</h3>
            )}
            <div className="space-y-1">
              {categories.map((category) => (
                <Button
                  key={category.filter}
                  variant={filter === category.filter ? "secondary" : "ghost"}
                  className={`w-full justify-start gap-3 ${sidebarCollapsed ? "px-2" : ""} ${
                    filter === category.filter
                      ? "bg-blue-50 text-blue-700 hover:bg-blue-100"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                  onClick={() => dispatch(setFilter(category.filter))}
                >
                  <category.icon className="w-4 h-4" />
                  {!sidebarCollapsed && (
                    <>
                      <span className="flex-1 text-left">{category.title}</span>
                      <Badge
                        variant="secondary"
                        className={`text-xs ${
                          filter === category.filter ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {category.count}
                      </Badge>
                    </>
                  )}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}
