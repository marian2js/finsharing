import { parseUrl } from '../string'

describe('String Utils', () => {
  describe('parseUrl', () => {
    it('should return the given url if valid', async () => {
      expect(parseUrl('https://example.org')).toBe('https://example.org/')
      expect(parseUrl('http://example.org')).toBe('http://example.org/')
      expect(parseUrl('http://example.org/test')).toBe('http://example.org/test')
      expect(parseUrl('http://example.org/test?foo=bar')).toBe('http://example.org/test?foo=bar')
      expect(parseUrl('http://example.org/test?foo=bar&bar=foo')).toBe('http://example.org/test?foo=bar&bar=foo')
      expect(parseUrl('http://example.org/test?foo=bar&bar=foo#hash')).toBe('http://example.org/test?foo=bar&bar=foo#hash')
    })

    it('should return null if the url is not valid', async () => {
      expect(parseUrl('')).toBe(null)
      expect(parseUrl('javascript:void(0)')).toBe(null)
      expect(parseUrl('example.org')).toBe(null)
    })

    it('should safely scape special characters ', async () => {
      expect(parseUrl('https://example.org?query="/><script>alert(1)</script>'))
        .toBe('https://example.org/?query=%22/%3E%3Cscript%3Ealert(1)%3C/script%3E')
    })
  })
})
