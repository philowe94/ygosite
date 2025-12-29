'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { YuGiOhCard } from '@/types/card'
import { getCardImageUrl, getCardImageFallback } from '@/lib/image-utils'

interface CardProps {
  card: YuGiOhCard
}

export default function Card({ card }: CardProps) {
  const externalUrl = card.card_images[0]?.image_url || card.card_images[0]?.image_url_small || ''
  const localUrl = externalUrl ? getCardImageUrl(card.id, externalUrl) : ''
  const [imageError, setImageError] = useState(false)
  const [currentSrc, setCurrentSrc] = useState(localUrl)
  
  const handleImageError = () => {
    if (!imageError && externalUrl) {
      // Fall back to external URL if local image fails
      setImageError(true)
      setCurrentSrc(externalUrl)
    }
  }
  
  return (
    <Link href={`/cards/${card.id}`}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer hover:scale-105">
        {/* Card Image */}
        <div className="relative w-full aspect-[2/3] bg-gray-100 overflow-hidden">
          {currentSrc ? (
            <Image
              src={currentSrc}
              alt={card.name}
              fill
              className="object-contain"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              onError={handleImageError}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No Image
            </div>
          )}
        </div>

        {/* Card Info */}
        <div className="p-4">
          <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {card.name}
          </h3>
          <div className="flex flex-wrap gap-2 text-sm">
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">
              {card.type}
            </span>
            {card.attribute && (
              <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded">
                {card.attribute}
              </span>
            )}
            {card.race && (
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded">
                {card.race}
              </span>
            )}
          </div>
          {(card.atk !== undefined || card.def !== undefined) && (
            <div className="mt-2 text-sm text-gray-600">
              {card.atk !== undefined && <span>ATK: {card.atk}</span>}
              {card.atk !== undefined && card.def !== undefined && ' / '}
              {card.def !== undefined && <span>DEF: {card.def}</span>}
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
