'use client'

import Image from 'next/image'
import { useState } from 'react'

interface CardImageProps {
  src: string
  fallbackSrc: string
  alt: string
  fill?: boolean
  className?: string
  sizes?: string
  priority?: boolean
}

export default function CardImage({
  src,
  fallbackSrc,
  alt,
  fill = false,
  className,
  sizes,
  priority = false,
}: CardImageProps) {
  const [imageError, setImageError] = useState(false)
  const [currentSrc, setCurrentSrc] = useState(src)

  const handleError = () => {
    if (!imageError && fallbackSrc && currentSrc !== fallbackSrc) {
      setImageError(true)
      setCurrentSrc(fallbackSrc)
    }
  }

  if (fill) {
    return (
      <Image
        src={currentSrc}
        alt={alt}
        fill
        className={className}
        sizes={sizes}
        priority={priority}
        onError={handleError}
      />
    )
  }

  return (
    <Image
      src={currentSrc}
      alt={alt}
      width={500}
      height={750}
      className={className}
      sizes={sizes}
      priority={priority}
      onError={handleError}
    />
  )
}
