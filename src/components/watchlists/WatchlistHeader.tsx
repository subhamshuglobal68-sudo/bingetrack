'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Globe, Lock, Trash2, MoreHorizontal } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { useToast, Toast } from '@/components/ui/Toast'
import type { Watchlist } from '@/types'

interface WatchlistHeaderProps {
  watchlist: Watchlist
  isOwner: boolean
  itemCount: number
}

export function WatchlistHeader({ watchlist, isOwner, itemCount }: WatchlistHeaderProps) {
  const supabase = createClient()
  const router = useRouter()
  const { toast, showToast, dismissToast } = useToast()
  const [showMenu, setShowMenu] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const toggleVisibility = async () => {
    const { error } = await supabase
      .from('watchlists')
      .update({ is_public: !watchlist.is_public })
      .eq('id', watchlist.id)
    if (error) {
      showToast('Failed to update visibility', 'error')
    } else {
      showToast(
        watchlist.is_public ? 'List is now private' : 'List is now public',
        'success'
      )
      router.refresh()
    }
    setShowMenu(false)
  }

  const deleteWatchlist = async () => {
    setDeleting(true)
    const { error } = await supabase
      .from('watchlists')
      .delete()
      .eq('id', watchlist.id)
    setDeleting(false)
    if (error) {
      showToast('Failed to delete watchlist', 'error')
    } else {
      router.push('/watchlists')
      router.refresh()
    }
  }

  return (
    <>
      <div className="mb-8">
        {/* Breadcrumb */}
        <button
          onClick={() => router.push('/watchlists')}
          className="mb-4 text-sm text-text-secondary hover:text-[#d4a853] transition-colors cursor-pointer"
        >
          ← Back to My Lists
        </button>

        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-text-primary truncate sm:text-3xl">
                {watchlist.name}
              </h1>
              <span
                className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium shrink-0 ${
                  watchlist.is_public
                    ? 'bg-green-950/50 text-green-400 border border-green-800/30'
                    : 'bg-surface-2 text-text-secondary border border-[#2a2520]'
                }`}
              >
                {watchlist.is_public ? (
                  <>
                    <Globe size={10} /> Public
                  </>
                ) : (
                  <>
                    <Lock size={10} /> Private
                  </>
                )}
              </span>
            </div>
            {watchlist.description && (
              <p className="text-text-secondary text-sm mb-2">{watchlist.description}</p>
            )}
            <p className="text-xs text-text-secondary">
              {itemCount} {itemCount === 1 ? 'movie' : 'movies'}
            </p>
          </div>

          {/* Owner actions */}
          {isOwner && (
            <div className="relative shrink-0">
              <Button
                variant="ghost"
                onClick={() => setShowMenu(prev => !prev)}
                className="px-2"
              >
                <MoreHorizontal size={18} />
              </Button>
              {showMenu && (
                <div className="absolute right-0 mt-1 w-48 rounded-xl border border-[#2a2520] bg-surface shadow-2xl overflow-hidden z-20">
                  <button
                    onClick={toggleVisibility}
                    className="flex w-full items-center gap-2 px-4 py-3 text-sm text-text-primary hover:bg-surface-2 transition-colors cursor-pointer"
                  >
                    {watchlist.is_public ? (
                      <>
                        <Lock size={14} /> Make Private
                      </>
                    ) : (
                      <>
                        <Globe size={14} /> Make Public
                      </>
                    )}
                  </button>
                  <hr className="border-[#2a2520]" />
                  <button
                    onClick={() => {
                      setShowMenu(false)
                      setShowDeleteConfirm(true)
                    }}
                    className="flex w-full items-center gap-2 px-4 py-3 text-sm text-destructive hover:bg-surface-2 transition-colors cursor-pointer"
                  >
                    <Trash2 size={14} /> Delete List
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Delete confirmation modal */}
      <Modal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title="Delete Watchlist"
      >
        <p className="text-text-secondary text-sm mb-6">
          Are you sure you want to delete &ldquo;{watchlist.name}&rdquo;? This will remove
          all movies in the list. This cannot be undone.
        </p>
        <div className="flex gap-3">
          <Button
            variant="danger"
            onClick={deleteWatchlist}
            isLoading={deleting}
            className="flex-1"
          >
            <Trash2 size={14} /> Delete
          </Button>
          <Button variant="ghost" onClick={() => setShowDeleteConfirm(false)}>
            Cancel
          </Button>
        </div>
      </Modal>

      {toast && (
        <Toast message={toast.message} type={toast.type} onDismiss={dismissToast} />
      )}
    </>
  )
}
