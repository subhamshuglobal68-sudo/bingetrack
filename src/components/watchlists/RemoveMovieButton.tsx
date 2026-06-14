'use client'
import { X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useToast, Toast } from '@/components/ui/Toast'

interface RemoveMovieButtonProps {
  watchlistId: string
  imdbId: string
  movieTitle: string
}

export function RemoveMovieButton({
  watchlistId,
  imdbId,
  movieTitle,
}: RemoveMovieButtonProps) {
  const supabase = createClient()
  const router = useRouter()
  const { toast, showToast, dismissToast } = useToast()

  const handleRemove = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const { error } = await supabase
      .from('watchlist_items')
      .delete()
      .eq('watchlist_id', watchlistId)
      .eq('imdb_id', imdbId)

    if (error) {
      showToast('Failed to remove movie', 'error')
    } else {
      showToast(`Removed "${movieTitle}"`, 'success')
      router.refresh()
    }
  }

  return (
    <>
      <button
        onClick={handleRemove}
        className="absolute top-2 right-2 z-10 rounded-full bg-black/80 p-1.5 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/80 cursor-pointer"
        aria-label={`Remove ${movieTitle}`}
      >
        <X size={14} />
      </button>

      {toast && (
        <Toast message={toast.message} type={toast.type} onDismiss={dismissToast} />
      )}
    </>
  )
}
