// @/lib/auth.ts
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { loginUser, registerUser, checkAuth, logout } from "@/store/usersSlice"

// Export the same interface as your Zustand store to maintain compatibility
export const useAuthStore = () => {
  const dispatch = useAppDispatch()
  const { currentUser, token, isAuthenticated, isLoading, error } = useAppSelector((state) => state.users)
  
  return {
    user: currentUser,
    token,
    isAuthenticated,
    isLoading,
    error,
    login: async (email: string, password: string) => {
      const result = await dispatch(loginUser({ email, password }))
      if (loginUser.rejected.match(result)) {
        throw new Error(result.error.message || "Login failed")
      }
    },
    register: async (data: { name: string; username: string; email: string; password: string }) => {
      const result = await dispatch(registerUser(data))
      if (registerUser.rejected.match(result)) {
        throw new Error(result.error.message || "Registration failed")
      }
    },
    logout: () => dispatch(logout()),
    checkAuth: async () => {
      const result = await dispatch(checkAuth())
      if (checkAuth.rejected.match(result)) {
        throw new Error(result.error.message || "Authentication failed")
      }
    },
  }
}