import { Suspense } from 'react'
import Header from '@/components/Header'
import CardsContent from '@/components/CardsContent'

function CardsLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div>Loading...</div>
    </div>
  )
}

export default function CardsPage() {
  return (
    <main className="flex-1 md:ml-64">
      <Header />
      <Suspense fallback={<CardsLoading />}>
        <CardsContent />
      </Suspense>
    </main>
  )
}
