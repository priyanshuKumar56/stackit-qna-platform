"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Search, Bell, Plus, User, Settings, LogOut, MessageSquare, ThumbsUp, AtSign, ChevronDown } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { setSearchQuery, setQuestionModalOpen } from "@/store/uiSlice"
import Link from "next/link"

const notifications = [
  {
    id: 1,
    type: "answer",
    message: "John Doe answered your question about React hooks",
    time: "2 minutes ago",
    unread: true,
    icon: MessageSquare,
  },
  {
    id: 2,
    type: "vote",
    message: "Your answer received 5 upvotes",
    time: "1 hour ago",
    unread: true,
    icon: ThumbsUp,
  },
  {
    id: 3,
    type: "mention",
    message: "Sarah mentioned you in a comment",
    time: "3 hours ago",
    unread: false,
    icon: AtSign,
  },
]

export function Header() {
  const dispatch = useAppDispatch()
  const { searchQuery } = useAppSelector((state) => state.ui)
  const [unreadCount] = useState(2)

  return (
    <header className="bg-white border-b border-gray-200 h-16 fixed top-0 left-0 right-0 z-50 shadow-sm">
      <div className="flex items-center justify-between h-full px-6">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <div>
              <span className="font-bold text-xl text-gray-900">STACKIT</span>
              <div className="text-xs text-gray-500 -mt-1">Community</div>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-1 text-gray-700 hover:text-blue-600 hover:bg-blue-50">
                  Community
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Community Feed</DropdownMenuItem>
                <DropdownMenuItem>Categories</DropdownMenuItem>
                <DropdownMenuItem>Leaderboard</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="ghost" className="text-gray-700 hover:text-blue-600 hover:bg-blue-50">
              Help Center
            </Button>
            <Button variant="ghost" className="text-gray-700 hover:text-blue-600 hover:bg-blue-50">
              Academy
            </Button>
            <Button variant="ghost" className="text-gray-700 hover:text-blue-600 hover:bg-blue-50">
              Developer Hub
            </Button>
            
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search questions, tags, or users..."
              value={searchQuery}
              onChange={(e) => dispatch(setSearchQuery(e.target.value))}
              className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <Button
            onClick={() => dispatch(setQuestionModalOpen(true))}
            className="bg-blue-600 hover:bg-blue-700 gap-2 shadow-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            Ask Question
          </Button>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="relative hover:bg-gray-100">
                <Bell className="w-5 h-5 text-gray-600" />
                {unreadCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center text-xs p-0"
                  >
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
              <div className="p-4 border-b bg-gray-50">
                <h3 className="font-semibold text-gray-900">Notifications</h3>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 border-b hover:bg-gray-50 cursor-pointer ${
                      notification.unread ? "bg-blue-50" : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <notification.icon className="w-4 h-4 mt-1 text-blue-600" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">{notification.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                      </div>
                      {notification.unread && <div className="w-2 h-2 bg-blue-600 rounded-full" />}
                    </div>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg" alt="User" />
                  <AvatarFallback className="bg-blue-100 text-blue-700">JD</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-1 leading-none">
                  <p className="font-medium text-gray-900">John Doe</p>
                  <p className="w-[200px] truncate text-sm text-gray-500">john.doe@example.com</p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-gray-700">
                <Link  href="/profile" className="flex items-center gap-2">
                <User className="mr-2 h-4 w-4" />
                Profile
                </Link>
                
              </DropdownMenuItem>
              <DropdownMenuItem className="text-gray-700">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
