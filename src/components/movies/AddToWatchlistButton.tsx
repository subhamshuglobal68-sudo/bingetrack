'use client'
import { useState, useEffect, useRef } from 'react'
import { Plus, Check, ChevronDown } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { useToast, Toast } from '@/components/ui/Toast'
import type { Watchlist } from '@/types'

interface AddToWatchlistButtonProps {
  movie: {
    imdb_id: string
    title: string
    poster_url: string | null
    release_year: string | null
  }
  isLoggedIn: boolean
  userId?: string
}

export function AddToWatchlistButton({ movie, isLoggedIn, userId }: AddToWatchlistButtonProps) {
  const { toast, showToast, dismissToast } = useToast()
  const [open, setOpen] = useState(false)
  const [watchlists, setWatchlists] = useState<Watchlist[]>([])
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set())
  const [creating, setCreating] = useState(false)
  const [newName, setNewName] = useState('')
  const [loading, setLoading] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside or pressing Escape
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false)
        setCreating(false)
      }
    }
    const escHandler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        setCreating(false)
      }
    }
    document.addEventListener('mousedown', handler)
    document.addEventListener('keydown', escHandler)
    return () => {
      document.removeEventListener('mousedown', handler)
      document.removeEventListener('keydown', escHandler)
    }
  }, [])

  // Fetch user's watchlists when dropdown opens
  useEffect(() => {
    if (!open || !isLoggedIn || !userId) return
    const supabase = createClient()
    const fetchData = async () => {
      const { data: lists } = await supabase
        .from('watchlists')
        .select('*')
        .eq('user_id', userId)
        .order('created_at')
      if (!lists) return
      setWatchlists(lists)

      // Check which lists already contain this movie
      const { data: items } = await supabase
        .from('watchlist_items')
        .select('watchlist_id')
        .eq('imdb_id', movie.imdb_id)

      setAddedIds(new Set(items?.map(i => i.watchlist_id) ?? []))
    }
    fetchData()
  }, [open, isLoggedIn, userId, movie.imdb_id])

  if (!isLoggedIn) {
    return (
      <Button variant="ghost" onClick={() => (window.location.href = '/login')}>
        <Plus size={16} /> Sign in to Add
      </Button>
    )
  }

  const addToList = async (watchlistId: string, watchlistName: string) => {
    setLoading(true)
    const supabase = createClient()
    const yearMatch = movie.release_year?.match(/\d{4}/)
    const { error } = await supabase.from('watchlist_items').insert({
      watchlist_id: watchlistId,
      imdb_id: movie.imdb_id,
      title: movie.title,
      poster_url: movie.poster_url,
      release_year: yearMatch ? parseInt(yearMatch[0]) : null,
    })
    setLoading(false)

    if (error?.code === '23505') {
      showToast('Already in this list', 'error')
    } else if (error) {
      showToast('Failed to add movie', 'error')
    } else {
      setAddedIds(prev => new Set([...prev, watchlistId]))
      showToast(`Added to "${watchlistName}"`, 'success')
    }
  }

  const createAndAdd = async () => {
    if (!newName.trim() || !userId) return
    setLoading(true)
    const supabase = createClient()
    const { data: list, error } = await supabase
      .from('watchlists')
      .insert({ name: newName.trim(), is_public: true, user_id: userId })
      .select()
      .single()
    if (error || !list) {
      showToast('Failed to create list', 'error')
      setLoading(false)
      return
    }
    setWatchlists(prev => [...prev, list])
    await addToList(list.id, list.name)
    setCreating(false)
    setNewName('')
    setOpen(false)
  }

  return (
    <>
      <div className="relative" ref={dropdownRef}>
        <Button onClick={() => setOpen(prev => !prev)} className="gap-2" id="add-to-watchlist-btn">
          <Plus size={16} /> Add to Watchlist <ChevronDown size={14} />
        </Button>

        {open && (
          <div className="absolute left-0 top-full z-30 mt-2 w-72 rounded-xl border border-[#2a2520] bg-surface shadow-2xl overflow-hidden">
            {watchlists.length === 0 ? (
              <p className="px-4 py-4 text-sm text-text-secondary text-center">
                No lists yet — create one below
              </p>
            ) : (
              <div className="max-h-60 overflow-y-auto">
                {watchlists.map(list => (
                  <button
                    key={list.id}
                    onClick={() => addToList(list.id, list.name)}
                    disabled={addedIds.has(list.id) || loading}
                    className="flex w-full items-center justify-between px-4 py-3 text-left text-sm hover:bg-surface-2 disabled:opacity-60 transition-colors cursor-pointer"
                  >
                    <span className="truncate">{list.name}</span>
                    {addedIds.has(list.id) && (
                      <Check size={14} className="text-green-soft shrink-0 ml-2" />
                    )}
                  </button>
                ))}
              </div>
            )}
            <hr className="border-[#2a2520]" />
            {creating ? (
              <div className="p-3">
                <input
                  autoFocus
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && createAndAdd()}
                  placeholder="List name..."
                  maxLength={100}
                  className="mb-2 w-full rounded-lg border border-[#2a2520] bg-background px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-[#d4a853] transition-colors"
                />
                <div className="flex gap-2">
                  <Button
                    variant="primary"
                    className="flex-1 text-xs py-1.5"
                    onClick={createAndAdd}
                    isLoading={loading}
                  >
                    Create & Add
                  </Button>
                  <Button
                    variant="ghost"
                    className="text-xs py-1.5"
                    onClick={() => setCreating(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setCreating(true)}
                className="flex w-full items-center gap-2 px-4 py-3 text-sm text-[#d4a853] hover:bg-surface-2 transition-colors cursor-pointer"
              >
                <Plus size={14} /> New Watchlist
              </button>
            )}
          </div>
        )}
      </div>

      {toast && (
        <Toast message={toast.message} type={toast.type} onDismiss={dismissToast} />
      )}
    </>
  )
}
