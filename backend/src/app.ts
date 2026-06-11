import express from 'express'
import cors from 'cors'
import profileRoutes from './step3-profiles/profileRoutes'
import matchmakingRoutes from './step4-matchmaking/matchmakingRoutes'
import schedulingRoutes from './step5-scheduling/schedulingRoutes'
import { getContributions, getUsers } from './step1-datasource/dataLoader'
import { buildIndex, searchContributions, enrichContributionsWithUsers } from './step2-indexer/contributionIndexer'
import { getTopTags } from './step2-indexer/tagService'

const app = express()

app.use(cors())
app.use(express.json())

// Health check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    message: '🌟 I\'ve Seen This Before API — BrasilIA Hackaton',
    timestamp: new Date().toISOString(),
  })
})

// Contributions routes (standalone, not via matchmaking router)
app.get('/api/contributions', (req, res) => {
  const { q, type, impact, userId } = req.query
  let contributions = getContributions()
  const users = getUsers()

  // Filter by userId
  if (userId) {
    contributions = contributions.filter((c) => c.userId === userId)
  }

  // Filter by type
  if (type && (type === 'pull_request' || type === 'confluence')) {
    contributions = contributions.filter((c) => c.type === type)
  }

  // Filter by impact
  if (impact && (impact === 'low' || impact === 'medium' || impact === 'high')) {
    contributions = contributions.filter((c) => c.impact === impact)
  }

  const indexed = buildIndex(contributions, users)
  const results = searchContributions(indexed, (q as string) || '', users)
  res.json({ data: results, total: results.length })
})

app.get('/api/contributions/tags', (_req, res) => {
  const contributions = getContributions()
  const users = getUsers()
  const indexed = buildIndex(contributions, users)
  const topTags = getTopTags(indexed.tagIndex, 15)
  res.json({ data: topTags })
})

app.get('/api/contributions/:id', (req, res) => {
  const contributions = getContributions()
  const contribution = contributions.find((c) => c.id === req.params.id)
  if (!contribution) {
    res.status(404).json({ error: 'Contribuição não encontrada' })
    return
  }
  const users = getUsers()
  const enriched = enrichContributionsWithUsers([contribution], users)
  res.json({ data: enriched[0] })
})

// Register routers
app.use('/api/profiles', profileRoutes)
app.use('/api/matchmaking', matchmakingRoutes)
app.use('/api/scheduling', schedulingRoutes)

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' })
})

// Error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Erro interno do servidor', message: err.message })
})

export default app
