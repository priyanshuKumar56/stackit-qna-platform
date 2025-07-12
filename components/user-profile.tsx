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
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { fetchUserById, updateUserProfile } from "@/store/usersSlice" // Make sure you have fetchUserById
import { fetchUserQuestions } from "@/store/questionsSlice" // Fetch user's questions
import { fetchUserComments } from "@/store/commentsSlice" // Fetch user's comments
import { updateQuestionInList } from "@/store/questionsSlice"
import Link from "next/link"
import { useAuthStore } from "@/lib/auth" // Assuming you have auth store

interface UserProfileProps {
  userId?: string // Optional prop, will default to current user
}

export function UserProfile({ userId }: UserProfileProps) {
  const dispatch = useAppDispatch()
  const { user: authUser } = useAuthStore() // Get authenticated user
  const { currentUser, loading: userLoading, error: userError } = useAppSelector((state) => state.users)
  const { questions, loading: questionsLoading } = useAppSelector((state) => state.questions)
  const { comments, loading: commentsLoading } = useAppSelector((state) => state.comments)

  const [isEditing, setIsEditing] = useState(false)
  const [editableProfileData, setEditableProfileData] = useState<Partial<typeof currentUser> | null>(null)
  
  // Determine which user to show
  const targetUserId = userId || authUser?.id
  const isOwnProfile = !userId || userId === authUser?.id

  // Fetch user data on component mount
  useEffect(() => {
    if (targetUserId) {
      console.log("Fetching user data for:", targetUserId)
      dispatch(fetchUserById(targetUserId))
      dispatch(fetchUserQuestions(targetUserId))
      dispatch(fetchUserComments(targetUserId))
    }
  }, [dispatch, targetUserId])

  // Initialize editable data when currentUser changes
  useEffect(() => {
    if (currentUser && isOwnProfile) {
      setEditableProfileData(currentUser)
    }
  }, [currentUser, isOwnProfile])

  // Loading state
  if (userLoading || questionsLoading || commentsLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Loading user profile...</span>
      </div>
    )
  }

  // Error state
  if (userError) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">Error loading user profile</div>
        <p className="text-gray-500">{userError}</p>
        <Button 
          onClick={() => targetUserId && dispatch(fetchUserById(targetUserId))}
          className="mt-4"
        >
          Try Again
        </Button>
      </div>
    )
  }

  // No user found
  if (!currentUser) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-600 mb-4">User not found</div>
        <p className="text-gray-500">The user profile you're looking for doesn't exist.</p>
      </div>
    )
  }

  // Filter user's content
  const myQuestions = questions.filter((q) => q.author.id === currentUser.id)
  const myAnswers = comments.filter((c) => c.author.id === currentUser.id && !c.parentId)

  // Create recent activity
  const recentActivity = [
    ...myQuestions.map((q) => ({
      type: "question" as const,
      title: q.title,
      timestamp: q.timestamp,
      votes: q.votes,
      id: q.id,
    })),
    ...myAnswers.map((a) => ({
      type: "answer" as const,
      title: `Answer to: ${questions.find((q) => q.id === a.questionId)?.title || "Unknown Question"}`,
      timestamp: a.timestamp,
      votes: a.votes,
      id: a.id,
    })),
  ]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 5)

  const handleSave = async () => {
    if (editableProfileData && isOwnProfile) {
      try {
        await dispatch(updateUserProfile(editableProfileData)).unwrap()
        setIsEditing(false)
      } catch (error) {
        console.error("Failed to update profile:", error)
        // You might want to show a toast notification here
      }
    }
  }

  const handleQuestionVote = (questionId: string, currentVotes: number, type: "up" | "down") => {
    const newVotes = type === "up" ? currentVotes + 1 : currentVotes - 1
    dispatch(updateQuestionInList({ id: questionId, votes: newVotes }))
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Profile Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-6">
            <Avatar className="w-24 h-24">
              <AvatarImage src={currentUser.avatar || "/placeholder.svg"} alt={currentUser.name} />
              <AvatarFallback className="text-2xl">
                {currentUser.name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("") || "?"}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold">{currentUser.name}</h1>
                  <p className="text-gray-600">@{currentUser.username}</p>
                </div>
                {isOwnProfile && (
                  <Button onClick={() => setIsEditing(!isEditing)} className="gap-2">
                    <Edit className="w-4 h-4" />
                    {isEditing ? "Cancel" : "Edit Profile"}
                  </Button>
                )}
              </div>

              <p className="text-gray-700 mb-4">{currentUser.bio}</p>

              <div className="flex items-center gap-6 text-sm text-gray-600">
                {currentUser.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{currentUser.location}</span>
                  </div>
                )}
                {currentUser.website && (
                  <div className="flex items-center gap-1">
                    <LinkIcon className="w-4 h-4" />
                    <a href={currentUser.website} className="text-blue-600 hover:underline">
                      {currentUser.website}
                    </a>
                  </div>
                )}
                {currentUser.joinDate && (
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>Joined {currentUser.joinDate}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-blue-600">{currentUser.reputation || 0}</div>
            <div className="text-sm text-gray-600">Reputation</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-green-600">{myQuestions.length}</div>
            <div className="text-sm text-gray-600">Questions</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-purple-600">{myAnswers.length}</div>
            <div className="text-sm text-gray-600">Answers</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-amber-600">
              {(currentUser.badges?.gold || 0) + (currentUser.badges?.silver || 0) + (currentUser.badges?.bronze || 0)}
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
          {isOwnProfile && isEditing && <TabsTrigger value="settings">Settings</TabsTrigger>}
        </TabsList>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <MessageSquare className={`w-5 h-5 ${activity.type === "question" ? "text-blue-600" : "text-green-600"}`} />
                      <div>
                        <Link href={`/${activity.type === "question" ? "question" : "question"}/${activity.id}`}>
                          <div className="font-medium hover:text-blue-600 cursor-pointer">{activity.title}</div>
                        </Link>
                        <div className="text-sm text-gray-600">{activity.timestamp}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <ThumbsUp className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">{activity.votes}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No recent activity found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="questions">
          <Card>
            <CardHeader>
              <CardTitle>Questions ({myQuestions.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {myQuestions.length > 0 ? (
                myQuestions.map((question) => (
                  <Card key={question.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex gap-4">
                        <div className="flex flex-col items-center gap-2 text-center min-w-[60px]">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleQuestionVote(question.id, question.votes, "up")}
                            className="hover:bg-blue-50 hover:text-blue-600"
                          >
                            <ArrowUp className="w-5 h-5" />
                          </Button>
                          <span className="text-lg font-semibold text-gray-700">{question.votes}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleQuestionVote(question.id, question.votes, "down")}
                            className="hover:bg-blue-50 hover:text-blue-600"
                          >
                            <ArrowDown className="w-5 h-5" />
                          </Button>
                        </div>

                        <div className="flex-1">
                          <Link href={`/question/${question.id}`}>
                            <h3 className="font-semibold text-lg mb-3 hover:text-blue-600 cursor-pointer text-gray-900 leading-tight">
                              {question.title}
                            </h3>
                          </Link>

                          <p className="text-gray-600 mb-4 line-clamp-2 leading-relaxed">{question.content}</p>

                          <div className="flex flex-wrap gap-2 mb-4">
                            {question.tags?.map((tag) => (
                              <Badge
                                key={tag}
                                variant="outline"
                                className="text-xs bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-6 text-sm text-gray-500">
                              <div className="flex items-center gap-1">
                                <MessageSquare className="w-4 h-4" />
                                <span>{question.replies || 0} answers</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Eye className="w-4 h-4" />
                                <span>{question.views || 0} views</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-1 text-sm text-gray-500">
                                <Clock className="w-4 h-4" />
                                <span>{question.timestamp}</span>
                              </div>
                              {question.hasAcceptedAnswer && (
                                <div className="flex items-center gap-1">
                                  <CheckCircle className="w-5 h-5 text-green-500" />
                                  <span className="text-sm text-green-600 font-medium">Solved</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>{isOwnProfile ? "You haven't asked any questions yet." : "This user hasn't asked any questions yet."}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="answers">
          <Card>
            <CardHeader>
              <CardTitle>Answers ({myAnswers.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {myAnswers.length > 0 ? (
                myAnswers.map((answer) => (
                  <Card key={answer.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="flex flex-col items-center gap-2 text-center min-w-[60px]">
                          <Button variant="ghost" size="icon" className="hover:bg-blue-50 hover:text-blue-600">
                            <ArrowUp className="w-5 h-5" />
                          </Button>
                          <span className="text-lg font-semibold text-gray-700">{answer.votes}</span>
                          <Button variant="ghost" size="icon" className="hover:bg-blue-50 hover:text-blue-600">
                            <ArrowDown className="w-5 h-5" />
                          </Button>
                        </div>
                        <div className="flex-1">
                          <Link href={`/question/${answer.questionId}`}>
                            <h3 className="font-semibold text-lg mb-3 hover:text-blue-600 cursor-pointer text-gray-900 leading-tight">
                              {answer.content.substring(0, 100)}...
                            </h3>
                          </Link>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-6 text-sm text-gray-500">
                              <div className="flex items-center gap-1">
                                <MessageSquare className="w-4 h-4" />
                                <span>{answer.replies?.length || 0} replies</span>
                              </div>
                            </div>
                            <span className="text-sm text-gray-500">{answer.timestamp}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>{isOwnProfile ? "You haven't provided any answers yet." : "This user hasn't provided any answers yet."}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {isOwnProfile && isEditing && (
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
                      value={editableProfileData?.name || ""}
                      onChange={(e) => setEditableProfileData(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={editableProfileData?.username || ""}
                      onChange={(e) => setEditableProfileData(prev => ({ ...prev, username: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={editableProfileData?.bio || ""}
                    onChange={(e) => setEditableProfileData(prev => ({ ...prev, bio: e.target.value }))}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={editableProfileData?.location || ""}
                      onChange={(e) => setEditableProfileData(prev => ({ ...prev, location: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      value={editableProfileData?.website || ""}
                      onChange={(e) => setEditableProfileData(prev => ({ ...prev, website: e.target.value }))}
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