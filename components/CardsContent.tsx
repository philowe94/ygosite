'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { YuGiOhCard } from '@/types/card'
import CardImage from './CardImage'
import CardListItem from './CardListItem'
import { getCardImageUrl } from '@/lib/image-utils'

type ViewMode = 'grid' | 'list'

export default function CardsContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [cards, setCards] = useState<YuGiOhCard[]>([])
  const [initialLoading, setInitialLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  // Initialize search value from URL params (handles back button navigation)
  const [searchValue, setSearchValue] = useState(() => searchParams.get('name') || '')
  const debounceTimer = useRef<NodeJS.Timeout | null>(null)

  const fetchCards = useCallback(async (searchTerm: string, isInitial = false) => {
    if (isInitial) {
      setInitialLoading(true)
    }
    setError(null)

    try {
      const params = new URLSearchParams()
      if (searchTerm) {
        params.append('name', searchTerm)
      }
      params.append('limit', '100')

      const response = await fetch(`/api/cards?${params.toString()}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch cards')
      }

      const data = await response.json()
      setCards(data.data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setCards([])
    } finally {
      if (isInitial) {
        setInitialLoading(false)
      }
    }
  }, [])

  useEffect(() => {
    const searchTerm = searchParams.get('name') || ''
    // Always sync search value from URL params (handles back button)
    setSearchValue(searchTerm)
    
    // Only show loading on initial load
    const isInitial = initialLoading
    fetchCards(searchTerm, isInitial)
  }, [searchParams, fetchCards, initialLoading])

  const handleSearchChange = (value: string) => {
    setSearchValue(value)
    
    // Clear existing timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current)
    }

    // Debounce search
    debounceTimer.current = setTimeout(() => {
      const params = new URLSearchParams()
      if (value) {
        params.append('name', value)
      }
      // Use replace to update URL without creating new history entry for each keystroke
      // This allows back button to work properly
      const newUrl = `/cards${params.toString() ? `?${params.toString()}` : ''}`
      router.push(newUrl, { scroll: false })
    }, 500)
  }

  return (
    <>
      {/* Search Input and View Toggle */}
      <div className="sticky top-0 z-10 bg-white border-b p-4">
        <div className="max-w-7xl mx-auto flex gap-4 items-center">
          <div className="flex-1 relative">
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchValue}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Text Search"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded"
            />
          </div>
          {/* View Mode Toggle */}
          <div className="flex gap-2 border border-gray-300 rounded overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-4 py-2 ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
              title="Grid View"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
              title="List View"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {error && (
          <div className="mb-4 text-red-600">
            Error: {error}
          </div>
        )}

        {initialLoading ? (
          <div>Loading...</div>
        ) : cards.length === 0 ? (
          <div>No cards found</div>
        ) : viewMode === 'list' ? (
          <div className="space-y-6">
            {cards.map((card) => (
              <CardListItem key={card.id} card={card} searchParams={searchParams} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {cards.map((card) => {
              const externalUrl = card.card_images[0]?.image_url || card.card_images[0]?.image_url_small || ''
              const imageUrl = externalUrl ? getCardImageUrl(card.id, externalUrl) : ''
              // Preserve search params when navigating to card detail
              const searchParam = searchParams.get('name')
              const cardUrl = searchParam ? `/cards/${card.id}?name=${encodeURIComponent(searchParam)}` : `/cards/${card.id}`

              return (
                <a
                  key={card.id}
                  href={cardUrl}
                  className="block border border-gray-300 p-2 hover:bg-gray-50"
                >
                  {imageUrl ? (
                    <div className="relative w-full aspect-[2/3] mb-2">
                      <CardImage
                        src={imageUrl}
                        fallbackSrc={externalUrl}
                        alt={card.name}
                        fill
                        className="object-contain"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                      />
                    </div>
                  ) : (
                    <div className="w-full aspect-[2/3] bg-gray-100 mb-2 flex items-center justify-center text-gray-400 text-xs">
                      No Image
                    </div>
                  )}
                  <div className="text-sm font-medium">{card.name}</div>
                </a>
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}