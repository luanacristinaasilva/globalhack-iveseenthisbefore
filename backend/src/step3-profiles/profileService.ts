import { getUsers, getContributionsByUserId, getUserById } from '../step1-datasource/dataLoader'
import { User, Contribution } from '../step1-datasource/types'

export interface UserProfile extends User {
  contributions: Contribution[]
  contributionCount: number
  topTags: string[]
  impactScore: number
}

function calculateImpactScore(contributions: Contribution[]): number {
  const weights = { high: 3, medium: 2, low: 1 }
  return contributions.reduce((score, c) => {
    return score + weights[c.impact] + Math.floor(c.likes / 10)
  }, 0)
}

function extractTopTags(contributions: Contribution[], limit = 5): string[] {
  const tagCount: Record<string, number> = {}
  for (const c of contributions) {
    for (const tag of c.tags) {
      tagCount[tag] = (tagCount[tag] || 0) + 1
    }
  }
  return Object.entries(tagCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([tag]) => tag)
}

export function buildUserProfile(userId: string): UserProfile | null {
  const user = getUserById(userId)
  if (!user) return null

  const contributions = getContributionsByUserId(userId)
  const topTags = extractTopTags(contributions)
  const impactScore = calculateImpactScore(contributions)

  return {
    ...user,
    contributions,
    contributionCount: contributions.length,
    topTags,
    impactScore,
  }
}

export function getAllProfiles(): UserProfile[] {
  const users = getUsers()
  return users.map((u) => buildUserProfile(u.id)).filter(Boolean) as UserProfile[]
}

export function getMentoringProfiles(): UserProfile[] {
  return getAllProfiles().filter((p) => p.optInMentoring)
}

export function updateOptIn(userId: string, optIn: boolean): UserProfile | null {
  const users = getUsers()
  const user = users.find((u) => u.id === userId)
  if (!user) return null
  user.optInMentoring = optIn
  return buildUserProfile(userId)
}
