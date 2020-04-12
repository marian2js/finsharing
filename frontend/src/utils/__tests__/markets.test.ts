import { getMarketPriceChange } from '../markets'
import { Market } from '../../types/Market'

describe('Market Utils', () => {
  describe('getMarketPriceChange', () => {
    it('should return daily price change', async () => {
      expect(getMarketPriceChange({ price: 200, priceClose: 100 } as Market)).toBe(100)
      expect(getMarketPriceChange({ price: 120, priceClose: 100 } as Market)).toBe(20)
      expect(getMarketPriceChange({ price: 100, priceClose: 100 } as Market)).toBe(0)
      expect(getMarketPriceChange({ price: 80, priceClose: 100 } as Market)).toBe(-20)
      expect(getMarketPriceChange({ price: 50, priceClose: 100 } as Market)).toBe(-50)
      expect(getMarketPriceChange({ price: 0, priceClose: 100 } as Market)).toBe(-100)
    })
  })
})
