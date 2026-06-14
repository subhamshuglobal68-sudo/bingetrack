'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import { LogOut, List, User } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Avatar } from '@/components/ui/Avatar'
import { cn } from '@/lib/utils'
import type { Profile } from '@/types'

interface NavbarProps {
  profile: Profile | null
}

export function Navbar({ profile }: NavbarProps) {
  const router = useRouter()
  const supabase = createClient()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setDropdownOpen(false)
    router.push('/')
    router.refresh()
  }

  return (
    <nav className={cn(
      'sticky top-0 z-40 border-b border-[#2a2520] transition-all duration-300',
      scrolled
        ? 'bg-[#0a0a0a] shadow-lg shadow-black/40'
        : 'bg-[#0a0a0a]'
    )}>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 text-xl font-bold text-[#d4a853] transition-opacity hover:opacity-90 font-display"
        >
          <Image
            src="/icon.png"
            alt="BingeTrack logo"
            width={28}
            height={36}
            className="rounded-sm"
            priority
          />
          <span className="tracking-tight">BingeTrack</span>
        </Link>

        {/* Auth area */}
        <div className="flex items-center gap-3">
          {profile ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(prev => !prev)}
                className="flex items-center gap-2 rounded-full transition-transform hover:scale-105 cursor-pointer"
                aria-label="User menu"
              >
                <Avatar src={profile.avatar_url} name={profile.full_name} size={36} />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 rounded-xl border border-[#2a2520] bg-surface shadow-2xl overflow-hidden">
                  {/* User info */}
                  <div className="border-b border-[#2a2520] px-4 py-3">
                    <p className="text-sm font-medium text-text-primary truncate">
                      {profile.full_name ?? profile.username}
                    </p>
                    <p className="text-xs text-text-secondary truncate">@{profile.username}</p>
                  </div>

                  <Link
                    href="/watchlists"
                    className="flex items-center gap-3 px-4 py-3 text-sm text-text-primary hover:bg-surface-2 transition-colors"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <List size={16} className="text-text-secondary" /> My Lists
                  </Link>
                  <Link
                    href={`/u/${profile.username}`}
                    className="flex items-center gap-3 px-4 py-3 text-sm text-text-primary hover:bg-surface-2 transition-colors"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <User size={16} className="text-text-secondary" /> Profile
                  </Link>
                  <hr className="border-[#2a2520]" />
                  <button
                    onClick={handleSignOut}
                    className="flex w-full items-center gap-3 px-4 py-3 text-sm text-destructive hover:bg-surface-2 transition-colors cursor-pointer"
                  >
                    <LogOut size={16} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="btn-press rounded-lg bg-gradient-accent px-5 py-2 text-sm font-medium text-[#0a0a0a] font-semibold shadow-lg shadow-[#d4a853]/20 hover:shadow-[#d4a853]/30 transition-all duration-200"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
