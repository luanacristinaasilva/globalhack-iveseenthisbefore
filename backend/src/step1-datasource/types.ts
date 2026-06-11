export interface User {
  id: string
  name: string
  email: string
  role: string
  squad: string
  avatar: string
  skills: string[]
  yearsOfExperience: number
  optInMentoring: boolean
  bio: string
  linkedin: string
  github: string
  contributionIds: string[]
}

export interface Contribution {
  id: string
  userId: string
  title: string
  description: string
  type: 'pull_request' | 'confluence'
  tags: string[]
  date: string
  url: string
  impact: 'low' | 'medium' | 'high'
  likes: number
}

export interface Skill {
  id: string
  name: string
  category: string
  color: string
  relatedSkills: string[]
}

export interface DataSource {
  users: User[]
  contributions: Contribution[]
  skills: Skill[]
}
