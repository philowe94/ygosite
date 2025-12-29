import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'

// Get a specific deck
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    const { id } = await params

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const deck = await prisma.deck.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    })

    if (!deck) {
      return NextResponse.json(
        { error: 'Deck not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      deck: {
        ...deck,
        cards: JSON.parse(deck.cards),
      },
    })
  } catch (error) {
    console.error('Error fetching deck:', error)
    return NextResponse.json(
      { error: 'Failed to fetch deck' },
      { status: 500 }
    )
  }
}

// Update a deck
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    const { id } = await params

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { name, description, cards } = body

    // Verify deck belongs to user
    const existingDeck = await prisma.deck.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    })

    if (!existingDeck) {
      return NextResponse.json(
        { error: 'Deck not found' },
        { status: 404 }
      )
    }

    const deck = await prisma.deck.update({
      where: { id },
      data: {
        name: name || existingDeck.name,
        description: description !== undefined ? description : existingDeck.description,
        cards: cards ? JSON.stringify(cards) : existingDeck.cards,
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
    })
  } catch (error) {
    console.error('Error updating deck:', error)
    return NextResponse.json(
      { error: 'Failed to update deck' },
      { status: 500 }
    )
  }
}

// Delete a deck
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    const { id } = await params

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Verify deck belongs to user
    const existingDeck = await prisma.deck.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    })

    if (!existingDeck) {
      return NextResponse.json(
        { error: 'Deck not found' },
        { status: 404 }
      )
    }

    await prisma.deck.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Deck deleted successfully' })
  } catch (error) {
    console.error('Error deleting deck:', error)
    return NextResponse.json(
      { error: 'Failed to delete deck' },
      { status: 500 }
    )
  }
}
