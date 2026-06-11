import { Router, Request, Response } from 'express'
import { findMatches } from './matchmakingEngine'
import { createMatchNotification, getNotificationsForUser, markAsRead } from './notificationService'
import { getContributions, getUsers } from '../step1-datasource/dataLoader'
import { buildIndex, searchContributions } from '../step2-indexer/contributionIndexer'
import { getTopTags } from '../step2-indexer/tagService'

const router = Router()

// GET /api/matchmaking/:userId - find matches for a user
router.get('/:userId', (req: Request, res: Response) => {
  const { query, skills, limit } = req.query
  const matches = findMatches({
    userId: req.params.userId,
    query: query as string | undefined,
    skills: skills ? (skills as string).split(',') : undefined,
    limit: limit ? parseInt(limit as string) : 5,
  })

  if (matches.length === 0) {
    res.json({ data: [], message: 'Nenhuma mentora encontrada com esses filtros.' })
    return
  }

  res.json({ data: matches, total: matches.length })
})

// POST /api/matchmaking/:userId/notify - send match notifications
router.post('/:userId/notify', (req: Request, res: Response) => {
  const { mentorId } = req.body as { mentorId: string }
  const matches = findMatches({ userId: req.params.userId, limit: 10 })
  const match = matches.find((m) => m.mentor.id === mentorId)

  if (!match) {
    res.status(404).json({ error: 'Match não encontrado' })
    return
  }

  const notifications = createMatchNotification(match)
  res.json({ data: notifications, message: 'Notificações enviadas!' })
})

// GET /api/matchmaking/notifications/:userId - get notifications for user
router.get('/notifications/:userId', (req: Request, res: Response) => {
  const notifs = getNotificationsForUser(req.params.userId)
  res.json({ data: notifs, total: notifs.length })
})

// PATCH /api/matchmaking/notifications/:id/read - mark notification as read
router.patch('/notifications/:id/read', (req: Request, res: Response) => {
  const ok = markAsRead(req.params.id)
  if (!ok) {
    res.status(404).json({ error: 'Notificação não encontrada' })
    return
  }
  res.json({ message: 'Notificação marcada como lida' })
})

// GET /api/contributions - search contributions
router.get('/contributions/search', (req: Request, res: Response) => {
  const { q } = req.query
  const contributions = getContributions()
  const users = getUsers()
  const indexed = buildIndex(contributions, users)
  const results = searchContributions(indexed, q as string || '', users)
  res.json({ data: results, total: results.length })
})

// GET /api/contributions/tags - get top tags
router.get('/contributions/tags', (_req: Request, res: Response) => {
  const contributions = getContributions()
  const users = getUsers()
  const indexed = buildIndex(contributions, users)
  const topTags = getTopTags(indexed.tagIndex, 15)
  res.json({ data: topTags })
})

export default router
