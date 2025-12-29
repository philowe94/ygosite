import { Suspense } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CardsContent from '@/components/CardsContent'

function CardsLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Yu-Gi-Oh! Card Database</h1>
        <p className="text-xl text-gray-600">
          Browse and search through thousands of Yu-Gi-Oh! cards
        </p>
      </div>
      <div className="animate-pulse">
        <div className="bg-gray-200 h-32 rounded-lg mb-8"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-gray-200 h-96 rounded-lg"></div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function CardsPage() {
  return (
    <main className="flex-1">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Yu-Gi-Oh! Card Database</h1>
          <p className="text-xl text-gray-600">
            Browse and search through thousands of Yu-Gi-Oh! cards
          </p>
        </div>

        <Suspense fallback={<CardsLoading />}>
          <CardsContent />
        </Suspense>
      </div>
      <Footer />
    </main>
  )
}
