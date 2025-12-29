import { YuGiOhCard } from '@/types/card'

/**
 * Get background color/texture class based on card type
 */
export function getCardTypeBackground(card: YuGiOhCard): string {
  const type = card.type.toLowerCase()
  
  // Monster cards
  if (type.includes('normal monster')) {
    return 'bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-300'
  }
  if (type.includes('effect monster')) {
    return 'bg-gradient-to-r from-orange-50 to-orange-100 border-orange-300'
  }
  if (type.includes('xyz monster')) {
    return 'bg-gradient-to-r from-black to-gray-800 text-white border-gray-700'
  }
  if (type.includes('synchro monster')) {
    return 'bg-gradient-to-r from-white to-gray-100 border-gray-400'
  }
  if (type.includes('fusion monster')) {
    return 'bg-gradient-to-r from-purple-50 to-purple-100 border-purple-300'
  }
  if (type.includes('link monster')) {
    return 'bg-gradient-to-r from-blue-50 to-blue-100 border-blue-300'
  }
  if (type.includes('pendulum monster')) {
    return 'bg-gradient-to-r from-green-50 to-green-100 border-green-300'
  }
  if (type.includes('ritual monster')) {
    return 'bg-gradient-to-r from-indigo-50 to-indigo-100 border-indigo-300'
  }
  
  // Spell cards
  if (type.includes('spell card')) {
    if (type.includes('quick-play')) {
      return 'bg-gradient-to-r from-green-50 to-green-100 border-green-400'
    }
    if (type.includes('continuous')) {
      return 'bg-gradient-to-r from-pink-50 to-pink-100 border-pink-400'
    }
    if (type.includes('field')) {
      return 'bg-gradient-to-r from-emerald-50 to-emerald-100 border-emerald-400'
    }
    if (type.includes('ritual')) {
      return 'bg-gradient-to-r from-blue-50 to-blue-100 border-blue-400'
    }
    return 'bg-gradient-to-r from-green-50 to-green-100 border-green-300'
  }
  
  // Trap cards
  if (type.includes('trap card')) {
    if (type.includes('continuous')) {
      return 'bg-gradient-to-r from-red-50 to-red-100 border-red-400'
    }
    if (type.includes('counter')) {
      return 'bg-gradient-to-r from-rose-50 to-rose-100 border-rose-400'
    }
    return 'bg-gradient-to-r from-red-50 to-red-100 border-red-300'
  }
  
  // Default
  return 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-300'
}

/**
 * Get attribute symbol/emoji
 */
export function getAttributeSymbol(attribute?: string): string {
  if (!attribute) return ''
  
  const attr = attribute.toLowerCase()
  switch (attr) {
    case 'light':
      return '⚡'
    case 'dark':
      return '🌑'
    case 'fire':
      return '🔥'
    case 'water':
      return '💧'
    case 'earth':
      return '🌍'
    case 'wind':
      return '💨'
    case 'divine':
      return '✨'
    default:
      return ''
  }
}

/**
 * Get race/type symbol/emoji
 */
export function getRaceSymbol(race?: string): string {
  if (!race) return ''
  
  const raceLower = race.toLowerCase()
  // Common races
  if (raceLower.includes('warrior')) return '⚔️'
  if (raceLower.includes('dragon')) return '🐉'
  if (raceLower.includes('spellcaster')) return '🔮'
  if (raceLower.includes('fiend')) return '😈'
  if (raceLower.includes('fairy')) return '🧚'
  if (raceLower.includes('zombie')) return '🧟'
  if (raceLower.includes('machine')) return '⚙️'
  if (raceLower.includes('aqua')) return '🌊'
  if (raceLower.includes('pyro')) return '🔥'
  if (raceLower.includes('rock')) return '🪨'
  if (raceLower.includes('winged-beast')) return '🦅'
  if (raceLower.includes('plant')) return '🌿'
  if (raceLower.includes('insect')) return '🐛'
  if (raceLower.includes('beast')) return '🐺'
  if (raceLower.includes('beast-warrior')) return '🦁'
  if (raceLower.includes('dinosaur')) return '🦕'
  if (raceLower.includes('fish')) return '🐟'
  if (raceLower.includes('sea serpent')) return '🐍'
  if (raceLower.includes('reptile')) return '🦎'
  if (raceLower.includes('psychic')) return '🧠'
  if (raceLower.includes('divine-beast')) return '👼'
  
  return ''
}

/**
 * Get card type badge text
 */
export function getCardTypeBadge(card: YuGiOhCard): string {
  const type = card.type.toLowerCase()
  
  if (type.includes('quick-play')) return 'Quick-Play'
  if (type.includes('continuous')) return 'Continuous'
  if (type.includes('field')) return 'Field'
  if (type.includes('ritual')) return 'Ritual'
  if (type.includes('counter')) return 'Counter'
  if (type.includes('xyz')) return 'XYZ'
  if (type.includes('synchro')) return 'Synchro'
  if (type.includes('fusion')) return 'Fusion'
  if (type.includes('link')) return 'Link'
  if (type.includes('pendulum')) return 'Pendulum'
  if (type.includes('normal monster')) return 'Normal'
  if (type.includes('effect monster')) return 'Effect'
  
  return card.type
}

