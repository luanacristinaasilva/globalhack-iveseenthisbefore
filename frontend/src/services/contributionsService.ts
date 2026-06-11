import { api } from './api'
import { ApiResponse, Contribution, TagCount } from '../types'

export async function fetchContributions(params?: {
  q?: string
  type?: 'pull_request' | 'confluence'
  impact?: 'low' | 'medium' | 'high'
  userId?: string
}): Promise<ApiResponse<Contribution[]>> {
  const searchParams = new URLSearchParams()
  if (params?.q) searchParams.set('q', params.q)
  if (params?.type) searchParams.set('type', params.type)
  if (params?.impact) searchParams.set('impact', params.impact)
  if (params?.userId) searchParams.set('userId', params.userId)

  const query = searchParams.toString()
  return api.get<ApiResponse<Contribution[]>>(`/contributions${query ? `?${query}` : ''}`)
}

export async function fetchContribution(id: string): Promise<ApiResponse<Contribution>> {
  return api.get<ApiResponse<Contribution>>(`/contributions/${id}`)
}

export async function fetchTopTags(): Promise<ApiResponse<TagCount[]>> {
  return api.get<ApiResponse<TagCount[]>>('/contributions/tags')
}
