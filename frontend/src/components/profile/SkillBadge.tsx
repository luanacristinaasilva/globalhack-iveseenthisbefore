interface Props {
  skill: string
  size?: 'sm' | 'md'
}

export default function SkillBadge({ skill, size = 'md' }: Props) {
  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'
  return (
    <span
      className={`inline-flex items-center ${sizeClass} rounded-full font-medium bg-brand-50 text-brand-700 border border-brand-200`}
    >
      {skill}
    </span>
  )
}
