// @/lib/auth.ts
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { loginUser, registerUser, checkAuth, logoutUser, logout } from "@/store/usersSlice"
import { useEffect } from "react"

// Export the same interface as your Zustand store to maintain compatibility
export const useAuthStore = () => {
  const dispatch = useAppDispatch()
  const { currentUser, token, isAuthenticated, isLoading, error, authChecked } = useAppSelector((state) => state.users)
  console.log("Auth Store State:", useAppSelector((state) => state.users))
  
  // Auto-check auth on hook initialization
  useEffect(() => {
    // Only check auth if we haven't checked yet, have a token, and not currently loading
    if (!authChecked && !isLoading && token && !currentUser) {
      console.log("Checking auth...")
      dispatch(checkAuth()) // No parameters needed
    }
  }, [authChecked, isLoading, token, currentUser, dispatch])
  
  return {
    user: currentUser,
    token,
    isAuthenticated,
    isLoading,
    error,
    authChecked,
    login: async (email: string, password: string) => {
      const result = await dispatch(loginUser({ email, password }))
      console.log("Login Result:", result)
      if (loginUser.rejected.match(result)) {
        throw new Error(result.payload as string || "Login failed")
      }
      return result.payload
    },
    register: async (data: { name: string; username: string; email: string; password: string }) => {
      const result = await dispatch(registerUser(data))
      if (registerUser.rejected.match(result)) {
        throw new Error(result.payload as string || "Registration failed")
      }
      return result.payload
    },
    logout: async () => {
      // Use the async logout thunk for proper API cleanup
      await dispatch(logoutUser())
    },
    logoutImmediate: () => {
      // Use the sync logout action for immediate logout
      dispatch(logout())
    },
    // Manual auth check function (optional)
    checkAuth: async () => {
      const result = await dispatch(checkAuth())
      if (checkAuth.rejected.match(result)) {
        throw new Error(result.payload as string || "Authentication failed")
      }
      return result.payload
    },
  }
}

// Helper hook to check if user is authenticated and ready
export const useAuth = () => {
  const { user, isAuthenticated, isLoading, authChecked } = useAuthStore()
  console.log("useAuth State:", { user, isAuthenticated, isLoading, authChecked })
  return {
    user,
    isAuthenticated,
    isLoading,
    authChecked,
    isReady: authChecked && !isLoading,
    isLoggedIn: isAuthenticated && !!user,
  }
}

// Helper hook for protected routes
export const useProtectedRoute = () => {
  const { isAuthenticated, isLoading, authChecked } = useAuth()
  
  return {
    isAuthenticated,
    isLoading: isLoading || !authChecked,
    shouldRedirect: authChecked && !isLoading && !isAuthenticated,
  }
}