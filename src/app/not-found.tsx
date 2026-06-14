import Link from 'next/link'
import { Film } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="rounded-2xl border border-[#2a2520] bg-surface p-8 shadow-2xl max-w-md w-full">
        <div className="mb-4 flex justify-center">
          <div className="rounded-full bg-[#d4a853]/10 p-3">
            <Film size={24} className="text-[#d4a853]" />
          </div>
        </div>
        <h2 className="mb-2 text-xl font-bold text-text-primary font-display">
          Page not found
        </h2>
        <p className="mb-6 text-sm text-text-secondary">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link href="/">
          <Button className="w-full">Go Home</Button>
        </Link>
      </div>
    </div>
  )
}
