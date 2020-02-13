import { getImage, getPlainText } from '../markdown'

describe('Markdown Utils', () => {
  describe('getImage', () => {
    it('should get an image from a markdown', () => {
      expect(getImage('![image](http://example.org/image.jpg)')).toBe('http://example.org/image.jpg')
      expect(getImage(`
        # Test markdown file containing an image
      
        ![image](http://example.org/image.jpg)
        
        **Test**
      `)).toBe('http://example.org/image.jpg')
    })

    it('should return the only the first image', async () => {
      expect(getImage(`
        ![image](http://example.org/image.jpg)
        ![image](http://example.org/image2.jpg)
        ![image](http://example.org/image3.jpg)
      `)).toBe('http://example.org/image.jpg')
    })

    it('should return the image from a YouTube video', async () => {
      expect(getImage('`youtube:J2U9Hmmpqhc`'))
        .toBe('https://i3.ytimg.com/vi/J2U9Hmmpqhc/maxresdefault.jpg')
      expect(getImage('![image](http://example.org/image.jpg) `youtube:J2U9Hmmpqhc`'))
        .toBe('https://i3.ytimg.com/vi/J2U9Hmmpqhc/maxresdefault.jpg')
    })

    it('should return a small image from a video from youtube', async () => {
      expect(getImage('`youtube:J2U9Hmmpqhc`', 'small'))
        .toBe('https://i3.ytimg.com/vi/J2U9Hmmpqhc/hqdefault.jpg')
    })

    it('should return an image from a card', async () => {
      const card = '```card\n' +
        'title=test\n' +
        'image=http://example.org/image.jpg\n' +
        'link=http://example.org\n' +
        '```'
      expect(getImage(card)).toBe('http://example.org/image.jpg')
    })

    it('should return null if there are no images', async () => {
      expect(getImage(`
        # Test markdown file containing an image
        [link](http://example.org/)
      `)).toBe(null)
    })
  })

  describe('getPlainText', () => {
    it('should return the plain text from a markdown', async () => {
      expect(getPlainText('**Test**')).toBe('Test')
      expect(getPlainText('__Test__')).toBe('Test')
      expect(getPlainText('Test [link](http://example.org)')).toBe('Test')
      expect(getPlainText('Test ![image](http://example.org/image.jpg)')).toBe('Test')
      expect(getPlainText('Test `youtube:J2U9Hmmpqhc`')).toBe('Test')
      expect(getPlainText('<strong>Strong</strong> Test')).toBe('Strong Test')
      expect(getPlainText('> Test')).toBe('Test')
      expect(getPlainText(`
        ### Post,
        
        ![image](http://example.org/image.jpg)
        
        > with a quote.
        
        [link](http://example.org)
        
        \`youtube:J2U9Hmmpqhc\`
      `)).toBe('Post, with a quote.')
    })
  })
})
