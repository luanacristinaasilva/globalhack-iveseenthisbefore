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
  user?: {
    id: string
    name: string
    avatar: string
    role: string
  }
}

export interface Skill {
  id: string
  name: string
  category: string
  color: string
  relatedSkills: string[]
}

export interface UserProfile extends User {
  contributions: Contribution[]
  contributionCount: number
  topTags: string[]
  impactScore: number
}

export interface MatchResult {
  mentor: User
  mentee: User
  score: number
  matchReasons: string[]
  commonSkills: string[]
  complementarySkills: string[]
}

export interface MentoringSession {
  id: string
  mentorId: string
  menteeId: string
  scheduledAt: string
  durationMinutes: number
  topic: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  meetingUrl?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface ChatMessage {
  id: string
  sessionId: string
  senderId: string
  senderName: string
  message: string
  sentAt: string
}

export interface Notification {
  id: string
  type: 'match_found' | 'session_scheduled' | 'reminder'
  recipientId: string
  message: string
  data?: Record<string, unknown>
  createdAt: string
  read: boolean
}

export interface TagCount {
  tag: string
  count: number
}

export interface ApiResponse<T> {
  data: T
  total?: number
  message?: string
  error?: string
}
