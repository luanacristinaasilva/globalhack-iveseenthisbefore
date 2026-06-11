import { useState } from 'react'
import { X, Calendar } from 'lucide-react'

interface Props {
  mentorId: string
  mentorName: string
  menteeId: string
  onSchedule: (data: {
    mentorId: string
    menteeId: string
    scheduledAt: string
    durationMinutes: number
    topic: string
    notes?: string
  }) => Promise<void>
  onClose: () => void
}

export default function ScheduleModal({ mentorId, mentorName, menteeId, onSchedule, onClose }: Props) {
  const [topic, setTopic] = useState('')
  const [scheduledAt, setScheduledAt] = useState('')
  const [duration, setDuration] = useState(60)
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)

  const minDate = new Date(Date.now() + 60 * 60 * 1000).toISOString().slice(0, 16)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!topic || !scheduledAt) return
    setLoading(true)
    await onSchedule({
      mentorId,
      menteeId,
      scheduledAt: new Date(scheduledAt).toISOString(),
      durationMinutes: duration,
      topic,
      notes: notes || undefined,
    })
    setLoading(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-brand-600" />
            <h2 className="font-bold text-gray-900">Agendar Sessão</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="bg-brand-50 rounded-xl p-3 border border-brand-100">
            <p className="text-xs text-gray-500">Mentora selecionada</p>
            <p className="font-semibold text-brand-700">{mentorName}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tópico da sessão *
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              required
              placeholder="Ex: Transição de carreira para backend..."
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data e Hora *
              </label>
              <input
                type="datetime-local"
                value={scheduledAt}
                min={minDate}
                onChange={(e) => setScheduledAt(e.target.value)}
                required
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duração
              </label>
              <select
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
              >
                <option value={30}>30 minutos</option>
                <option value={45}>45 minutos</option>
                <option value={60}>1 hora</option>
                <option value={90}>1h30</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notas adicionais
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Contexto adicional para a mentora..."
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300 resize-none"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button type="button" onClick={onClose} className="flex-1 btn-secondary">
              Cancelar
            </button>
            <button type="submit" disabled={loading || !topic || !scheduledAt} className="flex-1 btn-primary">
              {loading ? 'Agendando...' : '🗓️ Confirmar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
