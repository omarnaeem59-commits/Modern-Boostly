/**
 * Storage utilities for user-specific data
 */

const TASKS_STORAGE_KEY = "boostly_tasks_"
const HABITS_STORAGE_KEY = "boostly_habits_"

export function getUserTasks(userId: string): any[] {
  try {
    const tasks = localStorage.getItem(`${TASKS_STORAGE_KEY}${userId}`)
    return tasks ? JSON.parse(tasks) : []
  } catch {
    return []
  }
}

export function saveUserTasks(userId: string, tasks: any[]) {
  try {
    localStorage.setItem(`${TASKS_STORAGE_KEY}${userId}`, JSON.stringify(tasks))
  } catch (error) {
    console.error("Error saving tasks:", error)
  }
}

export function getUserHabits(userId: string): any[] {
  try {
    const habits = localStorage.getItem(`${HABITS_STORAGE_KEY}${userId}`)
    return habits ? JSON.parse(habits) : []
  } catch {
    return []
  }
}

export function saveUserHabits(userId: string, habits: any[]) {
  try {
    localStorage.setItem(`${HABITS_STORAGE_KEY}${userId}`, JSON.stringify(habits))
  } catch (error) {
    console.error("Error saving habits:", error)
  }
}

