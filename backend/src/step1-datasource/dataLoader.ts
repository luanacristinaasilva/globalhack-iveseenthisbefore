import fs from 'fs'
import path from 'path'
import { DataSource, User, Contribution, Skill } from './types'

const DATA_DIR = path.resolve(__dirname, '../../../data')

function loadJson<T>(filename: string): T {
  const filePath = path.join(DATA_DIR, filename)
  const raw = fs.readFileSync(filePath, 'utf-8')
  return JSON.parse(raw) as T
}

let cachedData: DataSource | null = null

export function loadData(): DataSource {
  if (cachedData) return cachedData

  const users = loadJson<User[]>('users.json')
  const contributions = loadJson<Contribution[]>('contributions.json')
  const skills = loadJson<Skill[]>('skills.json')

  cachedData = { users, contributions, skills }
  return cachedData
}

export function clearCache(): void {
  cachedData = null
}

export function getUsers(): User[] {
  return loadData().users
}

export function getContributions(): Contribution[] {
  return loadData().contributions
}

export function getSkills(): Skill[] {
  return loadData().skills
}

export function getUserById(id: string): User | undefined {
  return getUsers().find((u) => u.id === id)
}

export function getContributionById(id: string): Contribution | undefined {
  return getContributions().find((c) => c.id === id)
}

export function getContributionsByUserId(userId: string): Contribution[] {
  return getContributions().filter((c) => c.userId === userId)
}
