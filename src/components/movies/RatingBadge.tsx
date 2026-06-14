npm import { Star } from 'lucide-react'
import { formatRating } from '@/lib/utils'

export function RatingBadge({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1 rounded-md bg-black/80 backdrop-blur-sm px-2 py-1 text-xs font-bold text-rating">
      <Star size={10} fill="currentColor" strokeWidth={0} />
      {formatRating(rating)}
    </div>
  )
}
