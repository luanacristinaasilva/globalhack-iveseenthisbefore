import { useState, useEffect } from 'react'
import { UserProfile } from '../types'
import { fetchProfiles, fetchProfile, fetchMentoringProfiles, updateOptIn } from '../services/profileService'

export function useProfiles() {
  const [profiles, setProfiles] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchProfiles()
      .then((res) => setProfiles(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  return { profiles, loading, error }
}

export function useMentoringProfiles() {
  const [profiles, setProfiles] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchMentoringProfiles()
      .then((res) => setProfiles(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  return { profiles, loading, error }
}

export function useProfile(id: string | undefined) {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    fetchProfile(id)
      .then((res) => setProfile(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  const toggleOptIn = async (optIn: boolean) => {
    if (!id) return
    try {
      const res = await updateOptIn(id, optIn)
      setProfile(res.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar opt-in')
    }
  }

  return { profile, loading, error, toggleOptIn }
}
