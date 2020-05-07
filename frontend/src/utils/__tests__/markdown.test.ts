import { getImage, getMarkdownForLink, getPlainText } from '../markdown'
import { ScriptsService } from '../../services/ScriptsService'

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
        .toBe('https://i3.ytimg.com/vi/J2U9Hmmpqhc/hqdefault.jpg')
      expect(getImage('![image](http://example.org/image.jpg) `youtube:J2U9Hmmpqhc`'))
        .toBe('https://i3.ytimg.com/vi/J2U9Hmmpqhc/hqdefault.jpg')
    })

    it('should return an image from a video from youtube', async () => {
      expect(getImage('`youtube:J2U9Hmmpqhc`'))
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

  describe('getMarkdownForLink', () => {
    beforeEach(() => {
      ScriptsService.getLinkData = jest.fn(link => Promise.resolve({
        title: 'title',
        canonical: link,
        image: 'image',
        description: 'description',
      }))
    })

    it('should return the markdown for a youtube video', async () => {
      expect(await getMarkdownForLink('https://www.youtube.com/watch?v=J2U9Hmmpqhc', true))
        .toEqual({ markdown: '`youtube:J2U9Hmmpqhc`', title: 'title', image: 'image' })
      expect(await getMarkdownForLink('http://youtube.com/watch?v=J2U9Hmmpqhc', true))
        .toEqual({ markdown: '`youtube:J2U9Hmmpqhc`', title: 'title', image: 'image' })
      expect(await getMarkdownForLink('https://www.youtube.com/watch?feature=youtu.be&v=J2U9Hmmpqhc&t=4', true))
        .toEqual({ markdown: '`youtube:J2U9Hmmpqhc`', title: 'title', image: 'image' })
      expect(await getMarkdownForLink('https://youtu.be/J2U9Hmmpqhc', true))
        .toEqual({ markdown: '`youtube:J2U9Hmmpqhc`', title: 'title', image: 'image' })
      expect(await getMarkdownForLink('http://www.youtu.be/J2U9Hmmpqhc?t=4', true))
        .toEqual({ markdown: '`youtube:J2U9Hmmpqhc`', title: 'title', image: 'image' })
    })

    it('should return the markdown for a tweet', async () => {
      expect(await getMarkdownForLink('https://twitter.com/elonmusk/status/1026872652290379776', true))
        .toEqual({ markdown: '`twitter:1026872652290379776`', title: 'title', image: 'image' })
      expect(await getMarkdownForLink('http://www.twitter.com/elonmusk/status/1026872652290379776', true))
        .toEqual({ markdown: '`twitter:1026872652290379776`', title: 'title', image: 'image' })
      expect(await getMarkdownForLink('https://twitter.com/elonmusk/status/1026872652290379776?foo=bar', true))
        .toEqual({ markdown: '`twitter:1026872652290379776`', title: 'title', image: 'image' })
    })

    it('should return markdown for a facebook video', async () => {
      expect(await getMarkdownForLink('https://www.facebook.com/facebook/videos/237308277348177', true))
        .toEqual({ markdown: '`facebook:facebook/videos/237308277348177`', title: 'title', image: 'image' })
      expect(await getMarkdownForLink('http://facebook.com/facebook/videos/237308277348177', true))
        .toEqual({ markdown: '`facebook:facebook/videos/237308277348177`', title: 'title', image: 'image' })
      expect(await getMarkdownForLink('https://www.facebook.com/facebook/videos/237308277348177/?t=0', true))
        .toEqual({ markdown: '`facebook:facebook/videos/237308277348177`', title: 'title', image: 'image' })
    })

    it('should return markdown for a yahoo finance video', async () => {
      expect(await getMarkdownForLink('https://finance.yahoo.com/video/tesla-inching-toward-induction-p-211457122.html', true))
        .toEqual({
          markdown: '`yahoofinancevideo:https://finance.yahoo.com/video/tesla-inching-toward-induction-p-211457122.html`' +
            '\n\n> description',
          title: 'title',
          image: 'image'
        })
    })

    it('should return markdown for a google trend link', async () => {
      expect(await getMarkdownForLink('https://trends.google.com/trends/explore?q=FinSharing', true))
        .toEqual({
          markdown: '`googletrends:https://trends.google.com/trends/explore?q=FinSharing`',
          title: '',
          image: 'image'
        })
    })

    it('should return a link card with title', async () => {
      expect(await getMarkdownForLink('http://example.com', true))
        .toEqual({
          markdown: '```card\n' +
            'link=http://example.com\n' +
            'image=image\n' +
            'title=title\n' +
            'description=description\n' +
            '```',
          title: 'title',
          image: 'image'
        })
    })

    it('should return a link card without title', async () => {
      expect(await getMarkdownForLink('http://example.com', false))
        .toEqual({
          markdown: '```card\n' +
            'link=http://example.com\n' +
            'image=image\n' +
            'description=description\n' +
            '```',
          title: 'title',
          image: 'image'
        })
    })
  })
})
