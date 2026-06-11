import { useState } from 'react'
import { Search, Filter } from 'lucide-react'
import { useContributions, useTopTags } from '../hooks/useContributions'
import ContributionList from '../components/contributions/ContributionList'

type ImpactFilter = 'all' | 'high' | 'medium' | 'low'
type TypeFilter = 'all' | 'pull_request' | 'confluence'

export default function Contributions() {
  const [search, setSearch] = useState('')
  const [impact, setImpact] = useState<ImpactFilter>('all')
  const [type, setType] = useState<TypeFilter>('all')

  const { contributions, loading, error } = useContributions({
    q: search || undefined,
    impact: impact === 'all' ? undefined : impact,
    type: type === 'all' ? undefined : type,
  })

  const { tags } = useTopTags()

  const handleTagClick = (tag: string) => {
    setSearch(tag)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="section-title">Contribuições</h1>
        <p className="section-subtitle">
          Explore o conhecimento acumulado da comunidade — PRs, documentações e muito mais.
        </p>
      </div>

      {/* Search & Filters */}
      <div className="card p-4 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por título, tag ou tecnologia..."
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
          />
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          <Filter className="w-4 h-4 text-gray-400" />

          {/* Type filter */}
          <div className="flex gap-1">
            {(['all', 'pull_request', 'confluence'] as TypeFilter[]).map((t) => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  type === t
                    ? 'bg-brand-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {t === 'all' ? 'Todos' : t === 'pull_request' ? 'Pull Request' : 'Confluence'}
              </button>
            ))}
          </div>

          <span className="text-gray-300">|</span>

          {/* Impact filter */}
          <div className="flex gap-1">
            {(['all', 'high', 'medium', 'low'] as ImpactFilter[]).map((i) => (
              <button
                key={i}
                onClick={() => setImpact(i)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  impact === i
                    ? 'bg-brand-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {i === 'all' ? 'Qualquer Impacto' : i === 'high' ? '🔥 Alto' : i === 'medium' ? '⚡ Médio' : '· Baixo'}
              </button>
            ))}
          </div>
        </div>

        {/* Top tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tags.slice(0, 10).map(({ tag }) => (
              <button
                key={tag}
                onClick={() => handleTagClick(tag)}
                className={`badge cursor-pointer transition-colors ${
                  search.toLowerCase() === tag
                    ? 'bg-brand-600 text-white border-brand-600'
                    : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-brand-50 hover:text-brand-700 hover:border-brand-200'
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Results count */}
      {!loading && (
        <p className="text-sm text-gray-500">
          {contributions.length} contribuição{contributions.length !== 1 ? 'ões' : ''} encontrada{contributions.length !== 1 ? 's' : ''}
        </p>
      )}

      <ContributionList contributions={contributions} loading={loading} error={error} />
    </div>
  )
}
