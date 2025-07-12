"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bell, MessageSquare, ThumbsUp, AtSign, Trophy, CheckCircle, X, Settings } from "lucide-react"

interface Notification {
  id: string
  type: "answer" | "vote" | "mention" | "badge" | "comment"
  title: string
  message: string
  timestamp: string
  read: boolean
  avatar?: string
  actionUrl?: string
}

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "answer",
      title: "New answer to your question",
      message: "John Doe answered your question about React hooks",
      timestamp: "2 minutes ago",
      read: false,
      avatar: "/placeholder.svg",
      actionUrl: "/question/123",
    },
    {
      id: "2",
      type: "vote",
      title: "Your answer was upvoted",
      message: "Your answer about Next.js authentication received 5 upvotes",
      timestamp: "1 hour ago",
      read: false,
    },
    {
      id: "3",
      type: "mention",
      title: "You were mentioned",
      message: "Sarah mentioned you in a comment on 'CSS Grid vs Flexbox'",
      timestamp: "3 hours ago",
      read: true,
      avatar: "/placeholder.svg",
    },
    {
      id: "4",
      type: "badge",
      title: "New badge earned!",
      message: "You earned the 'Great Question' badge",
      timestamp: "1 day ago",
      read: true,
    },
    {
      id: "5",
      type: "comment",
      title: "New comment on your answer",
      message: "Mike left a comment on your JavaScript answer",
      timestamp: "2 days ago",
      read: true,
      avatar: "/placeholder.svg",
    },
  ])

  const [activeTab, setActiveTab] = useState("all")

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "answer":
        return <MessageSquare className="w-5 h-5 text-blue-600" />
      case "vote":
        return <ThumbsUp className="w-5 h-5 text-green-600" />
      case "mention":
        return <AtSign className="w-5 h-5 text-purple-600" />
      case "badge":
        return <Trophy className="w-5 h-5 text-yellow-600" />
      case "comment":
        return <MessageSquare className="w-5 h-5 text-gray-600" />
      default:
        return <Bell className="w-5 h-5 text-gray-600" />
    }
  }

  const markAsRead = (id: string) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })))
  }

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id))
  }

  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === "all") return true
    if (activeTab === "unread") return !n.read
    return n.type === activeTab
  })

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notifications
              </CardTitle>
              {unreadCount > 0 && <Badge variant="destructive">{unreadCount}</Badge>}
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={markAllAsRead}>
                <CheckCircle className="w-4 h-4 mr-1" />
                Mark all as read
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="unread">Unread</TabsTrigger>
              <TabsTrigger value="answer">Answers</TabsTrigger>
              <TabsTrigger value="vote">Votes</TabsTrigger>
              <TabsTrigger value="mention">Mentions</TabsTrigger>
              <TabsTrigger value="badge">Badges</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-6">
              {filteredNotifications.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Bell className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No notifications found</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`flex items-start gap-3 p-4 rounded-lg border transition-colors ${
                        !notification.read ? "bg-blue-50 border-blue-200" : "hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex-shrink-0">
                        {notification.avatar ? (
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={notification.avatar || "/placeholder.svg"} />
                            <AvatarFallback>U</AvatarFallback>
                          </Avatar>
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                            {getNotificationIcon(notification.type)}
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-medium text-sm">{notification.title}</h4>
                            <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                            <p className="text-xs text-gray-500 mt-2">{notification.timestamp}</p>
                          </div>
                          <div className="flex items-center gap-1 ml-2">
                            {!notification.read && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => markAsRead(notification.id)}
                                className="h-6 w-6 p-0"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteNotification(notification.id)}
                              className="h-6 w-6 p-0 text-gray-400 hover:text-red-600"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
