import { Link } from 'react-router-dom'
import { Star, Zap, Users, CheckCircle } from 'lucide-react'
import { MatchResult } from '../../types'
import SkillBadge from '../profile/SkillBadge'

interface Props {
  match: MatchResult
  onConnect?: (mentorId: string) => void
  connecting?: boolean
}

function ScoreMeter({ score }: { score: number }) {
  const max = 150
  const pct = Math.min((score / max) * 100, 100)
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-brand-400 to-brand-600 rounded-full transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs font-bold text-brand-600 tabular-nums">{score} pts</span>
    </div>
  )
}

export default function MatchCard({ match, onConnect, connecting }: Props) {
  const { mentor, score, matchReasons, commonSkills, complementarySkills } = match

  return (
    <div className="card p-5 border-l-4 border-l-brand-400 animate-fade-in">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="relative shrink-0">
          <img
            src={mentor.avatar}
            alt={mentor.name}
            className="w-14 h-14 rounded-xl border-2 border-brand-100"
          />
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-brand-500 rounded-full flex items-center justify-center">
            <Star className="w-3 h-3 text-white fill-white" />
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <Link
                to={`/profile/${mentor.id}`}
                className="font-bold text-gray-900 hover:text-brand-600 transition-colors"
              >
                {mentor.name}
              </Link>
              <p className="text-sm text-brand-600 font-medium">{mentor.role}</p>
              <p className="text-xs text-gray-400">
                {mentor.squad} · {mentor.yearsOfExperience} anos de experiência
              </p>
            </div>
            <div className="text-right shrink-0">
              <span className="badge bg-brand-50 text-brand-700 border border-brand-200 text-sm font-bold">
                ⚡ {score}
              </span>
            </div>
          </div>

          <div className="mt-2">
            <ScoreMeter score={score} />
          </div>
        </div>
      </div>

      {/* Match reasons */}
      {matchReasons.length > 0 && (
        <div className="mt-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-yellow-500" />
            Por que é um bom match
          </p>
          <ul className="space-y-1">
            {matchReasons.slice(0, 3).map((reason, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                {reason}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Common skills */}
      {commonSkills.length > 0 && (
        <div className="mt-3">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
            Skills em comum
          </p>
          <div className="flex flex-wrap gap-1">
            {commonSkills.slice(0, 4).map((skill) => (
              <SkillBadge key={skill} skill={skill} size="sm" />
            ))}
          </div>
        </div>
      )}

      {/* Complementary skills */}
      {complementarySkills.length > 0 && (
        <div className="mt-3">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
            Pode te ensinar
          </p>
          <div className="flex flex-wrap gap-1">
            {complementarySkills.slice(0, 4).map((skill) => (
              <span
                key={skill}
                className="badge bg-green-50 text-green-700 border border-green-200 text-xs"
              >
                + {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Action */}
      <div className="mt-4 flex gap-2">
        <button
          onClick={() => onConnect?.(mentor.id)}
          disabled={connecting}
          className="flex-1 btn-primary flex items-center justify-center gap-2 text-sm"
        >
          <Users className="w-4 h-4" />
          {connecting ? 'Conectando...' : 'Pedir Mentoria'}
        </button>
        <Link
          to={`/profile/${mentor.id}`}
          className="btn-secondary text-sm px-3"
        >
          Ver Perfil
        </Link>
      </div>
    </div>
  )
}
