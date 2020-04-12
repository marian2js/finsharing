import { Market } from '../types/Market'

export const getMarketPriceChange = (market: Market) => ((market.price - market.priceClose) * 100) / market.priceClose
