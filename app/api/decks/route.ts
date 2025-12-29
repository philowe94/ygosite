import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'

// Get all decks for the current user
export async function GET(request: Request) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const decks = await prisma.deck.findMany({
      where: { userId: session.user.id },
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        name: true,
        description: true,
        cards: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    // Parse JSON strings back to objects
    const decksWithParsedCards = decks.map((deck: any) => ({
      ...deck,
      cards: JSON.parse(deck.cards),
    }))

    return NextResponse.json({ decks: decksWithParsedCards })
  } catch (error) {
    console.error('Error fetching decks:', error)
    return NextResponse.json(
      { error: 'Failed to fetch decks' },
      { status: 500 }
    )
  }
}

// Create a new deck
export async function POST(request: Request) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { name, description, cards } = body

    if (!name || !cards) {
      return NextResponse.json(
        { error: 'Name and cards are required' },
        { status: 400 }
      )
    }

    const deck = await prisma.deck.create({
      data: {
        name,
        description: description || null,
        cards: JSON.stringify(cards),
        userId: session.user.id,
      },
      select: {
        id: true,
        name: true,
        description: true,
        cards: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return NextResponse.json({
      deck: {
        ...deck,
        cards: JSON.parse(deck.cards),
      },
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating deck:', error)
    return NextResponse.json(
      { error: 'Failed to create deck' },
      { status: 500 }
    )
  }
}
