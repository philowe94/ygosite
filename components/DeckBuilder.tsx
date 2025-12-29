'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { YuGiOhCard } from '@/types/card'
import Card from './Card'
import CardFilters, { FilterState } from './CardFilters'

interface DeckCard {
  card: YuGiOhCard
  count: number
}

interface SavedDeck {
  id: string
  name: string
  description?: string
  cards: DeckCard[]
  createdAt: string
  updatedAt: string
}

export default function DeckBuilder() {
  const { data: session } = useSession()
  const router = useRouter()
  const [deck, setDeck] = useState<DeckCard[]>([])
  const [savedDecks, setSavedDecks] = useState<SavedDeck[]>([])
  const [currentDeckId, setCurrentDeckId] = useState<string | null>(null)
  const [deckName, setDeckName] = useState('')
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [searchResults, setSearchResults] = useState<YuGiOhCard[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [searchFilters, setSearchFilters] = useState<FilterState>({
    name: '',
    type: '',
    race: '',
    attribute: '',
  })

  // Load decks from API if logged in, otherwise from localStorage
  useEffect(() => {
    if (session?.user?.id) {
      loadUserDecks()
    } else {
      // Load from localStorage for guests
      const savedDeck = localStorage.getItem('ygosite_deck')
      if (savedDeck) {
        try {
          setDeck(JSON.parse(savedDeck))
        } catch (error) {
          console.error('Error loading deck from localStorage:', error)
        }
      }
    }
  }, [session])

  const loadUserDecks = async () => {
    try {
      const response = await fetch('/api/decks')
      if (response.ok) {
        const data = await response.json()
        setSavedDecks(data.decks || [])
      }
    } catch (error) {
      console.error('Error loading decks:', error)
    }
  }

  // Save deck to localStorage for guests
  useEffect(() => {
    if (!session && deck.length > 0) {
      localStorage.setItem('ygosite_deck', JSON.stringify(deck))
    } else if (!session && deck.length === 0) {
      localStorage.removeItem('ygosite_deck')
    }
  }, [deck, session])

  const searchCards = async (filters: FilterState) => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filters.name) params.append('name', filters.name)
      if (filters.type) params.append('type', filters.type)
      if (filters.race) params.append('race', filters.race)
      if (filters.attribute) params.append('attribute', filters.attribute)
      params.append('limit', '50')

      const response = await fetch(`/api/cards?${params.toString()}`)
      if (response.ok) {
        const data = await response.json()
        setSearchResults(data.data || [])
      }
    } catch (error) {
      console.error('Error searching cards:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (filters: FilterState) => {
    setSearchFilters(filters)
    // Auto-search when filters change
    if (filters.name || filters.type || filters.race || filters.attribute) {
      searchCards(filters)
    } else {
      setSearchResults([])
    }
  }

  const addCardToDeck = (card: YuGiOhCard) => {
    setDeck(prevDeck => {
      const existingIndex = prevDeck.findIndex(dc => dc.card.id === card.id)
      if (existingIndex >= 0) {
        // Card already in deck, increase count (max 3)
        const newDeck = [...prevDeck]
        if (newDeck[existingIndex].count < 3) {
          newDeck[existingIndex].count += 1
        }
        return newDeck
      } else {
        // New card, add to deck
        return [...prevDeck, { card, count: 1 }]
      }
    })
  }

  const removeCardFromDeck = (cardId: number) => {
    setDeck(prevDeck => {
      const existingIndex = prevDeck.findIndex(dc => dc.card.id === cardId)
      if (existingIndex >= 0) {
        const newDeck = [...prevDeck]
        if (newDeck[existingIndex].count > 1) {
          newDeck[existingIndex].count -= 1
        } else {
          newDeck.splice(existingIndex, 1)
        }
        return newDeck
      }
      return prevDeck
    })
  }

  const clearDeck = () => {
    if (confirm('Are you sure you want to clear your entire deck?')) {
      setDeck([])
      setCurrentDeckId(null)
      setDeckName('')
    }
  }

  const saveDeck = async () => {
    if (!session) {
      router.push('/login')
      return
    }

    if (!deckName.trim()) {
      alert('Please enter a deck name')
      return
    }

    setSaving(true)
    try {
      const url = currentDeckId ? `/api/decks/${currentDeckId}` : '/api/decks'
      const method = currentDeckId ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: deckName,
          cards: deck,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setCurrentDeckId(data.deck.id)
        setShowSaveDialog(false)
        await loadUserDecks()
        alert('Deck saved successfully!')
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to save deck')
      }
    } catch (error) {
      console.error('Error saving deck:', error)
      alert('Failed to save deck')
    } finally {
      setSaving(false)
    }
  }

  const loadDeck = (savedDeck: SavedDeck) => {
    setDeck(savedDeck.cards)
    setCurrentDeckId(savedDeck.id)
    setDeckName(savedDeck.name)
  }

  const deleteDeck = async (deckId: string) => {
    if (!confirm('Are you sure you want to delete this deck?')) {
      return
    }

    try {
      const response = await fetch(`/api/decks/${deckId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await loadUserDecks()
        if (currentDeckId === deckId) {
          setDeck([])
          setCurrentDeckId(null)
          setDeckName('')
        }
      }
    } catch (error) {
      console.error('Error deleting deck:', error)
      alert('Failed to delete deck')
    }
  }

  const totalCards = deck.reduce((sum, dc) => sum + dc.count, 0)
  const monsters = deck.filter(dc => dc.card.type.includes('Monster')).reduce((sum, dc) => sum + dc.count, 0)
  const spells = deck.filter(dc => dc.card.type === 'Spell Card').reduce((sum, dc) => sum + dc.count, 0)
  const traps = deck.filter(dc => dc.card.type === 'Trap Card').reduce((sum, dc) => sum + dc.count, 0)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Card Search Section */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Search Cards</h2>
            {session && (
              <div className="flex gap-2">
                <button
                  onClick={() => setShowSaveDialog(true)}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors text-sm font-semibold"
                >
                  {currentDeckId ? 'Update Deck' : 'Save Deck'}
                </button>
              </div>
            )}
          </div>
          {!session && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-sm text-yellow-800">
                <Link href="/login" className="text-yellow-900 font-semibold hover:underline">
                  Login
                </Link>{' '}to save your decks to your account
              </p>
            </div>
          )}
          <CardFilters onFilterChange={handleFilterChange} />
          {loading && (
            <div className="mt-4 text-center text-gray-600">
              <p>Searching cards...</p>
            </div>
          )}
        </div>

        {searchResults.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Search Results ({searchResults.length})
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {searchResults.map((card) => {
                const deckCard = deck.find(dc => dc.card.id === card.id)
                const canAdd = !deckCard || deckCard.count < 3
                
                return (
                  <div key={card.id} className="relative">
                    <Card card={card} />
                    <button
                      onClick={() => addCardToDeck(card)}
                      disabled={!canAdd}
                      className={`mt-2 w-full py-2 px-4 rounded-md font-semibold transition-colors ${
                        canAdd
                          ? 'bg-green-600 text-white hover:bg-green-700'
                          : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                      }`}
                    >
                      {canAdd ? `Add to Deck${deckCard ? ` (${deckCard.count}/3)` : ''}` : 'Max 3 copies'}
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {searchResults.length === 0 && !loading && (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <p className="text-gray-600">Use the filters above to search for cards to add to your deck.</p>
          </div>
        )}
      </div>

      {/* Deck Section */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900">My Deck</h2>
            {deck.length > 0 && (
              <button
                onClick={clearDeck}
                className="text-red-600 hover:text-red-800 text-sm font-medium"
              >
                Clear
              </button>
            )}
          </div>

          {/* Saved Decks (if logged in) */}
          {session && savedDecks.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Saved Decks</h3>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {savedDecks.map((savedDeck) => (
                  <div
                    key={savedDeck.id}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded hover:bg-gray-100"
                  >
                    <button
                      onClick={() => loadDeck(savedDeck)}
                      className="flex-1 text-left text-sm font-medium text-gray-900 truncate"
                    >
                      {savedDeck.name}
                    </button>
                    <button
                      onClick={() => deleteDeck(savedDeck.id)}
                      className="text-red-600 hover:text-red-800 text-xs ml-2"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Deck Statistics */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Total Cards</p>
                <p className="text-2xl font-bold text-gray-900">{totalCards}</p>
              </div>
              <div>
                <p className="text-gray-600">Unique Cards</p>
                <p className="text-2xl font-bold text-gray-900">{deck.length}</p>
              </div>
              <div>
                <p className="text-gray-600">Monsters</p>
                <p className="text-xl font-semibold text-gray-900">{monsters}</p>
              </div>
              <div>
                <p className="text-gray-600">Spells</p>
                <p className="text-xl font-semibold text-gray-900">{spells}</p>
              </div>
              <div>
                <p className="text-gray-600">Traps</p>
                <p className="text-xl font-semibold text-gray-900">{traps}</p>
              </div>
            </div>
            {totalCards > 0 && (
              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Deck Status</span>
                  <span className={`text-sm font-semibold ${
                    totalCards === 40 || totalCards === 60 ? 'text-green-600' : 'text-yellow-600'
                  }`}>
                    {totalCards < 40 ? `${40 - totalCards} to minimum` : 
                     totalCards === 40 ? 'Valid (40)' :
                     totalCards < 60 ? `${60 - totalCards} to maximum` :
                     totalCards === 60 ? 'Valid (60)' : 'Over limit'}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Deck List */}
          {deck.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p>Your deck is empty.</p>
              <p className="text-sm mt-2">Search for cards and add them to your deck!</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {deck.map((deckCard) => (
                <div
                  key={deckCard.card.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">{deckCard.card.name}</p>
                    <p className="text-xs text-gray-600">{deckCard.card.type}</p>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <span className="text-sm font-bold text-gray-700">x{deckCard.count}</span>
                    <button
                      onClick={() => removeCardFromDeck(deckCard.card.id)}
                      className="text-red-600 hover:text-red-800 font-bold text-lg"
                      title="Remove one copy"
                    >
                      −
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Save Deck Dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              {currentDeckId ? 'Update Deck' : 'Save Deck'}
            </h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="deckName" className="block text-sm font-medium text-gray-700 mb-2">
                  Deck Name
                </label>
                <input
                  type="text"
                  id="deckName"
                  value={deckName}
                  onChange={(e) => setDeckName(e.target.value)}
                  placeholder="My Awesome Deck"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => {
                    setShowSaveDialog(false)
                    setDeckName('')
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={saveDeck}
                  disabled={saving || !deckName.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}