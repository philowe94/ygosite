'use client'

import Link from 'next/link'
import { ReadonlyURLSearchParams } from 'next/navigation'
import { YuGiOhCard } from '@/types/card'
import CardImage from './CardImage'
import { getCardImageUrl, getCardCroppedImageUrl } from '@/lib/image-utils'
import { getCardTypeBackground, getAttributeSymbol, getRaceSymbol, getCardTypeBadge } from '@/lib/card-utils'

interface CardListItemProps {
  card: YuGiOhCard
  searchParams?: ReadonlyURLSearchParams | null
}

export default function CardListItem({ card, searchParams }: CardListItemProps) {
  // Use cropped image for list view
  const externalCroppedUrl = card.card_images[0]?.image_url_cropped || ''
  const externalUrl = card.card_images[0]?.image_url || card.card_images[0]?.image_url_small || ''
  const imageUrl = externalCroppedUrl ? getCardCroppedImageUrl(card.id, externalCroppedUrl) : (externalUrl ? getCardImageUrl(card.id, externalUrl) : '')
  const fallbackUrl = externalCroppedUrl || externalUrl
  const backgroundClass = getCardTypeBackground(card)
  const attributeSymbol = getAttributeSymbol(card.attribute)
  const raceSymbol = getRaceSymbol(card.race)
  const typeBadge = getCardTypeBadge(card)
  
  // Preserve search params when navigating to card detail
  const searchParam = searchParams?.get('name')
  const cardUrl = searchParam ? `/cards/${card.id}?name=${encodeURIComponent(searchParam)}` : `/cards/${card.id}`

  return (
    <Link href={cardUrl} className="block">
      <div className={`${backgroundClass} border-2 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200 flex`}>
        {/* Card Art - Left Side - Square, Smaller */}
        <div className="flex-shrink-0 w-20 h-20 relative">
          {imageUrl ? (
            <CardImage
              src={imageUrl}
              fallbackSrc={fallbackUrl}
              alt={card.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-gray-200 flex items-center justify-center text-gray-400 text-xs">
              No Image
            </div>
          )}
        </div>
        
        {/* Card Info - Right Side - Two Rows Max */}
        <div className="flex-1 flex flex-col justify-center py-1.5 px-3">
          {/* Row 1: Card Name (left) and Stats (right) */}
          <div className="flex items-center justify-between gap-4 mb-1">
            <div className="text-lg font-bold truncate">
              {card.name}
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Level/Rank/Link Rating */}
              {card.level && (
                <span className="px-2 py-0.5 bg-black/10 rounded text-xs font-medium">
                  Lv.{card.level}
                </span>
              )}
              {card.linkval && (
                <span className="px-2 py-0.5 bg-black/10 rounded text-xs font-medium">
                  LINK-{card.linkval}
                </span>
              )}
              {/* ATK/DEF for monsters */}
              {card.atk !== undefined && (
                <span className="px-2 py-0.5 bg-black/10 rounded text-xs font-medium whitespace-nowrap">
                  {card.atk}{card.def !== undefined ? `/${card.def}` : ''}
                </span>
              )}
            </div>
          </div>

          {/* Row 2: Type, Symbols, Archetype */}
          <div className="flex items-center gap-2 flex-wrap min-w-0">
            {/* Type Badge */}
            <span className="px-2 py-0.5 bg-black/10 rounded text-xs font-semibold flex-shrink-0">
              {typeBadge}
            </span>

            {/* Attribute Symbol */}
            {attributeSymbol && (
              <span className="text-lg flex-shrink-0" title={card.attribute}>
                {attributeSymbol}
              </span>
            )}

            {/* Race Symbol */}
            {raceSymbol && (
              <span className="text-lg flex-shrink-0" title={card.race}>
                {raceSymbol}
              </span>
            )}

            {/* Archetype if available */}
            {card.archetype && (
              <span className="text-xs text-gray-600 italic min-w-0 max-w-full">
                {card.archetype}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
