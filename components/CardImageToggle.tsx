'use client'

import { useState } from 'react'
import CardImage from './CardImage'
import { getCardImageUrl, getCardCroppedImageUrl } from '@/lib/image-utils'
import { YuGiOhCard } from '@/types/card'

interface CardImageToggleProps {
  card: YuGiOhCard
}

export default function CardImageToggle({ card }: CardImageToggleProps) {
  const [showCropped, setShowCropped] = useState(true)
  
  const externalCroppedUrl = card.card_images[0]?.image_url_cropped || ''
  const externalUrl = card.card_images[0]?.image_url || card.card_images[0]?.image_url_small || ''
  
  const imageUrl = showCropped 
    ? (externalCroppedUrl ? getCardCroppedImageUrl(card.id, externalCroppedUrl) : (externalUrl ? getCardImageUrl(card.id, externalUrl) : ''))
    : (externalUrl ? getCardImageUrl(card.id, externalUrl) : '')
  
  const fallbackUrl = showCropped ? (externalCroppedUrl || externalUrl) : externalUrl

  return (
    <div className="space-y-4">
      {/* Toggle Switch */}
      <div className="flex items-center justify-center gap-3">
        <span className={`text-sm ${!showCropped ? 'font-semibold' : 'text-gray-600'}`}>
          Full Art
        </span>
        <button
          onClick={() => setShowCropped(!showCropped)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            showCropped ? 'bg-blue-600' : 'bg-gray-300'
          }`}
          role="switch"
          aria-checked={showCropped}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              showCropped ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
        <span className={`text-sm ${showCropped ? 'font-semibold' : 'text-gray-600'}`}>
          Cropped Art
        </span>
      </div>

      {/* Card Image */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        {imageUrl ? (
          <div className="relative w-full aspect-[2/3] bg-gray-100 rounded-lg overflow-hidden">
            <CardImage
              src={imageUrl}
              fallbackSrc={fallbackUrl}
              alt={card.name}
              fill
              className="object-contain"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </div>
        ) : (
          <div className="w-full aspect-[2/3] bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
            No Image Available
          </div>
        )}
      </div>
    </div>
  )
}

