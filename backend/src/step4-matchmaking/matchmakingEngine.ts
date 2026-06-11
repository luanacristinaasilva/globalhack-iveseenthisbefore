import { User, Contribution } from '../step1-datasource/types'
import { getUsers, getContributionsByUserId } from '../step1-datasource/dataLoader'

export interface MatchResult {
  mentor: User
  mentee: User
  score: number
  matchReasons: string[]
  commonSkills: string[]
  complementarySkills: string[]
}

export interface MatchmakingRequest {
  userId: string
  query?: string
  skills?: string[]
  limit?: number
}

function computeSkillOverlap(skillsA: string[], skillsB: string[]): string[] {
  const setA = new Set(skillsA.map((s) => s.toLowerCase()))
  return skillsB.filter((s) => setA.has(s.toLowerCase()))
}

function computeComplementarySkills(mentorSkills: string[], menteeSkills: string[]): string[] {
  const menteeSet = new Set(menteeSkills.map((s) => s.toLowerCase()))
  return mentorSkills.filter((s) => !menteeSet.has(s.toLowerCase()))
}

function getTagsFromContributions(contributions: Contribution[]): string[] {
  const tags = new Set<string>()
  contributions.forEach((c) => c.tags.forEach((t) => tags.add(t.toLowerCase())))
  return Array.from(tags)
}

export function computeMatchScore(
  mentor: User,
  mentee: User,
  mentorContributions: Contribution[],
  menteeContributions: Contribution[]
): { score: number; reasons: string[]; commonSkills: string[]; complementarySkills: string[] } {
  let score = 0
  const reasons: string[] = []

  // 1. Skill complementarity: mentor has skills mentee lacks
  const complementary = computeComplementarySkills(mentor.skills, mentee.skills)
  if (complementary.length > 0) {
    score += complementary.length * 10
    reasons.push(`Pode ensinar: ${complementary.slice(0, 3).join(', ')}`)
  }

  // 2. Common skills base (some overlap is good for communication)
  const common = computeSkillOverlap(mentor.skills, mentee.skills)
  if (common.length > 0) {
    score += common.length * 5
    reasons.push(`Base comum: ${common.slice(0, 2).join(', ')}`)
  }

  // 3. Experience differential (mentor should have more experience)
  const expDiff = mentor.yearsOfExperience - mentee.yearsOfExperience
  if (expDiff >= 3) {
    score += 20
    reasons.push(`${expDiff} anos a mais de experiência`)
  } else if (expDiff >= 1) {
    score += 10
    reasons.push(`Diferença de experiência enriquecedora`)
  }

  // 4. Contribution tags overlap
  const mentorTags = getTagsFromContributions(mentorContributions)
  const menteeTags = getTagsFromContributions(menteeContributions)
  const tagOverlap = computeSkillOverlap(mentorTags, menteeTags)
  if (tagOverlap.length > 0) {
    score += tagOverlap.length * 3
    reasons.push(`Áreas em comum: ${tagOverlap.slice(0, 2).join(', ')}`)
  }

  // 5. Different squads (cross-pollination)
  if (mentor.squad !== mentee.squad) {
    score += 15
    reasons.push(`Squads diferentes — perspectiva nova!`)
  }

  // 6. Mentor impact from contributions
  const mentorImpact = mentorContributions.filter((c) => c.impact === 'high').length
  if (mentorImpact > 0) {
    score += mentorImpact * 5
    reasons.push(`${mentorImpact} contribuição(ões) de alto impacto`)
  }

  return { score, reasons, commonSkills: common, complementarySkills: complementary }
}

export function findMatches(request: MatchmakingRequest): MatchResult[] {
  const users = getUsers()
  const mentee = users.find((u) => u.id === request.userId)
  if (!mentee) return []

  const mentors = users.filter(
    (u) => u.id !== request.userId && u.optInMentoring
  )

  const menteeContributions = getContributionsByUserId(mentee.id)

  let results: MatchResult[] = []

  for (const mentor of mentors) {
    const mentorContributions = getContributionsByUserId(mentor.id)
    const { score, reasons, commonSkills, complementarySkills } = computeMatchScore(
      mentor,
      mentee,
      mentorContributions,
      menteeContributions
    )

    // Filter by query if provided
    if (request.query) {
      const q = request.query.toLowerCase()
      const hasMatch =
        mentor.skills.some((s) => s.toLowerCase().includes(q)) ||
        mentor.name.toLowerCase().includes(q) ||
        mentor.role.toLowerCase().includes(q)
      if (!hasMatch) continue
    }

    // Filter by specific skills if provided
    if (request.skills && request.skills.length > 0) {
      const hasSkill = request.skills.some((s) =>
        mentor.skills.map((ms) => ms.toLowerCase()).includes(s.toLowerCase())
      )
      if (!hasSkill) continue
    }

    results.push({
      mentor,
      mentee,
      score,
      matchReasons: reasons,
      commonSkills,
      complementarySkills,
    })
  }

  results.sort((a, b) => b.score - a.score)
  const limit = request.limit || 5
  return results.slice(0, limit)
}
