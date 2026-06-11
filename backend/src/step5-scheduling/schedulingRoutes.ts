import { Router, Request, Response } from 'express'
import {
  createSession,
  getSessionsByUser,
  getSessionById,
  updateSessionStatus,
  sendChatMessage,
  getChatMessages,
  getAllSessions,
  SessionStatus,
} from './schedulingService'

const router = Router()

// GET /api/scheduling - get all sessions (admin/demo)
router.get('/', (_req: Request, res: Response) => {
  const sessions = getAllSessions()
  res.json({ data: sessions, total: sessions.length })
})

// GET /api/scheduling/user/:userId - get sessions for user
router.get('/user/:userId', (req: Request, res: Response) => {
  const sessions = getSessionsByUser(req.params.userId)
  res.json({ data: sessions, total: sessions.length })
})

// GET /api/scheduling/:id - get specific session
router.get('/:id', (req: Request, res: Response) => {
  const session = getSessionById(req.params.id)
  if (!session) {
    res.status(404).json({ error: 'Sessão não encontrada' })
    return
  }
  res.json({ data: session })
})

// POST /api/scheduling - create new session
router.post('/', (req: Request, res: Response) => {
  const { mentorId, menteeId, scheduledAt, durationMinutes, topic, notes } = req.body as {
    mentorId: string
    menteeId: string
    scheduledAt: string
    durationMinutes?: number
    topic: string
    notes?: string
  }

  if (!mentorId || !menteeId || !scheduledAt || !topic) {
    res.status(400).json({ error: 'mentorId, menteeId, scheduledAt e topic são obrigatórios' })
    return
  }

  try {
    const session = createSession({ mentorId, menteeId, scheduledAt, durationMinutes, topic, notes })
    res.status(201).json({ data: session, message: 'Sessão agendada com sucesso! 🎉' })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro ao criar sessão'
    res.status(400).json({ error: message })
  }
})

// PATCH /api/scheduling/:id/status - update session status
router.patch('/:id/status', (req: Request, res: Response) => {
  const { status } = req.body as { status: SessionStatus }
  const validStatuses: SessionStatus[] = ['pending', 'confirmed', 'completed', 'cancelled']

  if (!validStatuses.includes(status)) {
    res.status(400).json({ error: `Status inválido. Use: ${validStatuses.join(', ')}` })
    return
  }

  const session = updateSessionStatus(req.params.id, status)
  if (!session) {
    res.status(404).json({ error: 'Sessão não encontrada' })
    return
  }

  res.json({ data: session, message: 'Status atualizado!' })
})

// GET /api/scheduling/:id/chat - get chat messages for session
router.get('/:id/chat', (req: Request, res: Response) => {
  const session = getSessionById(req.params.id)
  if (!session) {
    res.status(404).json({ error: 'Sessão não encontrada' })
    return
  }
  const messages = getChatMessages(req.params.id)
  res.json({ data: messages, total: messages.length })
})

// POST /api/scheduling/:id/chat - send chat message
router.post('/:id/chat', (req: Request, res: Response) => {
  const { senderId, message } = req.body as { senderId: string; message: string }

  if (!senderId || !message) {
    res.status(400).json({ error: 'senderId e message são obrigatórios' })
    return
  }

  const chatMessage = sendChatMessage(req.params.id, senderId, message)
  if (!chatMessage) {
    res.status(404).json({ error: 'Sessão ou usuário não encontrado' })
    return
  }

  res.status(201).json({ data: chatMessage })
})

export default router
