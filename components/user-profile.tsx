"use client"

import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  MapPin,
  Calendar,
  LinkIcon,
  Trophy,
  MessageSquare,
  ThumbsUp,
  Edit,
  ArrowUp,
  ArrowDown,
  Eye,
  Clock,
  CheckCircle,
  Save,
  Loader2,
} from "lucide-react"

import { useAuth } from "@/lib/auth"
import Link from "next/link"

interface UserProfileProps {
  userId?: string
}

interface User {
  id: string
  name: string
  username: string
  email: string
  avatar: string
  bio: string
  location: string
  website: string
  joinDate: string
  reputation: number
  questionsCount: number
  answersCount: number
  viewsCount: number
  votesReceived: number
  badges: {
    gold: number
    silver: number
    bronze: number
  }
  questions: any[]
  answers: any[]
}

export function UserProfile({ userId }: UserProfileProps) {
  const { user: currentUser, isAuthenticated, isReady } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    name: "",
    bio: "",
    location: "",
    website: ""
  })
  const [isSaving, setIsSaving] = useState(false)

  // Determine if this is the user's own profile
  const isOwnProfile = !userId || userId === currentUser?.id

  // The user to display (either current user or fetched user)
  
  const displayUser = currentUser 
  console.log("Current user:", )

  // Initialize edit form when user data is available
  useEffect(() => {
    if (displayUser && isEditing) {
      setEditForm({
        name: displayUser.name || "",
        bio: displayUser.bio || "",
        location: displayUser.location || "",
        website: displayUser.website || ""
      })
    }
  }, [displayUser, isEditing])

  // Format join date
  const formatJoinDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    })
  }

  // Handle form input changes
  const handleInputChange = (field: string, value: string) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Handle save profile changes
  const handleSaveProfile = async () => {
    setIsSaving(true)
    try {
      // Add your API call here to save profile changes
      // await updateUserProfile(editForm)
      console.log("Saving profile:", editForm)
      setIsEditing(false)
    } catch (error) {
      console.error("Error saving profile:", error)
    } finally {
      setIsSaving(false)
    }
  }

  // Show loading state if auth is not ready
  if (!isReady) {
    return (
      <div className="max-w-6xl mx-auto p-6 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  // Show message if user is not authenticated
  if (!isAuthenticated) {
    return (
      <div className="max-w-6xl mx-auto p-6 text-center">
        <p className="text-gray-600">Please log in to view your profile.</p>
      </div>
    )
  }

  // Show message if no user data
  if (!displayUser) {
    return (
      <div className="max-w-6xl mx-auto p-6 text-center">
        <p className="text-gray-600">User not found.</p>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Profile Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-6">
            <Avatar className="w-24 h-24">
              <AvatarImage src={displayUser.avatar || "/placeholder.svg"} alt={displayUser.name || "User"} />
              <AvatarFallback className="text-2xl">
                {displayUser.name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("") || "?"}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex items-center justify-between mb-4">
                <div>
                  {isEditing ? (
                    <div className="space-y-2">
                      <Input
                        value={editForm.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        placeholder="Your name"
                        className="text-2xl font-bold"
                      />
                    </div>
                  ) : (
                    <div>
                      <h1 className="text-3xl font-bold">{displayUser.name || "Unknown User"}</h1>
                      {displayUser.username && (
                        <p className="text-gray-600">@{displayUser.username}</p>
                      )}
                    </div>
                  )}
                </div>
                {isOwnProfile && isAuthenticated && (
                  <div className="flex gap-2">
                    {isEditing ? (
                      <>
                        <Button onClick={handleSaveProfile} disabled={isSaving} className="gap-2">
                          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                          {isSaving ? "Saving..." : "Save"}
                        </Button>
                        <Button variant="outline" onClick={() => setIsEditing(false)}>
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <Button onClick={() => setIsEditing(true)} className="gap-2">
                        <Edit className="w-4 h-4" />
                        Edit Profile
                      </Button>
                    )}
                  </div>
                )}
              </div>

              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={editForm.bio}
                      onChange={(e) => handleInputChange("bio", e.target.value)}
                      placeholder="Tell us about yourself..."
                      className="mt-1"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={editForm.location}
                        onChange={(e) => handleInputChange("location", e.target.value)}
                        placeholder="Your location"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        value={editForm.website}
                        onChange={(e) => handleInputChange("website", e.target.value)}
                        placeholder="https://your-website.com"
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {displayUser.bio && (
                    <p className="text-gray-700 mb-4">{displayUser.bio}</p>
                  )}

                  <div className="flex items-center gap-6 text-sm text-gray-600">
                    {displayUser.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{displayUser.location}</span>
                      </div>
                    )}
                    {displayUser.website && (
                      <div className="flex items-center gap-1">
                        <LinkIcon className="w-4 h-4" />
                        <a href={displayUser.website} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                          {displayUser.website}
                        </a>
                      </div>
                    )}
                    {displayUser.joinDate && (
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>Joined {formatJoinDate(displayUser.joinDate)}</span>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-blue-600">{displayUser.reputation || 0}</div>
            <div className="text-sm text-gray-600">Reputation</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-green-600">{displayUser.questionsCount || displayUser.questions?.length || 0}</div>
            <div className="text-sm text-gray-600">Questions</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-purple-600">{displayUser.answersCount || displayUser.answers?.length || 0}</div>
            <div className="text-sm text-gray-600">Answers</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-amber-600">
              {displayUser.badges ? (displayUser.badges.gold + displayUser.badges.silver + displayUser.badges.bronze) : 0}
            </div>
            <div className="text-sm text-gray-600">Badges</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="activity" className="space-y-6">
        <TabsList>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="questions">Questions</TabsTrigger>
          <TabsTrigger value="answers">Answers</TabsTrigger>
          {isOwnProfile && <TabsTrigger value="badges">Badges</TabsTrigger>}
        </TabsList>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {displayUser.questions?.length === 0 && displayUser.answers?.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No recent activity</p>
                ) : (
                  <div className="space-y-3">
                    {displayUser.answers?.map((answer, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <MessageSquare className="w-5 h-5 text-purple-600" />
                        <div>
                          <p className="font-medium">Answered a question</p>
                          <p className="text-sm text-gray-600">Answer provided</p>
                        </div>
                      </div>
                    ))}
                    {displayUser.questions?.map((question, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <MessageSquare className="w-5 h-5 text-green-600" />
                        <div>
                          <p className="font-medium">Asked a question</p>
                          <p className="text-sm text-gray-600">Question posted</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="questions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Questions ({displayUser.questionsCount || 0})</CardTitle>
            </CardHeader>
            <CardContent>
              {displayUser.questions?.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No questions asked yet</p>
              ) : (
                <div className="space-y-3">
                  {displayUser.questions?.map((question, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <h3 className="font-medium">Question {index + 1}</h3>
                      <p className="text-sm text-gray-600 mt-1">Question details would go here</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="answers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Answers ({displayUser.answersCount || 0})</CardTitle>
            </CardHeader>
            <CardContent>
              {displayUser.answers?.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No answers provided yet</p>
              ) : (
                <div className="space-y-3">
                  {displayUser.answers?.map((answer, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <h3 className="font-medium">Answer {index + 1}</h3>
                      <p className="text-sm text-gray-600 mt-1">Answer details would go here</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="badges" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Badges</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <Trophy className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-yellow-600">{displayUser.badges?.gold || 0}</div>
                  <div className="text-sm text-gray-600">Gold Badges</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Trophy className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-600">{displayUser.badges?.silver || 0}</div>
                  <div className="text-sm text-gray-600">Silver Badges</div>
                </div>
                <div className="text-center p-4 bg-amber-50 rounded-lg">
                  <Trophy className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-amber-600">{displayUser.badges?.bronze || 0}</div>
                  <div className="text-sm text-gray-600">Bronze Badges</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}