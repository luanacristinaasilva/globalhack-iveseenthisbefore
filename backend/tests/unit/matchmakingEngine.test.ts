import { describe, it, expect, beforeEach } from 'vitest'
import { findMatches, computeMatchScore } from '../../src/step4-matchmaking/matchmakingEngine'
import { clearCache } from '../../src/step1-datasource/dataLoader'
import type { User, Contribution } from '../../src/step1-datasource/types'

beforeEach(() => {
  clearCache()
})

const mockMentor: User = {
  id: 'mentor1',
  name: 'Mentora Teste',
  email: 'mentora@test.com',
  role: 'Senior Engineer',
  squad: 'Platform',
  avatar: '',
  skills: ['TypeScript', 'React', 'Node.js', 'System Design', 'AWS'],
  yearsOfExperience: 8,
  optInMentoring: true,
  bio: 'Mentora experiente',
  linkedin: '',
  github: '',
  contributionIds: [],
}

const mockMentee: User = {
  id: 'mentee1',
  name: 'Mentee Teste',
  email: 'mentee@test.com',
  role: 'Junior Developer',
  squad: 'Mobile',
  avatar: '',
  skills: ['JavaScript', 'React'],
  yearsOfExperience: 1,
  optInMentoring: false,
  bio: 'Aprendendo muito',
  linkedin: '',
  github: '',
  contributionIds: [],
}

const mockContributions: Contribution[] = [
  {
    id: 'c1',
    userId: 'mentor1',
    title: 'Arquitetura de microsserviços',
    description: 'Impl completa',
    type: 'pull_request',
    tags: ['TypeScript', 'Architecture'],
    date: '2024-01-01',
    url: 'https://github.com',
    impact: 'high',
    likes: 50,
  },
]

describe('computeMatchScore', () => {
  it('deve calcular score positivo para mentor experiente', () => {
    const result = computeMatchScore(mockMentor, mockMentee, mockContributions, [])
    expect(result.score).toBeGreaterThan(0)
  })

  it('deve identificar skills complementares', () => {
    const result = computeMatchScore(mockMentor, mockMentee, mockContributions, [])
    expect(result.complementarySkills.length).toBeGreaterThan(0)
    expect(result.complementarySkills).toContain('TypeScript')
  })

  it('deve identificar skills em comum', () => {
    const result = computeMatchScore(mockMentor, mockMentee, mockContributions, [])
    expect(result.commonSkills).toContain('React')
  })

  it('deve bonus por squads diferentes', () => {
    const sameSquadMentee = { ...mockMentee, squad: 'Platform' }
    const diffSquadResult = computeMatchScore(mockMentor, mockMentee, mockContributions, [])
    const sameSquadResult = computeMatchScore(mockMentor, sameSquadMentee, mockContributions, [])
    expect(diffSquadResult.score).toBeGreaterThan(sameSquadResult.score)
  })

  it('deve gerar razões de match', () => {
    const result = computeMatchScore(mockMentor, mockMentee, mockContributions, [])
    expect(result.reasons.length).toBeGreaterThan(0)
  })
})

describe('findMatches', () => {
  it('deve encontrar matches para usuário existente', () => {
    const matches = findMatches({ userId: 'u6' })
    expect(Array.isArray(matches)).toBe(true)
  })

  it('deve retornar array vazio para usuário inexistente', () => {
    const matches = findMatches({ userId: 'usuario-nao-existe' })
    expect(matches).toEqual([])
  })

  it('deve ordenar por score decrescente', () => {
    const matches = findMatches({ userId: 'u6' })
    for (let i = 1; i < matches.length; i++) {
      expect(matches[i - 1].score).toBeGreaterThanOrEqual(matches[i].score)
    }
  })

  it('deve respeitar limite de resultados', () => {
    const matches = findMatches({ userId: 'u6', limit: 2 })
    expect(matches.length).toBeLessThanOrEqual(2)
  })

  it('deve filtrar por query', () => {
    const matches = findMatches({ userId: 'u6', query: 'Python' })
    matches.forEach((m) => {
      const hasPython = m.mentor.skills.some((s) => s.toLowerCase().includes('python'))
      expect(hasPython).toBe(true)
    })
  })

  it('deve incluir apenas mentores com optIn ativo', () => {
    const matches = findMatches({ userId: 'u6' })
    matches.forEach((m) => {
      expect(m.mentor.optInMentoring).toBe(true)
    })
  })
})
