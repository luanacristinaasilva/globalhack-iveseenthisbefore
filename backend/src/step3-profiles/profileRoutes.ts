import { Router, Request, Response } from 'express'
import {
  getAllProfiles,
  buildUserProfile,
  getMentoringProfiles,
  updateOptIn,
} from './profileService'

const router = Router()

// GET /api/profiles - list all profiles
router.get('/', (_req: Request, res: Response) => {
  const profiles = getAllProfiles()
  res.json({ data: profiles, total: profiles.length })
})

// GET /api/profiles/mentoring - list opt-in mentoring profiles
router.get('/mentoring', (_req: Request, res: Response) => {
  const profiles = getMentoringProfiles()
  res.json({ data: profiles, total: profiles.length })
})

// GET /api/profiles/:id - get specific profile
router.get('/:id', (req: Request, res: Response) => {
  const profile = buildUserProfile(req.params.id)
  if (!profile) {
    res.status(404).json({ error: 'Profile not found' })
    return
  }
  res.json({ data: profile })
})

// PATCH /api/profiles/:id/optin - toggle mentoring opt-in
router.patch('/:id/optin', (req: Request, res: Response) => {
  const { optIn } = req.body as { optIn: boolean }
  if (typeof optIn !== 'boolean') {
    res.status(400).json({ error: 'optIn must be a boolean' })
    return
  }
  const profile = updateOptIn(req.params.id, optIn)
  if (!profile) {
    res.status(404).json({ error: 'Profile not found' })
    return
  }
  res.json({ data: profile })
})

export default router
