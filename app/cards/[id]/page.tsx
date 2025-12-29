import Link from 'next/link'
import Header from '@/components/Header'
import CardImageToggle from '@/components/CardImageToggle'
import { YuGiOhCard } from '@/types/card'

async function getCard(id: string): Promise<YuGiOhCard | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const response = await fetch(`${baseUrl}/api/cards/${id}`, {
      cache: 'no-store',
    })

    if (!response.ok) {
      return null
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching card:', error)
    return null
  }
}

export default async function CardDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ name?: string }>
}) {
  const { id } = await params
  const { name } = await searchParams
  const card = await getCard(id)
  
  // Preserve search params in back link
  const backUrl = name ? `/cards?name=${encodeURIComponent(name)}` : '/cards'

  if (!card) {
    return (
      <main className="flex-1 md:ml-64">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Card Not Found</h1>
            <p className="text-gray-600 mb-8">The card you're looking for doesn't exist.</p>
            <Link
              href={backUrl}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-block"
            >
              Browse All Cards
            </Link>
          </div>
          </div>
        </div>
      </main>
    )
  }


  // External links
  const cardNameEncoded = encodeURIComponent(card.name)
  const konamiId = card.misc_info?.[0]?.konami_id || card.id
  const yugipediaUrl = `https://yugipedia.com/wiki/${cardNameEncoded.replace(/%20/g, '_')}`
  const ygoResourcesUrl = `https://db.ygoresources.com/card#${konamiId}`
  const ygoprodeckUrl = card.ygoprodeck_url || `https://ygoprodeck.com/card/${card.id}`
  const tcgplayerUrl = `https://www.tcgplayer.com/search/yugioh/product?q=${cardNameEncoded}`

  return (
    <main className="flex-1 md:ml-64 h-screen overflow-hidden flex flex-col">
      <Header />
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex-shrink-0">
          <Link
            href={backUrl}
            className="text-blue-600 hover:text-blue-800 inline-block"
          >
            ← Back to Cards
          </Link>
        </div>
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Card Image with Toggle */}
          <CardImageToggle card={card} />

          {/* Card Details */}
          <div className="bg-white rounded-lg shadow-lg p-8 overflow-y-auto max-h-full">
            <div className="flex items-start justify-between mb-4">
              <h1 className="text-4xl font-bold text-gray-900">{card.name}</h1>
            </div>

            {/* External Links */}
            <div className="mb-6 pb-4 border-b">
              <h2 className="text-sm font-semibold text-gray-700 mb-2">External Links</h2>
              <div className="flex flex-wrap gap-2">
                <a
                  href={yugipediaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded text-sm hover:bg-blue-100 transition-colors"
                >
                  Yugipedia
                </a>
                <a
                  href={ygoResourcesUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-purple-50 text-purple-700 rounded text-sm hover:bg-purple-100 transition-colors"
                >
                  YGOResources
                </a>
                <a
                  href={ygoprodeckUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-green-50 text-green-700 rounded text-sm hover:bg-green-100 transition-colors"
                >
                  YGOPRODeck
                </a>
                <a
                  href={tcgplayerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-orange-50 text-orange-700 rounded text-sm hover:bg-orange-100 transition-colors"
                >
                  TCGPlayer
                </a>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  {card.type}
                </span>
                {card.attribute && (
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                    {card.attribute}
                  </span>
                )}
                {card.race && (
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    {card.race}
                  </span>
                )}
                {card.archetype && (
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                    {card.archetype}
                  </span>
                )}
              </div>

              {(card.atk !== undefined || card.def !== undefined || card.level !== undefined) && (
                <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                  {card.level !== undefined && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Level</p>
                      <p className="text-2xl font-bold text-gray-900">{card.level}</p>
                    </div>
                  )}
                  {card.atk !== undefined && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">ATK</p>
                      <p className="text-2xl font-bold text-gray-900">{card.atk}</p>
                    </div>
                  )}
                  {card.def !== undefined && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">DEF</p>
                      <p className="text-2xl font-bold text-gray-900">{card.def}</p>
                    </div>
                  )}
                </div>
              )}

              {card.scale && (
                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-600 mb-1">Pendulum Scale</p>
                  <p className="text-xl font-bold text-gray-900">{card.scale}</p>
                </div>
              )}

              {card.linkval && (
                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-600 mb-1">Link Rating</p>
                  <p className="text-xl font-bold text-gray-900">{card.linkval}</p>
                  {card.linkmarkers && card.linkmarkers.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-600 mb-1">Link Markers</p>
                      <div className="flex flex-wrap gap-2">
                        {card.linkmarkers.map((marker, idx) => (
                          <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs">
                            {marker}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="pt-6 border-t">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Description</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{card.desc}</p>
            </div>

            {card.card_sets && card.card_sets.length > 0 && (
              <div className="pt-6 border-t mt-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Card Sets</h2>
                <div className="space-y-2">
                  {card.card_sets.map((set, idx) => (
                    <div key={idx} className="flex justify-between items-center py-2 border-b">
                      <div>
                        <p className="font-medium text-gray-900">{set.set_name}</p>
                        <p className="text-sm text-gray-600">{set.set_code}</p>
                      </div>
                      <div className="text-right">
                        <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-sm">
                          {set.set_rarity}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
