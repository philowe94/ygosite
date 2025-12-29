import { NextResponse } from 'next/server'
import { getCardById } from '@/lib/cards'

export const runtime = 'nodejs' // Ensure Node.js runtime for file system access

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const card = getCardById(id)

    if (!card) {
      return NextResponse.json(
        { error: 'Card not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(card)
  } catch (error) {
    console.error('Error fetching card:', error)
    return NextResponse.json(
      { error: 'Failed to fetch card data', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
