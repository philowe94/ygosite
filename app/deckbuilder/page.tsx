import Header from '@/components/Header'
import DeckBuilder from '@/components/DeckBuilder'

export default function DeckBuilderPage() {
  return (
    <main className="flex-1 md:ml-64">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Deck Builder</h1>
          <p className="text-xl text-gray-600">
            Build your perfect Yu-Gi-Oh! deck by searching and adding cards
          </p>
        </div>

        <DeckBuilder />
      </div>
    </main>
  )
}
