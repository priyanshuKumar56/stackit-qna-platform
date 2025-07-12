import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface User {
  id: string
  name: string
  username: string
  email: string
  bio: string
  location: string
  website: string
  joinDate: string
  avatar: string
  reputation: number
  questionsCount: number
  answersCount: number
  votesReceived: number
  viewsCount: number
  badges: {
    gold: number
    silver: number
    bronze: number
  }
}

interface UsersState {
  users: User[]
  currentUser: User | null
  loading: boolean
}

const initialState: UsersState = {
  users: [
    {
      id: "user-1",
      name: "John Doe",
      username: "johndoe",
      email: "john.doe@example.com",
      bio: "Full-stack developer passionate about React, Node.js, and building great user experiences. Always learning and sharing knowledge with the community.",
      location: "San Francisco, CA",
      website: "https://johndoe.dev",
      joinDate: "January 2023",
      avatar: "/placeholder.svg",
      reputation: 1250,
      questionsCount: 23,
      answersCount: 87,
      votesReceived: 156,
      viewsCount: 12500,
      badges: {
        gold: 2,
        silver: 8,
        bronze: 15,
      },
    },
    {
      id: "user-2",
      name: "HarHarMahadev108",
      username: "harharmahadev108",
      email: "harhar@example.com",
      bio: "Enthusiast in crypto and referral programs.",
      location: "India",
      website: "",
      joinDate: "March 2024",
      avatar: "/placeholder.svg",
      reputation: 10,
      questionsCount: 3,
      answersCount: 0,
      votesReceived: 0,
      viewsCount: 43,
      badges: {
        gold: 0,
        silver: 0,
        bronze: 1,
      },
    },
    {
      id: "user-3",
      name: "DevExpert",
      username: "devexpert",
      email: "dev@example.com",
      bio: "Experienced software engineer specializing in Next.js and modern web development.",
      location: "New York, NY",
      website: "https://devexpert.com",
      joinDate: "October 2022",
      avatar: "/placeholder.svg",
      reputation: 1250,
      questionsCount: 1,
      answersCount: 7,
      votesReceived: 15,
      viewsCount: 234,
      badges: {
        gold: 1,
        silver: 3,
        bronze: 5,
      },
    },
  ],
  currentUser: null, // This will be set based on a logged-in user, for now we'll use user-1 as default
  loading: false,
}

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setCurrentUser: (state, action: PayloadAction<string | null>) => {
      state.currentUser = state.users.find((user) => user.id === action.payload) || null
    },
    updateUserProfile: (state, action: PayloadAction<Partial<User>>) => {
      if (state.currentUser) {
        state.currentUser = { ...state.currentUser, ...action.payload }
        // Also update in the main users array
        const index = state.users.findIndex((user) => user.id === state.currentUser?.id)
        if (index !== -1) {
          state.users[index] = state.currentUser
        }
      }
    },
    updateUserStats: (
      state,
      action: PayloadAction<{ userId: string; type: "question" | "answer" | "vote" | "view" }>,
    ) => {
      const user = state.users.find((u) => u.id === action.payload.userId)
      if (user) {
        switch (action.payload.type) {
          case "question":
            user.questionsCount += 1
            break
          case "answer":
            user.answersCount += 1
            break
          case "vote":
            user.votesReceived += 1
            break
          case "view":
            user.viewsCount += 1
            break
        }
        // For simplicity, reputation is not dynamically calculated here, but would be in a real app
      }
    },
    updateUserReputation: (state, action: PayloadAction<{ userId: string; amount: number }>) => {
      const user = state.users.find((u) => u.id === action.payload.userId)
      if (user) {
        user.reputation += action.payload.amount
      }
    },
  },
})

export const { setCurrentUser, updateUserProfile, updateUserStats, updateUserReputation } = usersSlice.actions
export default usersSlice.reducer
