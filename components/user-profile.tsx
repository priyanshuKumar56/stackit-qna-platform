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
} from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { setCurrentUser, updateUserProfile } from "@/store/usersSlice" // Import user actions
import { updateQuestionVotes } from "@/store/questionsSlice" // Import question vote action
import Link from "next/link"

interface UserProfileProps {
  userId?: string // Optional prop, will default to current user
}

export function UserProfile({ userId }: UserProfileProps) {
  const dispatch = useAppDispatch()
  const { currentUser } = useAppSelector((state) => state.users)
  const { questions } = useAppSelector((state) => state.questions)
  const { comments } = useAppSelector((state) => state.comments)

  const [isEditing, setIsEditing] = useState(false)
  const [editableProfileData, setEditableProfileData] = useState<Partial<typeof currentUser> | null>(null)

  // Set current user on component mount if not already set
  useEffect(() => {
    if (!currentUser) {
      dispatch(setCurrentUser(userId || "user-1")) // Default to "user-1" if no userId provided
    }
  }, [dispatch, currentUser, userId])

  // Initialize editable data when currentUser changes or editing starts
  useEffect(() => {
    if (currentUser) {
      setEditableProfileData(currentUser)
    }
  }, [currentUser])

  if (!currentUser) {
    return <div className="text-center py-12 text-gray-500">Loading user profile...</div>
  }

  const myQuestions = questions.filter((q) => q.author.id === currentUser.id)
  const myAnswers = comments.filter((c) => c.author.id === currentUser.id && !c.parentId) // Top-level comments as answers

  // Mock recent activity based on user's questions and answers
  const recentActivity = [
    ...myQuestions.map((q) => ({
      type: "question",
      title: q.title,
      timestamp: q.timestamp,
      votes: q.votes,
      id: q.id,
    })),
    ...myAnswers.map((a) => ({
      type: "answer",
      title: `Answer to: ${questions.find((q) => q.id === a.questionId)?.title || "Unknown Question"}`,
      timestamp: a.timestamp,
      votes: a.votes,
      id: a.id,
    })),
  ]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 5) // Sort by time and take top 5

  const handleSave = () => {
    if (editableProfileData) {
      dispatch(updateUserProfile(editableProfileData))
      setIsEditing(false)
    }
  }

  const handleQuestionVote = (questionId: string, currentVotes: number, type: "up" | "down") => {
    const newVotes = type === "up" ? currentVotes + 1 : currentVotes - 1
    dispatch(updateQuestionVotes({ id: questionId, votes: newVotes }))
    // Optionally update user reputation for voting on their own question (or not)
  }

  const badges = [
    {
      name: "Great Question",
      description: "Question score of 25 or more",
      type: "gold",
      count: currentUser.badges.gold,
    },
    {
      name: "Good Answer",
      description: "Answer score of 25 or more",
      type: "silver",
      count: currentUser.badges.silver,
    },
    {
      name: "Popular Question",
      description: "Question with 1,000 or more views",
      type: "silver",
      count: currentUser.badges.silver,
    },
    {
      name: "Nice Answer",
      description: "Answer score of 10 or more",
      type: "bronze",
      count: currentUser.badges.bronze,
    },
    {
      name: "Student",
      description: "First question with score of 1 or more",
      type: "bronze",
      count: currentUser.badges.bronze,
    },
    {
      name: "Teacher",
      description: "First answer with score of 1 or more",
      type: "bronze",
      count: currentUser.badges.bronze,
    },
  ]

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
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold">{currentUser.name}</h1>
                  <p className="text-gray-600">@{currentUser.username}</p>
                </div>
                <Button onClick={() => setIsEditing(!isEditing)} className="gap-2">
                  <Edit className="w-4 h-4" />
                  {isEditing ? "Cancel" : "Edit Profile"}
                </Button>
              </div>

              <p className="text-gray-700 mb-4">{currentUser.bio}</p>

              <div className="flex items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{currentUser.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <LinkIcon className="w-4 h-4" />
                  <a href={currentUser.website} className="text-blue-600 hover:underline">
                    {currentUser.website}
                  </a>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>Joined {currentUser.joinDate}</span>
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
            <div className="text-2xl font-bold text-orange-600">{currentUser.reputation}</div>
            <div className="text-sm text-gray-600">Reputation</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">{currentUser.questionsCount}</div>
            <div className="text-sm text-gray-600">Questions</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">{currentUser.answersCount}</div>
            <div className="text-sm text-gray-600">Answers</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">{currentUser.votesReceived}</div>
            <div className="text-sm text-gray-600">Votes</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">{currentUser.viewsCount.toLocaleString()}</div>
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
              {recentActivity.length > 0 ? (
                recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {activity.type === "question" && <MessageSquare className="w-5 h-5 text-blue-600" />}
                      {activity.type === "answer" && <MessageSquare className="w-5 h-5 text-green-600" />}
                      {activity.type === "comment" && <MessageSquare className="w-5 h-5 text-gray-600" />}
                      <div>
                        <Link href={`/${activity.type === "question" ? "question" : "comment"}/${activity.id}`}>
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

        <TabsContent value="badges" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="p-4 text-center">
                <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                <div className="text-2xl font-bold">{currentUser.badges.gold}</div>
                <div className="text-sm text-gray-600">Gold Badges</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Trophy className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <div className="text-2xl font-bold">{currentUser.badges.silver}</div>
                <div className="text-sm text-gray-600">Silver Badges</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Trophy className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                <div className="text-2xl font-bold">{currentUser.badges.bronze}</div>
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
              <CardTitle>My Questions ({myQuestions.length})</CardTitle>
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
                          <div className="flex items-center gap-2 mb-3">
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={question.author.avatar || "/placeholder.svg"} />
                              <AvatarFallback className="bg-blue-100 text-blue-700 text-sm">
                                {question.author.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex items-center gap-2 text-sm">
                              <span className="font-medium text-blue-600 hover:text-blue-800 cursor-pointer">
                                {question.author.name}
                              </span>
                              <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-600">
                                {question.author.badge}
                              </Badge>
                              <span className="text-gray-500">• Asked in {question.category}</span>
                            </div>
                          </div>

                          <Link href={`/question/${question.id}`}>
                            <h3 className="font-semibold text-lg mb-3 hover:text-blue-600 cursor-pointer text-gray-900 leading-tight">
                              {question.title}
                            </h3>
                          </Link>

                          <p className="text-gray-600 mb-4 line-clamp-2 leading-relaxed">{question.content}</p>

                          <div className="flex flex-wrap gap-2 mb-4">
                            {question.tags.map((tag) => (
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
                                <span>{question.replies} answers</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Eye className="w-4 h-4" />
                                <span>{question.views} views</span>
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
                  <p>You haven't asked any questions yet.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="answers">
          <Card>
            <CardHeader>
              <CardTitle>My Answers ({myAnswers.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {myAnswers.length > 0 ? (
                myAnswers.map((answer) => (
                  <Card key={answer.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="flex flex-col items-center gap-2 text-center min-w-[60px]">
                          <Button
                            variant="ghost"
                            size="icon"
                            // onClick={() => handleAnswerVote(answer.id, answer.votes, 'up')} // Implement answer voting if needed
                            className="hover:bg-blue-50 hover:text-blue-600"
                          >
                            <ArrowUp className="w-5 h-5" />
                          </Button>
                          <span className="text-lg font-semibold text-gray-700">{answer.votes}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            // onClick={() => handleAnswerVote(answer.id, answer.votes, 'down')} // Implement answer voting if needed
                            className="hover:bg-blue-50 hover:text-blue-600"
                          >
                            <ArrowDown className="w-5 h-5" />
                          </Button>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-3">
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={answer.author.avatar || "/placeholder.svg"} />
                              <AvatarFallback className="bg-blue-100 text-blue-700 text-sm">
                                {answer.author.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex items-center gap-2 text-sm">
                              <span className="font-medium text-blue-600 hover:text-blue-800 cursor-pointer">
                                {answer.author.name}
                              </span>
                              <span className="text-gray-500">• Answered {answer.timestamp}</span>
                            </div>
                          </div>
                          <Link href={`/question/${answer.questionId}`}>
                            <h3 className="font-semibold text-lg mb-3 hover:text-blue-600 cursor-pointer text-gray-900 leading-tight">
                              {answer.content.substring(0, 100)}... {/* Show snippet of answer */}
                            </h3>
                          </Link>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-6 text-sm text-gray-500">
                              <div className="flex items-center gap-1">
                                <MessageSquare className="w-4 h-4" />
                                <span>{answer.replies.length} replies</span>
                              </div>
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
                  <p>You haven't provided any answers yet.</p>
                </div>
              )}
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
                      value={editableProfileData?.name || ""}
                      onChange={(e) => setEditableProfileData({ ...editableProfileData, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={editableProfileData?.username || ""}
                      onChange={(e) => setEditableProfileData({ ...editableProfileData, username: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={editableProfileData?.bio || ""}
                    onChange={(e) => setEditableProfileData({ ...editableProfileData, bio: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={editableProfileData?.location || ""}
                      onChange={(e) => setEditableProfileData({ ...editableProfileData, location: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      value={editableProfileData?.website || ""}
                      onChange={(e) => setEditableProfileData({ ...editableProfileData, website: e.target.value })}
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

      <div className="flex justify-end pt-6">
        <Button onClick={handleSave} className="gap-2" disabled={isEditing}>
          <Save className="w-4 h-4" />
          Save All Changes
        </Button>
      </div>
    </div>
  )
}
