'use client'
import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Globe, Lock } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useToast, Toast } from '@/components/ui/Toast'
import { useRouter } from 'next/navigation'

interface CreateWatchlistModalProps {
  isOpen: boolean
  onClose: () => void
}

export function CreateWatchlistModal({ isOpen, onClose }: CreateWatchlistModalProps) {
  const supabase = createClient()
  const router = useRouter()
  const { toast, showToast, dismissToast } = useToast()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [isPublic, setIsPublic] = useState(true)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!name.trim()) return

    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      showToast('You must be signed in', 'error')
      setLoading(false)
      return
    }
    const { data, error } = await supabase
      .from('watchlists')
      .insert({
        name: name.trim(),
        description: description.trim() || null,
        is_public: isPublic,
        user_id: user.id,
      })
      .select()
      .single()
    setLoading(false)

    if (error || !data) {
      showToast('Failed to create watchlist', 'error')
      return
    }

    // Reset form
    setName('')
    setDescription('')
    setIsPublic(true)
    onClose()
    router.push(`/watchlists/${data.id}`)
    router.refresh()
  }

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="New Watchlist">
        <div className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">
              Name <span className="text-[#d4a853]">*</span>
            </label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              placeholder="e.g. Horror Classics"
              autoFocus
              maxLength={100}
              className="w-full rounded-lg border border-[#2a2520] bg-background px-3 py-2.5 text-sm text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-[#d4a853] transition-colors"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">
              Description
            </label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="What's this list about? (optional)"
              rows={3}
              maxLength={500}
              className="w-full rounded-lg border border-[#2a2520] bg-background px-3 py-2.5 text-sm text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-[#d4a853] transition-colors resize-none"
            />
          </div>

          {/* Visibility toggle */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Visibility
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsPublic(true)}
                className={`flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-all cursor-pointer ${
                  isPublic
                    ? 'border-[#d4a853] bg-[#d4a853]/10 text-[#d4a853]'
                    : 'border-[#2a2520] text-text-secondary hover:bg-surface-2'
                }`}
              >
                <Globe size={14} /> Public
              </button>
              <button
                type="button"
                onClick={() => setIsPublic(false)}
                className={`flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-all cursor-pointer ${
                  !isPublic
                    ? 'border-[#d4a853] bg-[#d4a853]/10 text-[#d4a853]'
                    : 'border-[#2a2520] text-text-secondary hover:bg-surface-2'
                }`}
              >
                <Lock size={14} /> Private
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              onClick={handleSubmit}
              isLoading={loading}
              disabled={!name.trim()}
              className="flex-1"
            >
              Create Watchlist
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      {toast && (
        <Toast message={toast.message} type={toast.type} onDismiss={dismissToast} />
      )}
    </>
  )
}
