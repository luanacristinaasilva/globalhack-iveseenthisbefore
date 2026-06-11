import { describe, it, expect, beforeEach } from 'vitest'
import { buildIndex, searchContributions, enrichContributionsWithUsers } from '../../src/step2-indexer/contributionIndexer'
import { buildTagIndex, getTopTags, searchByTags } from '../../src/step2-indexer/tagService'
import { getContributions, getUsers, clearCache } from '../../src/step1-datasource/dataLoader'

beforeEach(() => {
  clearCache()
})

describe('tagService', () => {
  it('deve construir índice de tags', () => {
    const contributions = getContributions()
    const index = buildTagIndex(contributions)
    expect(Object.keys(index).length).toBeGreaterThan(0)
    // Tags devem ser lowercase
    Object.keys(index).forEach((tag) => {
      expect(tag).toBe(tag.toLowerCase())
    })
  })

  it('deve retornar top tags ordenadas por frequência', () => {
    const contributions = getContributions()
    const index = buildTagIndex(contributions)
    const topTags = getTopTags(index, 5)
    expect(topTags.length).toBeLessThanOrEqual(5)
    for (let i = 1; i < topTags.length; i++) {
      expect(topTags[i - 1].count).toBeGreaterThanOrEqual(topTags[i].count)
    }
  })

  it('deve buscar por tags exatas', () => {
    const contributions = getContributions()
    const index = buildTagIndex(contributions)
    const results = searchByTags(index, contributions, 'python')
    expect(results.length).toBeGreaterThan(0)
    results.forEach((c) => {
      const tags = c.tags.map((t) => t.toLowerCase())
      expect(tags.some((t) => t.includes('python'))).toBe(true)
    })
  })
})

describe('contributionIndexer', () => {
  it('deve construir índice completo', () => {
    const contributions = getContributions()
    const users = getUsers()
    const indexed = buildIndex(contributions, users)
    expect(indexed.contributions).toBeDefined()
    expect(indexed.tagIndex).toBeDefined()
    expect(indexed.userSkillMap).toBeDefined()
  })

  it('deve enriquecer contribuições com dados do usuário', () => {
    const contributions = getContributions()
    const users = getUsers()
    const enriched = enrichContributionsWithUsers(contributions, users)
    enriched.forEach((c) => {
      if (c.user) {
        expect(c.user).toHaveProperty('id')
        expect(c.user).toHaveProperty('name')
        expect(c.user).toHaveProperty('avatar')
      }
    })
  })

  it('deve buscar contribuições por query vazia (retorna todas)', () => {
    const contributions = getContributions()
    const users = getUsers()
    const indexed = buildIndex(contributions, users)
    const results = searchContributions(indexed, '', users)
    expect(results.length).toBe(contributions.length)
  })

  it('deve buscar contribuições por texto', () => {
    const contributions = getContributions()
    const users = getUsers()
    const indexed = buildIndex(contributions, users)
    const results = searchContributions(indexed, 'Kafka', users)
    expect(results.length).toBeGreaterThan(0)
  })
})
