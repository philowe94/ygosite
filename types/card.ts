// Yu-Gi-Oh Card Type Definitions based on YGOPRODeck API

export interface CardImage {
  id: number
  image_url: string
  image_url_small: string
  image_url_cropped: string
}

export interface CardPrice {
  cardmarket_price: string
  tcgplayer_price: string
  ebay_price: string
  amazon_price: string
  coolstuffinc_price: string
}

export interface CardSet {
  set_name: string
  set_code: string
  set_rarity: string
  set_rarity_code: string
  set_price: string
}

export interface MiscInfo {
  konami_id?: number
  [key: string]: unknown
}

export interface YuGiOhCard {
  id: number
  name: string
  type: string
  desc: string
  atk?: number
  def?: number
  level?: number
  race?: string
  attribute?: string
  archetype?: string
  scale?: number
  linkval?: number
  linkmarkers?: string[]
  card_sets?: CardSet[]
  card_images: CardImage[]
  card_prices?: CardPrice[]
  misc_info?: MiscInfo[]
  ygoprodeck_url?: string
  banlist_info?: {
    ban_tcg?: string
    ban_ocg?: string
    ban_goat?: string
  }
}

export interface CardApiResponse {
  data: YuGiOhCard[]
}
