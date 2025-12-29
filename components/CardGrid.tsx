'use client'

import { YuGiOhCard } from '@/types/card'
import Card from './Card'

interface CardGridProps {
  cards: YuGiOhCard[]
  loading?: boolean
}

export default function CardGrid({ cards, loading }: CardGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-2">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="bg-gray-200 rounded-lg h-96 animate-pulse"
          />
        ))}
      </div>
    )
  }

  if (cards.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 text-lg">No cards found. Try adjusting your search filters.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-2">
      {cards.map((card) => (
        <Card key={card.id} card={card} />
      ))}
    </div>
  )
}
