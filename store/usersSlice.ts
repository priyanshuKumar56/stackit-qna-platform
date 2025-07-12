import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import { usersAPI } from "@/lib/api"

export interface User {
  id: string
  name: string
  email: string
  avatar: string
  reputation: number
  badge: string
  bio?: string
  location?: string
  website?: string
  joinedAt: string
  questionsCount: number
  answersCount: number
  acceptedAnswersCount: number
  badges: string[]
  isFollowing?: boolean
}

interface UsersState {
  currentUser: User | null
  users: User[]
  userProfile: User | null
  leaderboard: User[]
  loading: boolean
  error: string | null
}

const initialState: UsersState = {
  currentUser: null,
  users: [],
  userProfile: null,
  leaderboard: [],
  loading: false,
  error: null,
}

// Async thunks for API calls
export const fetchCurrentUser = createAsyncThunk("users/fetchCurrentUser", async () => {
  const response = await usersAPI.getCurrentUser()
  return response.data
})

export const fetchUserProfile = createAsyncThunk("users/fetchUserProfile", async (userId: string) => {
  const response = await usersAPI.getUserProfile(userId)
  return response.data
})

export const updateUserProfile = createAsyncThunk(
  "users/updateUserProfile",
  async (updateData: {
    name?: string
    bio?: string
    location?: string
    website?: string
    avatar?: string
  }) => {
    const response = await usersAPI.updateProfile(updateData)
    return response.data
  },
)

export const fetchLeaderboard = createAsyncThunk(
  "users/fetchLeaderboard",
  async (params: {
    period?: "week" | "month" | "year" | "all"
    limit?: number
  }) => {
    const response = await usersAPI.getLeaderboard(params)
    return response.data
  },
)

export const followUser = createAsyncThunk("users/followUser", async (userId: string) => {
  const response = await usersAPI.followUser(userId)
  return { userId, isFollowing: response.data.isFollowing }
})

export const searchUsers = createAsyncThunk(
  "users/searchUsers",
  async (params: {
    query: string
    page?: number
    limit?: number
  }) => {
    const response = await usersAPI.searchUsers(params)
    return response.data
  },
)

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    clearCurrentUser: (state) => {
      state.currentUser = null
    },
    clearUserProfile: (state) => {
      state.userProfile = null
    },
    clearError: (state) => {
      state.error = null
    },
    updateUserReputation: (state, action: PayloadAction<{ userId: string; amount: number }>) => {
      const { userId, amount } = action.payload

      // Update current user
      if (state.currentUser && state.currentUser.id === userId) {
        state.currentUser.reputation += amount
      }

      // Update user profile
      if (state.userProfile && state.userProfile.id === userId) {
        state.userProfile.reputation += amount
      }

      // Update in users list
      const userIndex = state.users.findIndex((u) => u.id === userId)
      if (userIndex !== -1) {
        state.users[userIndex].reputation += amount
      }

      // Update in leaderboard
      const leaderboardIndex = state.leaderboard.findIndex((u) => u.id === userId)
      if (leaderboardIndex !== -1) {
        state.leaderboard[leaderboardIndex].reputation += amount
      }
    },
    incrementUserStats: (
      state,
      action: PayloadAction<{
        userId: string
        type: "questions" | "answers" | "acceptedAnswers"
      }>,
    ) => {
      const { userId, type } = action.payload

      const updateUserStats = (user: User) => {
        switch (type) {
          case "questions":
            user.questionsCount += 1
            break
          case "answers":
            user.answersCount += 1
            break
          case "acceptedAnswers":
            user.acceptedAnswersCount += 1
            break
        }
      }

      // Update current user
      if (state.currentUser && state.currentUser.id === userId) {
        updateUserStats(state.currentUser)
      }

      // Update user profile
      if (state.userProfile && state.userProfile.id === userId) {
        updateUserStats(state.userProfile)
      }

      // Update in users list
      const userIndex = state.users.findIndex((u) => u.id === userId)
      if (userIndex !== -1) {
        updateUserStats(state.users[userIndex])
      }
    },
  },
  extraReducers: (builder) => {
    // Fetch Current User
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false
        state.currentUser = action.payload.user
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to fetch current user"
      })

    // Fetch User Profile
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false
        state.userProfile = action.payload.user
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to fetch user profile"
      })

    // Update User Profile
    builder.addCase(updateUserProfile.fulfilled, (state, action) => {
      const updatedUser = action.payload.user

      // Update current user
      if (state.currentUser && state.currentUser.id === updatedUser.id) {
        state.currentUser = { ...state.currentUser, ...updatedUser }
      }

      // Update user profile
      if (state.userProfile && state.userProfile.id === updatedUser.id) {
        state.userProfile = { ...state.userProfile, ...updatedUser }
      }
    })

    // Fetch Leaderboard
    builder
      .addCase(fetchLeaderboard.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchLeaderboard.fulfilled, (state, action) => {
        state.loading = false
        state.leaderboard = action.payload.users
      })
      .addCase(fetchLeaderboard.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to fetch leaderboard"
      })

    // Follow User
    builder.addCase(followUser.fulfilled, (state, action) => {
      const { userId, isFollowing } = action.payload

      // Update user profile
      if (state.userProfile && state.userProfile.id === userId) {
        state.userProfile.isFollowing = isFollowing
      }

      // Update in users list
      const userIndex = state.users.findIndex((u) => u.id === userId)
      if (userIndex !== -1) {
        state.users[userIndex].isFollowing = isFollowing
      }
    })

    // Search Users
    builder
      .addCase(searchUsers.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(searchUsers.fulfilled, (state, action) => {
        state.loading = false
        state.users = action.payload.users
      })
      .addCase(searchUsers.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to search users"
      })
  },
})

export const { clearCurrentUser, clearUserProfile, clearError, updateUserReputation, incrementUserStats } =
  usersSlice.actions

export default usersSlice.reducer
