import { MatchResult } from './matchmakingEngine'

export interface Notification {
  id: string
  type: 'match_found' | 'session_scheduled' | 'reminder'
  recipientId: string
  message: string
  data?: Record<string, unknown>
  createdAt: string
  read: boolean
}

// In-memory store for MVP
const notifications: Notification[] = []
let notifCounter = 1

export function createMatchNotification(match: MatchResult): Notification[] {
  const mentorNotif: Notification = {
    id: `n${notifCounter++}`,
    type: 'match_found',
    recipientId: match.mentor.id,
    message: `✨ ${match.mentee.name} quer você como mentora! Score de compatibilidade: ${match.score}`,
    data: {
      menteeId: match.mentee.id,
      menteeName: match.mentee.name,
      score: match.score,
      reasons: match.matchReasons,
    },
    createdAt: new Date().toISOString(),
    read: false,
  }

  const menteeNotif: Notification = {
    id: `n${notifCounter++}`,
    type: 'match_found',
    recipientId: match.mentee.id,
    message: `🌟 Encontramos uma mentora incrível para você: ${match.mentor.name}!`,
    data: {
      mentorId: match.mentor.id,
      mentorName: match.mentor.name,
      score: match.score,
      reasons: match.matchReasons,
    },
    createdAt: new Date().toISOString(),
    read: false,
  }

  notifications.push(mentorNotif, menteeNotif)
  return [mentorNotif, menteeNotif]
}

export function getNotificationsForUser(userId: string): Notification[] {
  return notifications.filter((n) => n.recipientId === userId)
}

export function markAsRead(notificationId: string): boolean {
  const notif = notifications.find((n) => n.id === notificationId)
  if (!notif) return false
  notif.read = true
  return true
}

export function getAllNotifications(): Notification[] {
  return notifications
}
