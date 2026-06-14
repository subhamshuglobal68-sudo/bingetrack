'use client'
import { useState } from 'react'
import { X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { useToast, Toast } from '@/components/ui/Toast'

interface RemoveMovieButtonProps {
  watchlistId: string
  imdbId: string
  movieTitle: string
}

export function RemoveMovieButton({ watchlistId, imdbId, movieTitle }: RemoveMovieButtonProps) {
  const supabase = createClient()
  const { toast, showToast, dismissToast } = useToast()
  const [confirming, setConfirming] = useState(false)
  const [removing, setRemoving] = useState(false)

  const remove = async () => {
    setRemoving(true)
    const { error } = await supabase
      .from('watchlist_items')
      .delete()
      .eq('watchlist_id', watchlistId)
      .eq('imdb_id', imdbId)

    setRemoving(false)
    if (error) {
      showToast('Failed to remove movie', 'error')
    } else {
      showToast('Removed from list', 'success')
      // Refresh the page to reflect the removal
      window.location.reload()
    }
    setConfirming(false)
  }

  return (
    <>
      <button
        onClick={() => setConfirming(true)}
        className="absolute top-2 right-2 z-10 rounded-full bg-surface/80 p-1.5 text-text-secondary hover:bg-surface hover:text-red-400 transition-colors backdrop-blur-sm"
        title="Remove from watchlist"
      >
        <X size={14} />
      </button>

      <Modal isOpen={confirming} onClose={() => setConfirming(false)} title="Remove Movie">
        <p className="text-text-secondary mb-6">
          Remove <strong>&quot;{movieTitle}&quot;</strong> from this watchlist?
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setConfirming(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={remove} isLoading={removing}>
            Remove
          </Button>
        </div>
      </Modal>

      {toast && (
        <Toast message={toast.message} type={toast.type} onDismiss={dismissToast} />
      )}
    </>
  )
}
