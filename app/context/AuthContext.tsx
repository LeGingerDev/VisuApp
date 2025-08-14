import { createContext, FC, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from "react"
import { useMMKVString } from "react-native-mmkv"
import { authService, SignInData, SignUpData } from "../services/auth/authService"

export type AuthContextType = {
  isAuthenticated: boolean
  authToken?: string
  authEmail?: string
  displayName?: string
  userId?: string
  isLoading: boolean
  setAuthToken: (token?: string) => void
  setAuthEmail: (email: string) => void
  signIn: (data: SignInData) => Promise<{ success: boolean; error?: string }>
  signUp: (data: SignUpData) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  validationError: string
}

export const AuthContext = createContext<AuthContextType | null>(null)

export interface AuthProviderProps {}

export const AuthProvider: FC<PropsWithChildren<AuthProviderProps>> = ({ children }) => {
  const [authToken, setAuthToken] = useMMKVString("AuthProvider.authToken")
  const [authEmail, setAuthEmail] = useMMKVString("AuthProvider.authEmail")
  const [displayName, setDisplayName] = useMMKVString("AuthProvider.displayName")
  const [userId, setUserId] = useMMKVString("AuthProvider.userId")
  const [isLoading, setIsLoading] = useState(true)

  // Check for existing session on app load
  useEffect(() => {
    const checkSession = async () => {
      setIsLoading(true)
      const { success, session, user } = await authService.getSession()
      
      if (success && session) {
        setAuthToken(session.access_token)
        setAuthEmail(user?.email || "")
        
        // Get user profile to fetch display name
        if (user) {
          setUserId(user.id)
          
          // Fetch additional user data from users table
          const { data } = await authService.getUserProfile(user.id)
          if (data) {
            setDisplayName(data.full_name)
          }
        }
      } else {
        setAuthToken(undefined)
        setAuthEmail("")
        setDisplayName("")
        setUserId("")
      }
      
      setIsLoading(false)
    }
    
    checkSession()
  }, [setAuthEmail, setAuthToken, setDisplayName, setUserId])

  const signIn = useCallback(async (data: SignInData) => {
    setIsLoading(true)
    const result = await authService.signIn(data)
    
    if (result.success && result.session && result.user) {
      setAuthToken(result.session.access_token)
      setAuthEmail(result.user.email || "")
      setUserId(result.user.id)
      
      // Fetch additional user data from users table
      const { data: userData } = await authService.getUserProfile(result.user.id)
      if (userData) {
        setDisplayName(userData.full_name)
      }
    }
    
    setIsLoading(false)
    return { 
      success: result.success, 
      error: result.error 
    }
  }, [setAuthEmail, setAuthToken, setDisplayName, setUserId])

  const signUp = useCallback(async (data: SignUpData) => {
    setIsLoading(true)
    const result = await authService.signUp(data)
    
    if (result.success && result.session && result.user) {
      setAuthToken(result.session.access_token)
      setAuthEmail(data.email)
      setDisplayName(data.displayName)
      setUserId(result.user.id)
    }
    
    setIsLoading(false)
    return { 
      success: result.success, 
      error: result.error 
    }
  }, [setAuthEmail, setAuthToken, setDisplayName, setUserId])

  const logout = useCallback(async () => {
    setIsLoading(true)
    await authService.signOut()
    setAuthToken(undefined)
    setAuthEmail("")
    setDisplayName("")
    setUserId("")
    setIsLoading(false)
  }, [setAuthEmail, setAuthToken, setDisplayName, setUserId])

  const validationError = useMemo(() => {
    if (!authEmail || authEmail.length === 0) return "can't be blank"
    if (authEmail.length < 6) return "must be at least 6 characters"
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(authEmail)) return "must be a valid email address"
    return ""
  }, [authEmail])

  const value = {
    isAuthenticated: !!authToken,
    authToken,
    authEmail,
    displayName,
    userId,
    isLoading,
    setAuthToken,
    setAuthEmail,
    signIn,
    signUp,
    logout,
    validationError,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within an AuthProvider")
  return context
}