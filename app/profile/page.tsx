'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Header from '@/components/Header'
import Link from 'next/link'

interface SavedDeck {
  id: string
  name: string
  description?: string
  cards: any[]
  createdAt: string
  updatedAt: string
}

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [decks, setDecks] = useState<SavedDeck[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
      return
    }

    if (session) {
      loadDecks()
    }
  }, [session, status, router])

  const loadDecks = async () => {
    try {
      const response = await fetch('/api/decks')
      if (response.ok) {
        const data = await response.json()
        setDecks(data.decks || [])
      }
    } catch (error) {
      console.error('Error loading decks:', error)
    } finally {
      setLoading(false)
    }
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
        await loadDecks()
      }
    } catch (error) {
      console.error('Error deleting deck:', error)
      alert('Failed to delete deck')
    }
  }

  if (status === 'loading' || loading) {
    return (
      <main className="flex-1 md:ml-64">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <p className="text-gray-600">Loading...</p>
        </div>
      </div>
      </main>
    )
  }

  if (!session) {
    return null
  }

  const totalCards = decks.reduce((sum, deck) => {
    return sum + (Array.isArray(deck.cards) ? deck.cards.reduce((cardSum: number, dc: any) => cardSum + (dc.count || 0), 0) : 0)
  }, 0)

  return (
    <main className="flex-1 md:ml-64">
      <Header />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Profile</h1>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Account Information</h2>
            <div className="space-y-2">
              <p><span className="font-medium text-gray-700">Email:</span> {session.user?.email}</p>
              {session.user?.name && (
                <p><span className="font-medium text-gray-700">Name:</span> {session.user.name}</p>
              )}
            </div>
          </div>

          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-gray-900">My Decks</h2>
              <Link
                href="/deckbuilder"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm font-semibold"
              >
                Create New Deck
              </Link>
            </div>

            {decks.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-gray-600 mb-4">You don't have any saved decks yet.</p>
                <Link
                  href="/deckbuilder"
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Create your first deck →
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">
                    Total Decks: <span className="font-semibold text-gray-900">{decks.length}</span>
                  </p>
                  <p className="text-sm text-gray-600">
                    Total Cards Across All Decks: <span className="font-semibold text-gray-900">{totalCards}</span>
                  </p>
                </div>

                {decks.map((deck) => {
                  const cardCount = Array.isArray(deck.cards) 
                    ? deck.cards.reduce((sum: number, dc: any) => sum + (dc.count || 0), 0)
                    : 0

                  return (
                    <div
                      key={deck.id}
                      className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-1">{deck.name}</h3>
                          {deck.description && (
                            <p className="text-gray-600 text-sm">{deck.description}</p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Link
                            href={`/deckbuilder?load=${deck.id}`}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm font-semibold"
                          >
                            Load
                          </Link>
                          <button
                            onClick={() => deleteDeck(deck.id)}
                            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors text-sm font-semibold"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      <div className="flex gap-4 text-sm text-gray-600">
                        <span>Cards: <strong className="text-gray-900">{cardCount}</strong></span>
                        <span>Unique: <strong className="text-gray-900">{Array.isArray(deck.cards) ? deck.cards.length : 0}</strong></span>
                        <span>Updated: <strong className="text-gray-900">{new Date(deck.updatedAt).toLocaleDateString()}</strong></span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
