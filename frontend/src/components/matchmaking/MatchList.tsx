import { MatchResult } from '../../types'
import MatchCard from './MatchCard'
import { Users } from 'lucide-react'

interface Props {
  matches: MatchResult[]
  loading?: boolean
  error?: string | null
  onConnect?: (mentorId: string) => void
  connectingId?: string
}

function SkeletonMatch() {
  return (
    <div className="card p-5 animate-pulse border-l-4 border-l-gray-100">
      <div className="flex gap-4">
        <div className="w-14 h-14 rounded-xl bg-gray-100 shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-100 rounded w-1/2" />
          <div className="h-3 bg-gray-100 rounded w-1/3" />
          <div className="h-2 bg-gray-100 rounded-full" />
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <div className="h-3 bg-gray-100 rounded w-3/4" />
        <div className="h-3 bg-gray-100 rounded w-2/3" />
      </div>
    </div>
  )
}

export default function MatchList({ matches, loading, error, onConnect, connectingId }: Props) {
  if (loading) {
    return (
      <div className="grid gap-4">
        {[1, 2, 3].map((i) => <SkeletonMatch key={i} />)}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="font-medium text-red-500">Erro ao buscar mentoras</p>
        <p className="text-sm text-gray-400 mt-1">{error}</p>
      </div>
    )
  }

  if (matches.length === 0) {
    return (
      <div className="text-center py-16">
        <Users className="w-12 h-12 text-gray-200 mx-auto mb-3" />
        <p className="font-medium text-gray-500">Nenhuma mentora encontrada</p>
        <p className="text-sm text-gray-400 mt-1">
          Tente remover filtros ou aguarde mais profissionais fazerem opt-in para mentoria.
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-4">
      {matches.map((match) => (
        <MatchCard
          key={match.mentor.id}
          match={match}
          onConnect={onConnect}
          connecting={connectingId === match.mentor.id}
        />
      ))}
    </div>
  )
}
