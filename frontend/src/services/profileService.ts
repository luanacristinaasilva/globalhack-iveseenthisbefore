import { api } from './api'
import { ApiResponse, UserProfile } from '../types'

export async function fetchProfiles(): Promise<ApiResponse<UserProfile[]>> {
  return api.get<ApiResponse<UserProfile[]>>('/profiles')
}

export async function fetchMentoringProfiles(): Promise<ApiResponse<UserProfile[]>> {
  return api.get<ApiResponse<UserProfile[]>>('/profiles/mentoring')
}

export async function fetchProfile(id: string): Promise<ApiResponse<UserProfile>> {
  return api.get<ApiResponse<UserProfile>>(`/profiles/${id}`)
}

export async function updateOptIn(
  id: string,
  optIn: boolean
): Promise<ApiResponse<UserProfile>> {
  return api.patch<ApiResponse<UserProfile>>(`/profiles/${id}/optin`, { optIn })
}
