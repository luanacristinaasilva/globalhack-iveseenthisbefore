import { Link } from 'react-router-dom'
import { Github, Linkedin, MapPin, Star, TrendingUp } from 'lucide-react'
import { UserProfile } from '../../types'
import SkillBadge from './SkillBadge'

interface Props {
  profile: UserProfile
  compact?: boolean
}

export default function ProfileCard({ profile, compact = false }: Props) {
  if (compact) {
    return (
      <div className="card p-4 flex items-center gap-3">
        <img
          src={profile.avatar}
          alt={profile.name}
          className="w-12 h-12 rounded-full border-2 border-brand-100"
        />
        <div className="flex-1 min-w-0">
          <Link
            to={`/profile/${profile.id}`}
            className="font-semibold text-gray-900 text-sm hover:text-brand-600 transition-colors"
          >
            {profile.name}
          </Link>
          <p className="text-xs text-gray-500 truncate">{profile.role}</p>
          <p className="text-xs text-gray-400">{profile.squad}</p>
        </div>
        {profile.optInMentoring && (
          <span className="shrink-0 badge bg-green-50 text-green-700 border border-green-200">
            Mentora ✨
          </span>
        )}
      </div>
    )
  }

  return (
    <div className="card p-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="relative">
          <img
            src={profile.avatar}
            alt={profile.name}
            className="w-20 h-20 rounded-2xl border-4 border-white shadow-md"
          />
          {profile.optInMentoring && (
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-brand-500 rounded-full flex items-center justify-center shadow-sm">
              <Star className="w-3 h-3 text-white fill-white" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-bold text-gray-900">{profile.name}</h2>
          <p className="text-brand-600 font-medium text-sm">{profile.role}</p>

          <div className="flex items-center gap-1.5 mt-1 text-gray-500 text-xs">
            <MapPin className="w-3.5 h-3.5" />
            <span>{profile.squad}</span>
            <span className="text-gray-300">·</span>
            <span>{profile.yearsOfExperience} anos de exp.</span>
          </div>

          {/* Social links */}
          <div className="flex gap-2 mt-2">
            {profile.github && (
              <a
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-700 transition-colors"
              >
                <Github className="w-4 h-4" />
              </a>
            )}
            {profile.linkedin && (
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-600 transition-colors"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="hidden sm:flex flex-col items-end gap-2">
          <div className="text-right">
            <span className="text-2xl font-bold text-brand-600">{profile.impactScore}</span>
            <p className="text-xs text-gray-400">score de impacto</p>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <TrendingUp className="w-3.5 h-3.5 text-green-500" />
            <span>{profile.contributionCount} contribuições</span>
          </div>
        </div>
      </div>

      {/* Bio */}
      <p className="mt-4 text-sm text-gray-600 leading-relaxed">{profile.bio}</p>

      {/* Skills */}
      <div className="mt-4">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Skills</p>
        <div className="flex flex-wrap gap-1.5">
          {profile.skills.map((skill) => (
            <SkillBadge key={skill} skill={skill} size="sm" />
          ))}
        </div>
      </div>

      {/* Top tags */}
      {profile.topTags.length > 0 && (
        <div className="mt-3">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Tópicos frequentes
          </p>
          <div className="flex flex-wrap gap-1.5">
            {profile.topTags.map((tag) => (
              <span key={tag} className="badge bg-gray-50 text-gray-600 border border-gray-200 text-xs">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Mentoring badge */}
      {profile.optInMentoring && (
        <div className="mt-4 p-3 bg-gradient-to-r from-brand-50 to-purple-50 rounded-xl border border-brand-100">
          <p className="text-sm font-semibold text-brand-700">✨ Disponível para mentoria</p>
          <p className="text-xs text-gray-500 mt-0.5">
            Esta profissional está aberta a ser mentora. Conecte-se!
          </p>
        </div>
      )}
    </div>
  )
}
