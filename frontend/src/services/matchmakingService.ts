import { api } from './api'
import { ApiResponse, MatchResult, Notification } from '../types'

export async function fetchMatches(
  userId: string,
  params?: { query?: string; skills?: string; limit?: number }
): Promise<ApiResponse<MatchResult[]>> {
  const searchParams = new URLSearchParams()
  if (params?.query) searchParams.set('query', params.query)
  if (params?.skills) searchParams.set('skills', params.skills)
  if (params?.limit) searchParams.set('limit', String(params.limit))

  const query = searchParams.toString()
  return api.get<ApiResponse<MatchResult[]>>(
    `/matchmaking/${userId}${query ? `?${query}` : ''}`
  )
}

export async function sendMatchNotification(
  userId: string,
  mentorId: string
): Promise<ApiResponse<Notification[]>> {
  return api.post<ApiResponse<Notification[]>>(`/matchmaking/${userId}/notify`, { mentorId })
}

export async function fetchNotifications(userId: string): Promise<ApiResponse<Notification[]>> {
  return api.get<ApiResponse<Notification[]>>(`/matchmaking/notifications/${userId}`)
}

export async function markNotificationRead(notificationId: string): Promise<{ message: string }> {
  return api.patch<{ message: string }>(`/matchmaking/notifications/${notificationId}/read`, {})
}
