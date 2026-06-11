import { useState, useEffect, useCallback } from 'react'
import { Contribution, TagCount } from '../types'
import { fetchContributions, fetchTopTags } from '../services/contributionsService'

interface UseContributionsOptions {
  q?: string
  type?: 'pull_request' | 'confluence'
  impact?: 'low' | 'medium' | 'high'
  userId?: string
}

export function useContributions(options?: UseContributionsOptions) {
  const [contributions, setContributions] = useState<Contribution[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetchContributions(options)
      setContributions(res.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar contribuições')
    } finally {
      setLoading(false)
    }
  }, [options?.q, options?.type, options?.impact, options?.userId])

  useEffect(() => {
    load()
  }, [load])

  return { contributions, loading, error, refetch: load }
}

export function useTopTags() {
  const [tags, setTags] = useState<TagCount[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTopTags()
      .then((res) => setTags(res.data))
      .catch(() => setTags([]))
      .finally(() => setLoading(false))
  }, [])

  return { tags, loading }
}
