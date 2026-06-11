import { api } from './api'
import { ApiResponse, MentoringSession, ChatMessage } from '../types'

export async function fetchSessionsByUser(userId: string): Promise<ApiResponse<MentoringSession[]>> {
  return api.get<ApiResponse<MentoringSession[]>>(`/scheduling/user/${userId}`)
}

export async function fetchSession(id: string): Promise<ApiResponse<MentoringSession>> {
  return api.get<ApiResponse<MentoringSession>>(`/scheduling/${id}`)
}

export async function createSession(data: {
  mentorId: string
  menteeId: string
  scheduledAt: string
  durationMinutes?: number
  topic: string
  notes?: string
}): Promise<ApiResponse<MentoringSession>> {
  return api.post<ApiResponse<MentoringSession>>('/scheduling', data)
}

export async function updateSessionStatus(
  id: string,
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
): Promise<ApiResponse<MentoringSession>> {
  return api.patch<ApiResponse<MentoringSession>>(`/scheduling/${id}/status`, { status })
}

export async function fetchChatMessages(sessionId: string): Promise<ApiResponse<ChatMessage[]>> {
  return api.get<ApiResponse<ChatMessage[]>>(`/scheduling/${sessionId}/chat`)
}

export async function sendChatMessage(
  sessionId: string,
  senderId: string,
  message: string
): Promise<ApiResponse<ChatMessage>> {
  return api.post<ApiResponse<ChatMessage>>(`/scheduling/${sessionId}/chat`, {
    senderId,
    message,
  })
}
