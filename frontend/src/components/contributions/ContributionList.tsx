import { Contribution } from '../../types'
import ContributionCard from './ContributionCard'
import { GitPullRequest } from 'lucide-react'

interface Props {
  contributions: Contribution[]
  loading?: boolean
  error?: string | null
}

function SkeletonCard() {
  return (
    <div className="card p-5 animate-pulse">
      <div className="flex gap-3">
        <div className="w-9 h-9 rounded-lg bg-gray-100 shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-100 rounded w-3/4" />
          <div className="h-3 bg-gray-100 rounded w-1/2" />
          <div className="h-3 bg-gray-100 rounded w-full" />
          <div className="h-3 bg-gray-100 rounded w-2/3" />
        </div>
      </div>
      <div className="mt-3 flex gap-1.5">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-5 w-16 bg-gray-100 rounded-full" />
        ))}
      </div>
    </div>
  )
}

export default function ContributionList({ contributions, loading, error }: Props) {
  if (loading) {
    return (
      <div className="grid gap-4">
        {[1, 2, 3, 4].map((i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-500">
        <p className="font-medium">Erro ao carregar contribuições</p>
        <p className="text-sm text-gray-400 mt-1">{error}</p>
      </div>
    )
  }

  if (contributions.length === 0) {
    return (
      <div className="text-center py-16">
        <GitPullRequest className="w-12 h-12 text-gray-200 mx-auto mb-3" />
        <p className="font-medium text-gray-500">Nenhuma contribuição encontrada</p>
        <p className="text-sm text-gray-400 mt-1">Tente ajustar seus filtros de busca</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4">
      {contributions.map((c) => (
        <ContributionCard key={c.id} contribution={c} />
      ))}
    </div>
  )
}
