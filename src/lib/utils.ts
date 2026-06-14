import { clsx, type ClassValue } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export function formatYear(dateString: string | null | undefined): string {
  if (!dateString || dateString === 'N/A') return 'Unknown'
  const match = dateString.match(/\d{4}/)
  return match ? match[0] : 'Unknown'
}

export function formatRating(rating: string | number | null | undefined): string {
  if (rating === null || rating === undefined || rating === 'N/A') return 'N/A'
  const num = typeof rating === 'string' ? parseFloat(rating) : rating
  return isNaN(num) ? 'N/A' : num.toFixed(1)
}

export function formatRuntime(runtime: string | null | undefined): string {
  if (!runtime || runtime === 'N/A') return 'Unknown'
  const match = runtime.match(/(\d+)\s*min/)
  if (!match) return runtime
  const totalMin = parseInt(match[1])
  const h = Math.floor(totalMin / 60)
  const m = totalMin % 60
  return h > 0 ? `${h}h ${m}m` : `${m}m`
}

export function getInitials(name: string | null): string {
  if (!name || !name.trim()) return '?'
  return name
    .trim()
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}
