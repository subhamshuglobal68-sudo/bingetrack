'use client'
import { useState } from 'react'
import { Eye, EyeOff, Edit3, Trash2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { useToast, Toast } from '@/components/ui/Toast'
import type { Watchlist } from '@/types'

interface WatchlistHeaderProps {
  watchlist: Watchlist
  isOwner: boolean
  itemCount: number
}

export function WatchlistHeader({ watchlist: initial, isOwner, itemCount }: WatchlistHeaderProps) {
  const supabase = createClient()
  const router = useRouter()
  const { toast, showToast, dismissToast } = useToast()

  const [watchlist, setWatchlist] = useState(initial)
  const [showMenu, setShowMenu] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [showRename, setShowRename] = useState(false)
  const [renameName, setRenameName] = useState(initial.name)
  const [renameDesc, setRenameDesc] = useState(initial.description ?? '')
  const [loading, setLoading] = useState(false)

  const toggleVisibility = async (next: boolean) => {
    const { error } = await supabase
      .from('watchlists')
      .update({ is_public: next })
      .eq('id', watchlist.id)
    if (error) {
      showToast('Failed to update visibility', 'error')
    } else {
      setWatchlist(prev => ({ ...prev, is_public: next }))
      showToast(next ? 'List made public' : 'List made private', 'success')
    }
    setShowMenu(false)
  }

  const renameList = async () => {
    const trimmedName = renameName.trim()
    if (!trimmedName) return
    setLoading(true)
    const { error } = await supabase
      .from('watchlists')
      .update({
        name: trimmedName,
        description: renameDesc.trim() || null,
      })
      .eq('id', watchlist.id)
    setLoading(false)
    if (error) {
      showToast('Failed to rename list', 'error')
    } else {
      setWatchlist(prev => ({
        ...prev,
        name: trimmedName,
        description: renameDesc.trim() || null,
      }))
      setShowRename(false)
      showToast('List updated', 'success')
    }
    setShowMenu(false)
  }

  const deleteList = async () => {
    setLoading(true)
    const { error } = await supabase
      .from('watchlists')
      .delete()
      .eq('id', watchlist.id)
    setLoading(false)
    if (error) {
      showToast('Failed to delete list', 'error')
    } else {
      showToast('List deleted', 'success')
      router.push('/watchlists')
    }
    setConfirmDelete(false)
  }

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary sm:text-3xl">
            {watchlist.name}
          </h1>
          {watchlist.description && (
            <p className="mt-1 text-text-secondary">{watchlist.description}</p>
          )}
          <div className="mt-2 flex items-center gap-3 text-sm text-text-secondary">
            <span>
              {itemCount}{' '}
              {itemCount === 1 ? 'movie' : 'movies'}
            </span>
            <span>·</span>
            <span className="flex items-center gap-1">
              {watchlist.is_public ? (
                <>
                  <Eye size={12} className="text-green-soft" /> Public
                </>
              ) : (
                <>
                  <EyeOff size={12} className="text-text-secondary" /> Private
                </>
              )}
            </span>
          </div>
        </div>

        {isOwner && (
          <div className="relative shrink-0">
            <Button
              variant="ghost"
              onClick={() => setShowMenu(prev => !prev)}
            >
              Manage ▾
            </Button>
            {showMenu && (
              <div className="absolute right-0 top-full z-20 mt-2 w-48 rounded-xl border border-[#2a2520] bg-surface shadow-2xl overflow-hidden">
                <button
                  onClick={() => {
                    setShowMenu(false)
                    setShowRename(true)
                  }}
                  className="flex w-full items-center gap-2 px-4 py-3 text-sm text-text-primary hover:bg-surface-2 transition-colors cursor-pointer"
                >
                  <Edit3 size={14} /> Rename list
                </button>
                <button
                  onClick={() => toggleVisibility(!watchlist.is_public)}
                  className="flex w-full items-center gap-2 px-4 py-3 text-sm text-text-primary hover:bg-surface-2 transition-colors cursor-pointer"
                >
                  {watchlist.is_public ? (
                    <><EyeOff size={14} /> Make private</>
                  ) : (
                    <><Eye size={14} /> Make public</>
                  )}
                </button>
                <hr className="border-[#2a2520]" />
                <button
                  onClick={() => {
                    setConfirmDelete(true)
                    setShowMenu(false)
                  }}
                  className="flex w-full items-center gap-2 px-4 py-3 text-sm text-red-400 hover:bg-surface-2 transition-colors cursor-pointer"
                >
                  <Trash2 size={14} /> Delete list
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Rename modal */}
      <Modal isOpen={showRename} onClose={() => setShowRename(false)} title="Rename Watchlist">
        <div className="flex flex-col gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-secondary">
              Name
            </label>
            <input
              autoFocus
              value={renameName}
              onChange={e => setRenameName(e.target.value)}
              maxLength={100}
              className="w-full rounded-lg border border-[#2a2520] bg-background px-4 py-2.5 text-text-primary focus:border-[#d4a853] focus:outline-none transition-colors"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-secondary">
              Description (optional)
            </label>
            <textarea
              value={renameDesc}
              onChange={e => setRenameDesc(e.target.value)}
              maxLength={500}
              rows={3}
              className="w-full resize-none rounded-lg border border-[#2a2520] bg-background px-4 py-2.5 text-text-primary focus:border-[#d4a853] focus:outline-none transition-colors"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={() => setShowRename(false)}>
              Cancel
            </Button>
            <Button
              onClick={renameList}
              isLoading={loading}
              disabled={!renameName.trim()}
            >
              Save
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete confirmation modal */}
      <Modal
        isOpen={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        title="Delete Watchlist"
      >
        <p className="text-text-secondary mb-6">
          Are you sure you want to delete <strong>&quot;{watchlist.name}&quot;</strong>? This
          action cannot be undone.
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setConfirmDelete(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={deleteList}
            isLoading={loading}
          >
            Delete
          </Button>
        </div>
      </Modal>

      {toast && (
        <Toast message={toast.message} type={toast.type} onDismiss={dismissToast} />
      )}
    </>
  )
}
