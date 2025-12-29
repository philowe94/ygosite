import { NextResponse } from 'next/server'
import { CardApiResponse } from '@/types/card'
import { searchCards } from '@/lib/cards'

export const runtime = 'nodejs' // Ensure Node.js runtime for file system access

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const name = searchParams.get('name') || undefined
    const type = searchParams.get('type') || undefined
    const race = searchParams.get('race') || undefined
    const attribute = searchParams.get('attribute') || undefined
    const limit = parseInt(searchParams.get('limit') || '100', 10)

    // Search local card data
    const results = searchCards({
      name,
      type,
      race,
      attribute,
      limit,
    })

    const data: CardApiResponse = {
      data: results,
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching cards:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    const errorStack = error instanceof Error ? error.stack : undefined
    console.error('Error stack:', errorStack)
    return NextResponse.json(
      { error: 'Failed to fetch card data', details: errorMessage },
      { status: 500 }
    )
  }
}
