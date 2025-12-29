/**
 * Get the image URL for a card, preferring local cached images
 * This works on both client and server side
 */
export function getCardImageUrl(cardId: number, externalUrl: string): string {
  // Always try local first - if it doesn't exist, Next.js will handle the 404
  // and we can fall back to external URL
  return `/images/cards/${cardId}.jpg`
}

/**
 * Get the cropped image URL for a card, preferring local cached images
 * This works on both client and server side
 */
export function getCardCroppedImageUrl(cardId: number, externalCroppedUrl: string): string {
  // Always try local first - if it doesn't exist, Next.js will handle the 404
  // and we can fall back to external URL
  return `/images/cards/cropped/${cardId}.jpg`
}

/**
 * Get fallback image URL (external) if local image fails to load
 */
export function getCardImageFallback(externalUrl: string): string {
  return externalUrl
}
