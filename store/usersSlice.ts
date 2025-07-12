import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import { usersAPI, authAPI } from "@/lib/api"
import Cookies from "js-cookie"

export interface User {
  id: string
  name: string
  email: string
  username?: string
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
  // Auth state
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  authChecked: boolean // Track if we've checked for existing auth
}

// Check for existing token on initialization
const getInitialAuthState = () => {
  const token = Cookies.get("auth-token")
  return {
    token,
    isAuthenticated: !!token,
    authChecked: false, // Will be set to true after checkAuth
  }
}

const initialAuthState = getInitialAuthState()

const initialState: UsersState = {
  currentUser: null,
  users: [],
  userProfile: null,
  leaderboard: [],
  loading: false,
  error: null,
  // Auth state
  token: initialAuthState.token,
  isAuthenticated: initialAuthState.isAuthenticated,
  isLoading: false,
  authChecked: initialAuthState.authChecked,
}

// Auth async thunks
export const loginUser = createAsyncThunk(
  "users/login",
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await authAPI.login({ email, password })
      const { token, user } = response.data
      
      // Set cookie
      Cookies.set("auth-token", token, { expires: 7, secure: true, sameSite: 'strict' })
      
      return { token, user }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Login failed")
    }
  }
)

export const registerUser = createAsyncThunk(
  "users/register",
  async (data: { name: string; username: string; email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await authAPI.register(data)
      const { token, user } = response.data
      
      // Set cookie
      Cookies.set("auth-token", token, { expires: 7, secure: true, sameSite: 'strict' })
      
      return { token, user }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Registration failed")
    }
  }
)

export const checkAuth = createAsyncThunk(
  "users/checkAuth", 
  async (_, { rejectWithValue }) => {
    try {
      const token = Cookies.get("auth-token")
      if (!token) {
        throw new Error("No token found")
      }
      
      const response = await usersAPI.getCurrentUser()
      return { user: response.data, token }
    } catch (error: any) {
      // Remove invalid token
      Cookies.remove("auth-token")
      return rejectWithValue(error.response?.data?.message || "Authentication failed")
    }
  }
)

export const logoutUser = createAsyncThunk(
  "users/logout",
  async (_, { rejectWithValue }) => {
    try {
      // Call logout API if it exists
      await authAPI.logout()
    } catch (error) {
      // Continue with logout even if API call fails
      console.warn("Logout API call failed, continuing with local logout")
    } finally {
      // Always remove token locally
      Cookies.remove("auth-token")
    }
  }
)

// Existing async thunks for API calls
export const fetchCurrentUser = createAsyncThunk(
  "users/fetchCurrentUser", 
  async (_, { rejectWithValue }) => {
    try {
      const response = await usersAPI.getCurrentUser()
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch current user")
    }
  }
)

export const fetchUserProfile = createAsyncThunk(
  "users/fetchUserProfile", 
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await usersAPI.getUserProfile(userId)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch user profile")
    }
  }
)

export const updateUserProfile = createAsyncThunk(
  "users/updateUserProfile",
  async (updateData: {
    name?: string
    bio?: string
    location?: string
    website?: string
    avatar?: string
  }, { rejectWithValue }) => {
    try {
      const response = await usersAPI.updateProfile(updateData)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to update profile")
    }
  },
)

export const fetchLeaderboard = createAsyncThunk(
  "users/fetchLeaderboard",
  async (params: {
    period?: "week" | "month" | "year" | "all"
    limit?: number
  }, { rejectWithValue }) => {
    try {
      const response = await usersAPI.getLeaderboard(params)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch leaderboard")
    }
  },
)

export const followUser = createAsyncThunk(
  "users/followUser", 
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await usersAPI.followUser(userId)
      return { userId, isFollowing: response.data.isFollowing }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to follow user")
    }
  }
)

export const searchUsers = createAsyncThunk(
  "users/searchUsers",
  async (params: {
    query: string
    page?: number
    limit?: number
  }, { rejectWithValue }) => {
    try {
      const response = await usersAPI.searchUsers(params)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to search users")
    }
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
    // Manual logout reducer (for immediate logout without API call)
    logout: (state) => {
      Cookies.remove("auth-token")
      state.currentUser = null
      state.token = null
      state.isAuthenticated = false
      state.authChecked = true
      state.error = null
      state.isLoading = false
    },
    // Reset auth state
    resetAuthState: (state) => {
      state.currentUser = null
      state.token = null
      state.isAuthenticated = false
      state.authChecked = false
      state.error = null
      state.isLoading = false
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
    // Auth cases
    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.currentUser = action.payload.user
        state.token = action.payload.token
        state.isAuthenticated = true
        state.authChecked = true
        state.error = null
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false
        state.isAuthenticated = false
        state.authChecked = true
        state.currentUser = null
        state.token = null
        state.error = action.payload as string
      })

    // Register
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.currentUser = action.payload.user
        state.token = action.payload.token
        state.isAuthenticated = true
        state.authChecked = true
        state.error = null
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false
        state.isAuthenticated = false
        state.authChecked = true
        state.currentUser = null
        state.token = null
        state.error = action.payload as string
      })

    // Check Auth
    builder
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false
        state.currentUser = action.payload.user
        state.token = action.payload.token
        state.isAuthenticated = true
        state.authChecked = true
        state.error = null
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.isLoading = false
        state.currentUser = null
        state.token = null
        state.isAuthenticated = false
        state.authChecked = true
        state.error = action.payload as string
      })

    // Logout
    builder
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false
        state.currentUser = null
        state.token = null
        state.isAuthenticated = false
        state.authChecked = true
        state.error = null
      })
      .addCase(logoutUser.rejected, (state) => {
        // Even if logout fails, clear local state
        state.isLoading = false
        state.currentUser = null
        state.token = null
        state.isAuthenticated = false
        state.authChecked = true
        state.error = null
      })

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
        state.error = action.payload as string
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
        state.error = action.payload as string
      })

    // Update User Profile
    builder
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false
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
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
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
        state.error = action.payload as string
      })

    // Follow User
    builder
      .addCase(followUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(followUser.fulfilled, (state, action) => {
        state.loading = false
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
      .addCase(followUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
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
        state.error = action.payload as string
      })
  },
})

export const { 
  clearCurrentUser, 
  clearUserProfile, 
  clearError, 
  logout, 
  resetAuthState,
  updateUserReputation, 
  incrementUserStats 
} = usersSlice.actions

export default usersSlice.reducer