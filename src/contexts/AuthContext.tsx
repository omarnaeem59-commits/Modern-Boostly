import { createContext, useContext, useState, useEffect, ReactNode } from "react"

interface AuthContextType {
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  signup: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const STORAGE_KEY = "boostly_auth"

interface StoredAuth {
  email: string
  isAuthenticated: boolean
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is authenticated on mount
    const storedAuth = localStorage.getItem(STORAGE_KEY)
    if (storedAuth) {
      try {
        const auth: StoredAuth = JSON.parse(storedAuth)
        setIsAuthenticated(auth.isAuthenticated)
      } catch (error) {
        console.error("Error parsing auth data:", error)
        localStorage.removeItem(STORAGE_KEY)
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    // Check if user exists in localStorage
    const users = JSON.parse(localStorage.getItem("boostly_users") || "[]")
    const user = users.find((u: any) => u.email === email)

    if (!user) {
      return false // User not found
    }

    // In a real app, you'd hash and compare passwords
    // For demo purposes, we'll do a simple comparison
    if (user.password !== password) {
      return false // Wrong password
    }

    // Set authentication
    const auth: StoredAuth = {
      email,
      isAuthenticated: true,
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(auth))
    setIsAuthenticated(true)
    
    // Trigger user reload by dispatching custom event
    window.dispatchEvent(new CustomEvent("userLoggedIn", { detail: { userId: user.id } }))
    
    return true
  }

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    // Check if user already exists
    const users = JSON.parse(localStorage.getItem("boostly_users") || "[]")
    const existingUser = users.find((u: any) => u.email === email)

    if (existingUser) {
      return false // User already exists
    }

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      email,
      password, // In production, hash this password
      name,
      createdAt: new Date().toISOString(),
    }

    users.push(newUser)
    localStorage.setItem("boostly_users", JSON.stringify(users))

    // Initialize user data
    const initials = name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)

    const defaultUserData = {
      id: newUser.id,
      name,
      email,
      initials,
      level: 1,
      points: 0,
      badge: "Newcomer",
      streak: 0,
      tasksCompleted: 0,
      focusHours: 0,
      avatar: "gradient-primary",
      rank: 999,
      previousRank: 999,
      weeklyPoints: 0,
    }

    localStorage.setItem(`boostly_user_${newUser.id}`, JSON.stringify(defaultUserData))

    // Auto-login after signup
    const auth: StoredAuth = {
      email,
      isAuthenticated: true,
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(auth))
    setIsAuthenticated(true)
    
    // Trigger user reload by dispatching custom event
    window.dispatchEvent(new CustomEvent("userLoggedIn", { detail: { userId: newUser.id } }))
    
    return true
  }

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY)
    setIsAuthenticated(false)
    
    // Trigger user clear by dispatching custom event
    window.dispatchEvent(new CustomEvent("userLoggedOut"))
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

