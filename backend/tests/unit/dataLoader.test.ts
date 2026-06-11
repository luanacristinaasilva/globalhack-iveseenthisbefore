import { describe, it, expect, beforeEach } from 'vitest'
import { loadData, clearCache, getUsers, getContributions, getSkills, getUserById, getContributionsByUserId } from '../../src/step1-datasource/dataLoader'

beforeEach(() => {
  clearCache()
})

describe('dataLoader', () => {
  it('deve carregar os dados corretamente', () => {
    const data = loadData()
    expect(data.users).toBeDefined()
    expect(data.contributions).toBeDefined()
    expect(data.skills).toBeDefined()
    expect(data.users.length).toBeGreaterThan(0)
    expect(data.contributions.length).toBeGreaterThan(0)
    expect(data.skills.length).toBeGreaterThan(0)
  })

  it('deve usar cache na segunda chamada', () => {
    const data1 = loadData()
    const data2 = loadData()
    expect(data1).toBe(data2)
  })

  it('deve retornar todos os usuários', () => {
    const users = getUsers()
    expect(Array.isArray(users)).toBe(true)
    expect(users.length).toBeGreaterThan(0)
    expect(users[0]).toHaveProperty('id')
    expect(users[0]).toHaveProperty('name')
    expect(users[0]).toHaveProperty('skills')
  })

  it('deve retornar todas as contribuições', () => {
    const contributions = getContributions()
    expect(Array.isArray(contributions)).toBe(true)
    expect(contributions.length).toBeGreaterThan(0)
    expect(contributions[0]).toHaveProperty('id')
    expect(contributions[0]).toHaveProperty('userId')
    expect(contributions[0]).toHaveProperty('tags')
  })

  it('deve buscar usuário por id', () => {
    const user = getUserById('u1')
    expect(user).toBeDefined()
    expect(user?.id).toBe('u1')
    expect(user?.name).toBe('Ana Lima')
  })

  it('deve retornar undefined para id inexistente', () => {
    const user = getUserById('nao-existe')
    expect(user).toBeUndefined()
  })

  it('deve retornar contribuições por usuário', () => {
    const contributions = getContributionsByUserId('u1')
    expect(Array.isArray(contributions)).toBe(true)
    expect(contributions.length).toBeGreaterThan(0)
    contributions.forEach((c) => {
      expect(c.userId).toBe('u1')
    })
  })

  it('deve retornar array vazio para usuário sem contribuições', () => {
    const contributions = getContributionsByUserId('usuario-sem-contribuicoes')
    expect(contributions).toEqual([])
  })

  it('deve retornar todas as skills', () => {
    const skills = getSkills()
    expect(Array.isArray(skills)).toBe(true)
    expect(skills.length).toBeGreaterThan(0)
    expect(skills[0]).toHaveProperty('name')
    expect(skills[0]).toHaveProperty('category')
  })
})
