export type Market = {
  id: string
  symbol: string
  name: string
  fullName: string
  description: string
  imageUrl: string
  exchange: 'NASDAQ' | 'NYSE'
  price: number
  priceClose: number
  priceUpdatedAt: number
}
