import { useState, useEffect, useCallback } from 'react'
import { MatchResult, Notification } from '../types'
import { fetchMatches, sendMatchNotification, fetchNotifications, markNotificationRead } from '../services/matchmakingService'

export function useMatchmaking(userId: string, query?: string) {
  const [matches, setMatches] = useState<MatchResult[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    if (!userId) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetchMatches(userId, { query })
      setMatches(res.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar matches')
    } finally {
      setLoading(false)
    }
  }, [userId, query])

  useEffect(() => {
    load()
  }, [load])

  const notifyMentor = async (mentorId: string) => {
    try {
      await sendMatchNotification(userId, mentorId)
      return true
    } catch {
      return false
    }
  }

  return { matches, loading, error, refetch: load, notifyMentor }
}

export function useNotifications(userId: string) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) return
    fetchNotifications(userId)
      .then((res) => setNotifications(res.data))
      .catch(() => setNotifications([]))
      .finally(() => setLoading(false))
  }, [userId])

  const markRead = async (id: string) => {
    await markNotificationRead(id)
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  return { notifications, loading, markRead, unreadCount }
}
