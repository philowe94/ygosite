import fs from 'fs'
import path from 'path'
import { YuGiOhCard } from '@/types/card'

const DATA_DIR = path.join(process.cwd(), 'data')
const CARDS_FILE = path.join(DATA_DIR, 'cards.json')

let cardsCache: YuGiOhCard[] | null = null
let lastLoadTime: number = 0
const CACHE_DURATION = 3600000 // 1 hour in milliseconds

function loadCards(): YuGiOhCard[] {
  try {
    const now = Date.now()
    
    // Return cached data if it's still fresh
    if (cardsCache && (now - lastLoadTime) < CACHE_DURATION) {
      return cardsCache
    }

    // Check if file exists
    if (!fs.existsSync(CARDS_FILE)) {
      console.warn(`Cards file not found at ${CARDS_FILE}. Run 'npm run fetch-cards' to download card data.`)
      return []
    }

    const fileContent = fs.readFileSync(CARDS_FILE, 'utf-8')
    const data = JSON.parse(fileContent)
    
    if (data.data && Array.isArray(data.data)) {
      cardsCache = data.data
      lastLoadTime = now
      return data.data
    }
    
    console.error('Invalid card data format')
    return []
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    const errorStack = error instanceof Error ? error.stack : undefined
    console.error('Error loading cards from file:', errorMessage)
    if (errorStack) {
      console.error('Stack:', errorStack)
    }
    return []
  }
}

export function getAllCards(): YuGiOhCard[] {
  return loadCards()
}

export function getCardById(id: string): YuGiOhCard | null {
  const cards = loadCards()
  return cards.find(card => card.id.toString() === id) || null
}

export function searchCards(filters: {
  name?: string
  type?: string
  race?: string
  attribute?: string
  limit?: number
}): YuGiOhCard[] {
  const cards = loadCards()
  let results = [...cards]

  // Filter by name (case-insensitive partial match)
  if (filters.name) {
    const nameLower = filters.name.toLowerCase()
    results = results.filter(card => 
      card.name.toLowerCase().includes(nameLower)
    )
  }

  // Filter by type
  if (filters.type) {
    results = results.filter(card => card.type === filters.type)
  }

  // Filter by race
  if (filters.race) {
    results = results.filter(card => card.race === filters.race)
  }

  // Filter by attribute
  if (filters.attribute) {
    results = results.filter(card => card.attribute === filters.attribute)
  }

  // Apply limit
  if (filters.limit) {
    results = results.slice(0, filters.limit)
  }

  return results
}
