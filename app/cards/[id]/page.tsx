import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CardImage from '@/components/CardImage'
import { YuGiOhCard } from '@/types/card'
import { getCardImageUrl } from '@/lib/image-utils'

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
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const card = await getCard(id)

  if (!card) {
    return (
      <main className="flex-1">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Card Not Found</h1>
            <p className="text-gray-600 mb-8">The card you're looking for doesn't exist.</p>
            <Link
              href="/cards"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-block"
            >
              Browse All Cards
            </Link>
          </div>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  const externalUrl = card.card_images[0]?.image_url || card.card_images[0]?.image_url_small || ''
  const imageUrl = externalUrl ? getCardImageUrl(card.id, externalUrl) : ''

  return (
    <main className="flex-1">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-6xl mx-auto">
        <Link
          href="/cards"
          className="text-blue-600 hover:text-blue-800 mb-6 inline-block"
        >
          ← Back to Cards
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Card Image */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            {imageUrl ? (
              <div className="relative w-full aspect-[2/3] bg-gray-100 rounded-lg overflow-hidden">
                <CardImage
                  src={imageUrl}
                  fallbackSrc={externalUrl}
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

          {/* Card Details */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">{card.name}</h1>

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
      <Footer />
    </main>
  )
}
