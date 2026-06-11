import { getUserById } from '../step1-datasource/dataLoader'

export type SessionStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled'

export interface MentoringSession {
  id: string
  mentorId: string
  menteeId: string
  scheduledAt: string
  durationMinutes: number
  topic: string
  status: SessionStatus
  meetingUrl?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface CreateSessionInput {
  mentorId: string
  menteeId: string
  scheduledAt: string
  durationMinutes?: number
  topic: string
  notes?: string
}

export interface ChatMessage {
  id: string
  sessionId: string
  senderId: string
  senderName: string
  message: string
  sentAt: string
}

// In-memory stores for MVP
const sessions: MentoringSession[] = []
const chatMessages: ChatMessage[] = []
let sessionCounter = 1
let messageCounter = 1

// Seed some sample sessions
function seedSessions(): void {
  if (sessions.length > 0) return
  const now = new Date()
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000)
  const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)

  sessions.push({
    id: 'sess1',
    mentorId: 'u1',
    menteeId: 'u6',
    scheduledAt: tomorrow.toISOString(),
    durationMinutes: 60,
    topic: 'Carreira em desenvolvimento frontend e boas práticas de React',
    status: 'confirmed',
    meetingUrl: 'https://meet.google.com/abc-defg-hij',
    notes: 'Focar em hooks e TypeScript',
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  })

  sessions.push({
    id: 'sess2',
    mentorId: 'u7',
    menteeId: 'u2',
    scheduledAt: nextWeek.toISOString(),
    durationMinutes: 45,
    topic: 'Transição de PO para Tech Lead — o que esperar',
    status: 'pending',
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  })

  chatMessages.push(
    {
      id: 'm1',
      sessionId: 'sess1',
      senderId: 'u6',
      senderName: 'Fernanda Oliveira',
      message: 'Oi Ana! Estou animada para nossa sessão! Tenho algumas dúvidas sobre Context API.',
      sentAt: now.toISOString(),
    },
    {
      id: 'm2',
      sessionId: 'sess1',
      senderId: 'u1',
      senderName: 'Ana Lima',
      message: 'Oi Fernanda! Que ótimo 😊 Vamos cobrir Context API e também Zustand como alternativa. Te vejo amanhã!',
      sentAt: new Date(now.getTime() + 5 * 60 * 1000).toISOString(),
    }
  )
}

export function createSession(input: CreateSessionInput): MentoringSession {
  seedSessions()
  const mentor = getUserById(input.mentorId)
  const mentee = getUserById(input.menteeId)

  if (!mentor) throw new Error(`Mentora não encontrada: ${input.mentorId}`)
  if (!mentee) throw new Error(`Mentee não encontrada: ${input.menteeId}`)

  const now = new Date().toISOString()
  const session: MentoringSession = {
    id: `sess${sessionCounter++}`,
    mentorId: input.mentorId,
    menteeId: input.menteeId,
    scheduledAt: input.scheduledAt,
    durationMinutes: input.durationMinutes || 60,
    topic: input.topic,
    status: 'pending',
    meetingUrl: `https://meet.google.com/${Math.random().toString(36).slice(2, 11)}`,
    notes: input.notes,
    createdAt: now,
    updatedAt: now,
  }

  sessions.push(session)
  return session
}

export function getSessionsByUser(userId: string): MentoringSession[] {
  seedSessions()
  return sessions.filter((s) => s.mentorId === userId || s.menteeId === userId)
}

export function getSessionById(id: string): MentoringSession | undefined {
  seedSessions()
  return sessions.find((s) => s.id === id)
}

export function updateSessionStatus(
  sessionId: string,
  status: SessionStatus
): MentoringSession | null {
  seedSessions()
  const session = sessions.find((s) => s.id === sessionId)
  if (!session) return null
  session.status = status
  session.updatedAt = new Date().toISOString()
  return session
}

export function sendChatMessage(
  sessionId: string,
  senderId: string,
  message: string
): ChatMessage | null {
  seedSessions()
  const session = sessions.find((s) => s.id === sessionId)
  if (!session) return null

  const sender = getUserById(senderId)
  if (!sender) return null

  const chatMessage: ChatMessage = {
    id: `m${messageCounter++}`,
    sessionId,
    senderId,
    senderName: sender.name,
    message,
    sentAt: new Date().toISOString(),
  }

  chatMessages.push(chatMessage)
  return chatMessage
}

export function getChatMessages(sessionId: string): ChatMessage[] {
  seedSessions()
  return chatMessages.filter((m) => m.sessionId === sessionId)
}

export function getAllSessions(): MentoringSession[] {
  seedSessions()
  return sessions
}
