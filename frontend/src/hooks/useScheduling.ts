import { useState, useEffect } from 'react'
import { MentoringSession, ChatMessage } from '../types'
import {
  fetchSessionsByUser,
  createSession,
  updateSessionStatus,
  fetchChatMessages,
  sendChatMessage,
} from '../services/schedulingService'

export function useScheduling(userId: string) {
  const [sessions, setSessions] = useState<MentoringSession[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) return
    fetchSessionsByUser(userId)
      .then((res) => setSessions(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [userId])

  const scheduleSession = async (data: {
    mentorId: string
    menteeId: string
    scheduledAt: string
    durationMinutes?: number
    topic: string
    notes?: string
  }) => {
    try {
      const res = await createSession(data)
      setSessions((prev) => [...prev, res.data])
      return res.data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao agendar sessão')
      return null
    }
  }

  const updateStatus = async (
    id: string,
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  ) => {
    try {
      const res = await updateSessionStatus(id, status)
      setSessions((prev) => prev.map((s) => (s.id === id ? res.data : s)))
      return res.data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar status')
      return null
    }
  }

  return { sessions, loading, error, scheduleSession, updateStatus }
}

export function useChat(sessionId: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!sessionId) return
    fetchChatMessages(sessionId)
      .then((res) => setMessages(res.data))
      .catch(() => setMessages([]))
      .finally(() => setLoading(false))
  }, [sessionId])

  const send = async (senderId: string, message: string) => {
    const res = await sendChatMessage(sessionId, senderId, message)
    setMessages((prev) => [...prev, res.data])
    return res.data
  }

  return { messages, loading, send }
}
