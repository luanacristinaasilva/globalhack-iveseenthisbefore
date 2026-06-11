import { describe, it, expect, beforeEach } from 'vitest'
import { buildUserProfile, getAllProfiles, getMentoringProfiles } from '../../src/step3-profiles/profileService'
import { clearCache } from '../../src/step1-datasource/dataLoader'

beforeEach(() => {
  clearCache()
})

describe('profileService', () => {
  it('deve construir perfil completo do usuário', () => {
    const profile = buildUserProfile('u1')
    expect(profile).not.toBeNull()
    expect(profile?.id).toBe('u1')
    expect(profile?.name).toBe('Ana Lima')
    expect(profile?.contributions).toBeDefined()
    expect(profile?.contributionCount).toBeGreaterThan(0)
    expect(profile?.impactScore).toBeGreaterThan(0)
    expect(profile?.topTags).toBeDefined()
  })

  it('deve retornar null para usuário inexistente', () => {
    const profile = buildUserProfile('nao-existe')
    expect(profile).toBeNull()
  })

  it('deve retornar todos os perfis', () => {
    const profiles = getAllProfiles()
    expect(profiles.length).toBeGreaterThan(0)
    profiles.forEach((p) => {
      expect(p).toHaveProperty('contributions')
      expect(p).toHaveProperty('impactScore')
      expect(p).toHaveProperty('topTags')
    })
  })

  it('deve retornar apenas perfis com opt-in de mentoria', () => {
    const mentors = getMentoringProfiles()
    mentors.forEach((m) => {
      expect(m.optInMentoring).toBe(true)
    })
  })

  it('deve calcular impactScore corretamente', () => {
    const profile = buildUserProfile('u7') // Gabriela tem muitas contribuições de alto impacto
    expect(profile?.impactScore).toBeGreaterThan(0)
  })

  it('deve extrair topTags das contribuições', () => {
    const profile = buildUserProfile('u3') // Carla tem contribuições com tags de dados
    expect(profile?.topTags.length).toBeGreaterThan(0)
  })
})
