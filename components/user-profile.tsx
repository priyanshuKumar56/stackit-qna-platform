"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { MapPin, Calendar, LinkIcon, Trophy, MessageSquare, ThumbsUp, Edit } from "lucide-react"

interface UserProfileProps {
  userId?: string
}

export function UserProfile({ userId }: UserProfileProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    name: "John Doe",
    username: "johndoe",
    email: "john.doe@example.com",
    bio: "Full-stack developer passionate about React, Node.js, and building great user experiences. Always learning and sharing knowledge with the community.",
    location: "San Francisco, CA",
    website: "https://johndoe.dev",
    joinDate: "January 2023",
    avatar: "/placeholder.svg",
  })

  const stats = {
    reputation: 1250,
    questions: 23,
    answers: 87,
    votes: 156,
    views: 12500,
    badges: {
      gold: 2,
      silver: 8,
      bronze: 15,
    },
  }

  const recentActivity = [
    {
      type: "answer",
      title: "How to implement authentication in Next.js 14?",
      timestamp: "2 hours ago",
      votes: 5,
    },
    {
      type: "question",
      title: "Best practices for React state management",
      timestamp: "1 day ago",
      votes: 12,
    },
    {
      type: "comment",
      title: "CSS Grid vs Flexbox discussion",
      timestamp: "2 days ago",
      votes: 3,
    },
  ]

  const badges = [
    { name: "Great Question", description: "Question score of 25 or more", type: "gold", count: 2 },
    { name: "Good Answer", description: "Answer score of 25 or more", type: "silver", count: 5 },
    { name: "Popular Question", description: "Question with 1,000 or more views", type: "silver", count: 3 },
    { name: "Nice Answer", description: "Answer score of 10 or more", type: "bronze", count: 8 },
    { name: "Student", description: "First question with score of 1 or more", type: "bronze", count: 1 },
    { name: "Teacher", description: "First answer with score of 1 or more", type: "bronze", count: 1 },
  ]

  const handleSave = () => {
    setIsEditing(false)
    // Here you would typically save to your backend
    console.log("Saving profile data:", profileData)
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Profile Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-6">
            <Avatar className="w-24 h-24">
              <AvatarImage src={profileData.avatar || "/placeholder.svg"} alt={profileData.name} />
              <AvatarFallback className="text-2xl">
                {profileData.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold">{profileData.name}</h1>
                  <p className="text-gray-600">@{profileData.username}</p>
                </div>
                <Button onClick={() => setIsEditing(!isEditing)} className="gap-2">
                  <Edit className="w-4 h-4" />
                  {isEditing ? "Cancel" : "Edit Profile"}
                </Button>
              </div>

              <p className="text-gray-700 mb-4">{profileData.bio}</p>

              <div className="flex items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{profileData.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <LinkIcon className="w-4 h-4" />
                  <a href={profileData.website} className="text-blue-600 hover:underline">
                    {profileData.website}
                  </a>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>Joined {profileData.joinDate}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{stats.reputation}</div>
            <div className="text-sm text-gray-600">Reputation</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">{stats.questions}</div>
            <div className="text-sm text-gray-600">Questions</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">{stats.answers}</div>
            <div className="text-sm text-gray-600">Answers</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">{stats.votes}</div>
            <div className="text-sm text-gray-600">Votes</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">{stats.views.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Views</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="activity" className="space-y-6">
        <TabsList>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="badges">Badges</TabsTrigger>
          <TabsTrigger value="questions">Questions</TabsTrigger>
          <TabsTrigger value="answers">Answers</TabsTrigger>
          {isEditing && <TabsTrigger value="settings">Settings</TabsTrigger>}
        </TabsList>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {activity.type === "question" && <MessageSquare className="w-5 h-5 text-blue-600" />}
                    {activity.type === "answer" && <MessageSquare className="w-5 h-5 text-green-600" />}
                    {activity.type === "comment" && <MessageSquare className="w-5 h-5 text-gray-600" />}
                    <div>
                      <div className="font-medium">{activity.title}</div>
                      <div className="text-sm text-gray-600">{activity.timestamp}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <ThumbsUp className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">{activity.votes}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="badges" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="p-4 text-center">
                <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                <div className="text-2xl font-bold">{stats.badges.gold}</div>
                <div className="text-sm text-gray-600">Gold Badges</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Trophy className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <div className="text-2xl font-bold">{stats.badges.silver}</div>
                <div className="text-sm text-gray-600">Silver Badges</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Trophy className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                <div className="text-2xl font-bold">{stats.badges.bronze}</div>
                <div className="text-sm text-gray-600">Bronze Badges</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>All Badges</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {badges.map((badge, index) => (
                <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                  <Trophy
                    className={`w-6 h-6 ${
                      badge.type === "gold"
                        ? "text-yellow-500"
                        : badge.type === "silver"
                          ? "text-gray-400"
                          : "text-amber-600"
                    }`}
                  />
                  <div className="flex-1">
                    <div className="font-medium">{badge.name}</div>
                    <div className="text-sm text-gray-600">{badge.description}</div>
                  </div>
                  <Badge variant="secondary">{badge.count}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="questions">
          <Card>
            <CardHeader>
              <CardTitle>My Questions ({stats.questions})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Your questions will appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="answers">
          <Card>
            <CardHeader>
              <CardTitle>My Answers ({stats.answers})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Your answers will appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {isEditing && (
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Edit Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={profileData.username}
                      onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={profileData.bio}
                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={profileData.location}
                      onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      value={profileData.website}
                      onChange={(e) => setProfileData({ ...profileData, website: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave}>Save Changes</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}
