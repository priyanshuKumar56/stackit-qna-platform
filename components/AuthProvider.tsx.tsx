// @/components/AuthProvider.tsx
"use client"

import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { checkAuth } from '@/store/usersSlice'

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const dispatch = useAppDispatch()
  const { token, authChecked, currentUser, isLoading } = useAppSelector((state) => state.users)

  useEffect(() => {
    // Only check auth if:
    // 1. We haven't checked auth yet
    // 2. We have a token
    // 3. We don't have user data
    // 4. We're not currently loading
    if (!authChecked && token && !currentUser && !isLoading) {
      console.log("AuthProvider: Checking authentication...")
      dispatch(checkAuth())
    }
  }, [dispatch, authChecked, token, currentUser, isLoading])

  return <>{children}</>
}

// Usage in your app layout or root component:
// <AuthProvider>
//   <YourApp />
// </AuthProvider>