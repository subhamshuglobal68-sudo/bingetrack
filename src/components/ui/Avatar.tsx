'use client'
import { useState } from 'react'
import Image from 'next/image'
import { getInitials } from '@/lib/utils'

interface AvatarProps {
  src: string | null
  name: string | null
  size?: number
}

export function Avatar({ src, name, size = 40 }: AvatarProps) {
  const [imgError, setImgError] = useState(false)

  if (src && !imgError) {
    return (
      <Image
        src={src}
        alt={name ?? 'User avatar'}
        width={size}
        height={size}
        className="rounded-full object-cover ring-2 ring-[#2a2520]"
        onError={() => setImgError(true)}
      />
    )
  }

  return (
    <div
      className="flex items-center justify-center rounded-full bg-gradient-to-br from-accent to-accent-dim text-[#0a0a0a] font-semibold text-sm ring-2 ring-[#2a2520]"
      style={{ width: size, height: size }}
      aria-label={name ?? 'User avatar'}
    >
      {getInitials(name)}
    </div>
  )
}
