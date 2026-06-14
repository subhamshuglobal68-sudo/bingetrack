'use client'
import { useState } from 'react'
import { FileJson, FileSpreadsheet } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { useToast, Toast } from '@/components/ui/Toast'
import type { Watchlist, Profile } from '@/types'

interface ExportDataModalProps {
  isOpen: boolean
  onClose: () => void
}

type ExportFormat = 'json' | 'csv'

interface ExportWatchlist {
  name: string
  description: string | null
  is_public: boolean
  created_at: string
  updated_at: string
  movies: {
    title: string
    imdb_id: string
    poster_url: string | null
    release_year: number | null
    added_at: string
  }[]
}

export function ExportDataModal({ isOpen, onClose }: ExportDataModalProps) {
  const { toast, showToast, dismissToast } = useToast()
  const [loading, setLoading] = useState(false)

  const fetchData = async (): Promise<{ profile: Profile; watchlists: ExportWatchlist[] } | null> => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    const { data: lists } = await supabase
      .from('watchlists')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at')

    const watchlists: ExportWatchlist[] = []
    for (const list of (lists ?? []) as Watchlist[]) {
      const { data: items } = await supabase
        .from('watchlist_items')
        .select('title, imdb_id, poster_url, release_year, added_at')
        .eq('watchlist_id', list.id)
        .order('added_at')

      watchlists.push({
        name: list.name,
        description: list.description,
        is_public: list.is_public,
        created_at: list.created_at,
        updated_at: list.updated_at,
        movies: (items ?? []) as ExportWatchlist['movies'],
      })
    }

    return { profile: profile as Profile, watchlists }
  }

  const download = (content: string, filename: string, mime: string) => {
    const blob = new Blob([content], { type: mime })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const toCsv = (data: { profile: Profile; watchlists: ExportWatchlist[] }) => {
    const header = 'watchlist,title,imdb_id,release_year,poster_url,added_at'
    const rows = data.watchlists.flatMap(wl =>
      wl.movies.map(m =>
        [
          wl.name,
          m.title,
          m.imdb_id,
          m.release_year ?? '',
          m.poster_url ?? '',
          m.added_at,
        ]
          .map(v => `"${String(v).replace(/"/g, '""')}"`)
          .join(',')
      )
    )
    return [header, ...rows].join('\n')
  }

  const handleExport = async (format: ExportFormat) => {
    setLoading(true)
    const data = await fetchData()
    setLoading(false)

    if (!data) {
      showToast('Failed to fetch data', 'error')
      return
    }

    const timestamp = new Date().toISOString().slice(0, 10)

    if (format === 'json') {
      const json = JSON.stringify(
        {
          profile: {
            username: data.profile.username,
            full_name: data.profile.full_name,
            avatar_url: data.profile.avatar_url,
            created_at: data.profile.created_at,
          },
          exported_at: new Date().toISOString(),
          watchlists: data.watchlists,
        },
        null,
        2
      )
      download(json, `bingetrack-export-${timestamp}.json`, 'application/json')
    } else {
      const csv = toCsv(data)
      download(csv, `bingetrack-export-${timestamp}.csv`, 'text/csv')
    }

    showToast(`Exported as ${format.toUpperCase()}`, 'success')
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Export My Data">
      <p className="text-sm text-text-secondary mb-5">
        Download all your profile data, watchlists, and movies. Choose a format below.
      </p>

      <div className="flex flex-col gap-3">
        <button
          onClick={() => handleExport('json')}
          disabled={loading}
          className="flex items-center gap-3 rounded-xl border border-[#2a2520] bg-surface-2 p-4 text-left hover:border-[#d4a853]/50 transition-colors cursor-pointer disabled:opacity-50"
        >
          <FileJson size={20} className="text-[#d4a853] shrink-0" />
          <div>
            <p className="text-sm font-medium text-text-primary">JSON</p>
            <p className="text-xs text-text-secondary">Structured data with full hierarchy</p>
          </div>
        </button>

        <button
          onClick={() => handleExport('csv')}
          disabled={loading}
          className="flex items-center gap-3 rounded-xl border border-[#2a2520] bg-surface-2 p-4 text-left hover:border-[#d4a853]/50 transition-colors cursor-pointer disabled:opacity-50"
        >
          <FileSpreadsheet size={20} className="text-[#d4a853] shrink-0" />
          <div>
            <p className="text-sm font-medium text-text-primary">CSV</p>
            <p className="text-xs text-text-secondary">Spreadsheet-friendly flat format</p>
          </div>
        </button>
      </div>

      {loading && (
        <div className="mt-4 flex items-center gap-2 text-sm text-text-secondary">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#d4a853] border-t-transparent" />
          Fetching your data...
        </div>
      )}

      <div className="mt-5 flex justify-end">
        <Button variant="ghost" onClick={onClose} disabled={loading}>
          Cancel
        </Button>
      </div>

      {toast && (
        <Toast message={toast.message} type={toast.type} onDismiss={dismissToast} />
      )}
    </Modal>
  )
}
