import { ExternalLink, Heart, Tag, GitPullRequest, FileText } from 'lucide-react'
import { Contribution } from '../../types'

interface Props {
  contribution: Contribution
}

const impactLabel = { high: 'Alto Impacto', medium: 'Médio Impacto', low: 'Baixo Impacto' }
const impactClass = {
  high: 'badge-impact-high',
  medium: 'badge-impact-medium',
  low: 'badge-impact-low',
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export default function ContributionCard({ contribution }: Props) {
  const isPR = contribution.type === 'pull_request'

  return (
    <div className="card p-5 animate-fade-in">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          {/* Icon */}
          <div
            className={`shrink-0 w-9 h-9 rounded-lg flex items-center justify-center ${
              isPR ? 'bg-purple-50' : 'bg-blue-50'
            }`}
          >
            {isPR ? (
              <GitPullRequest className="w-4 h-4 text-purple-600" />
            ) : (
              <FileText className="w-4 h-4 text-blue-600" />
            )}
          </div>

          {/* Content */}
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2">
              {contribution.title}
            </h3>

            {/* Author */}
            {contribution.user && (
              <div className="flex items-center gap-1.5 mt-1">
                <img
                  src={contribution.user.avatar}
                  alt={contribution.user.name}
                  className="w-4 h-4 rounded-full"
                />
                <span className="text-xs text-gray-500">{contribution.user.name}</span>
                <span className="text-xs text-gray-300">·</span>
                <span className="text-xs text-gray-400">{contribution.user.role}</span>
              </div>
            )}

            <p className="text-xs text-gray-500 mt-2 line-clamp-2 leading-relaxed">
              {contribution.description}
            </p>
          </div>
        </div>

        {/* Badges */}
        <div className="shrink-0 flex flex-col items-end gap-1.5">
          <span className={impactClass[contribution.impact]}>
            {impactLabel[contribution.impact]}
          </span>
          <span className="badge bg-gray-50 text-gray-500 border border-gray-200">
            {isPR ? 'Pull Request' : 'Confluence'}
          </span>
        </div>
      </div>

      {/* Tags */}
      <div className="mt-3 flex flex-wrap gap-1.5">
        {contribution.tags.slice(0, 5).map((tag) => (
          <span key={tag} className="badge-skill flex items-center gap-1">
            <Tag className="w-2.5 h-2.5" />
            {tag}
          </span>
        ))}
        {contribution.tags.length > 5 && (
          <span className="badge bg-gray-50 text-gray-500 border border-gray-200">
            +{contribution.tags.length - 5}
          </span>
        )}
      </div>

      {/* Footer */}
      <div className="mt-3 pt-3 border-t border-gray-50 flex items-center justify-between">
        <div className="flex items-center gap-3 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <Heart className="w-3.5 h-3.5 text-pink-400" />
            {contribution.likes}
          </span>
          <span>{formatDate(contribution.date)}</span>
        </div>
        <a
          href={contribution.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs text-brand-600 hover:text-brand-700 font-medium"
        >
          Ver <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  )
}
