import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react"

export interface Notification {
  id: string
  title: string
  message: string
  type: "achievement" | "reminder" | "social" | "system"
  timestamp: Date
  read: boolean
  action?: {
    label: string
    onClick: () => void
  }
  metadata?: {
    achievementType?: "badge" | "level"
    badgeName?: string
    level?: number
  }
}

interface NotificationContextType {
  notifications: Notification[]
  unreadCount: number
  addNotification: (notification: Omit<Notification, "id" | "timestamp" | "read">) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  deleteNotification: (id: string) => void
  clearAll: () => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

const STORAGE_KEY = "boostly_notifications"

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])

  // Load notifications from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        // Convert timestamp strings back to Date objects
        const notificationsWithDates = parsed.map((n: any) => ({
          ...n,
          timestamp: new Date(n.timestamp),
        }))
        setNotifications(notificationsWithDates)
      }
    } catch (error) {
      console.error("Error loading notifications:", error)
    }
  }, [])

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications))
    } catch (error) {
      console.error("Error saving notifications:", error)
    }
  }, [notifications])

  const addNotification = useCallback((notification: Omit<Notification, "id" | "timestamp" | "read">) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      read: false,
    }

    setNotifications((prev) => [newNotification, ...prev])
  }, [])

  // Listen for user level up and badge gained events
  useEffect(() => {
    const handleLevelUp = (event: CustomEvent) => {
      const { oldLevel, newLevel, newBadge } = event.detail
      
      addNotification({
        title: "🎉 Level Up!",
        message: `Congratulations! You've reached Level ${newLevel}! Keep up the amazing work!`,
        type: "achievement",
        metadata: {
          achievementType: "level",
          level: newLevel,
        },
      })
    }

    const handleBadgeGained = (event: CustomEvent) => {
      const { oldBadge, newBadge, level } = event.detail
      
      // Only notify if it's a new badge (not the initial badge)
      if (oldBadge && oldBadge !== newBadge) {
        addNotification({
          title: "🏆 New Badge Earned!",
          message: `Congratulations! You've earned the "${newBadge}" badge! Your dedication is paying off!`,
          type: "achievement",
          metadata: {
            achievementType: "badge",
            badgeName: newBadge,
            level: level,
          },
        })
      }
    }

    window.addEventListener("userLevelUp", handleLevelUp as EventListener)
    window.addEventListener("userBadgeGained", handleBadgeGained as EventListener)

    return () => {
      window.removeEventListener("userLevelUp", handleLevelUp as EventListener)
      window.removeEventListener("userBadgeGained", handleBadgeGained as EventListener)
    }
  }, [addNotification])

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
    )
  }, [])

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })))
  }, [])

  const deleteNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id))
  }, [])

  const clearAll = useCallback(() => {
    setNotifications([])
  }, [])

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearAll,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider")
  }
  return context
}

