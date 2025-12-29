'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import CardGrid from '@/components/CardGrid'
import CardFilters, { FilterState } from '@/components/CardFilters'
import { YuGiOhCard } from '@/types/card'

export default function CardsContent() {
  const [cards, setCards] = useState<YuGiOhCard[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const searchParams = useSearchParams()
  const router = useRouter()

  const fetchCards = useCallback(async (filters: FilterState) => {
    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams()
      if (filters.name) params.append('name', filters.name)
      if (filters.type) params.append('type', filters.type)
      if (filters.race) params.append('race', filters.race)
      if (filters.attribute) params.append('attribute', filters.attribute)
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
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const filters: FilterState = {
      name: searchParams.get('name') || '',
      type: searchParams.get('type') || '',
      race: searchParams.get('race') || '',
      attribute: searchParams.get('attribute') || '',
    }
    fetchCards(filters)
  }, [searchParams, fetchCards])

  const handleFilterChange = (filters: FilterState) => {
    const params = new URLSearchParams()
    if (filters.name) params.append('name', filters.name)
    if (filters.type) params.append('type', filters.type)
    if (filters.race) params.append('race', filters.race)
    if (filters.attribute) params.append('attribute', filters.attribute)
    
    router.push(`/cards?${params.toString()}`)
  }

  return (
    <>
      <CardFilters onFilterChange={handleFilterChange} />

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          <p className="font-medium">Error: {error}</p>
        </div>
      )}

      {!loading && !error && (
        <div className="mb-6">
          <p className="text-gray-600">
            Found <span className="font-semibold">{cards.length}</span> card{cards.length !== 1 ? 's' : ''}
          </p>
        </div>
      )}

      <CardGrid cards={cards} loading={loading} />
    </>
  )
}
