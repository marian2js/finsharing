import { ScriptsService } from '../services/ScriptsService'

export function getImage (markdown: string): string | null {
  const youtubeMatch = markdown.match(/`youtube:([^`]+)`/)
  if (youtubeMatch && youtubeMatch.length === 2) {
    return `https://i3.ytimg.com/vi/${youtubeMatch[1]}/hqdefault.jpg`
  }

  const imgMatch = markdown.match(/!\[[^\]]*]\(([^)]+)\)/)
  if (imgMatch && imgMatch.length === 2) {
    return imgMatch[1]
  }

  const cardMatch = markdown.match(/```card([^`]+)```/)
  if (cardMatch && cardMatch.length === 2) {
    const image = cardMatch[1].split('\n')
      .find(line => line.toLowerCase().startsWith('image='))
    if (image) {
      return image.split('=').slice(1).join('=') || null
    }
  }
  return null
}

export function getPlainText (markdown: string): string {
  return markdown
    .replace(/\[[^\]]+]/g, '') // remove [...]
    .replace(/\([^)]+\)/g, '') // remove (...)
    .replace(/<[^>]+>/g, '') // remove <...>
    .replace(/`[^`]+`/g, '') // remove `...`
    .replace(/[^a-zA-Z0-9:.,\- ]/g, '') // remove special characters
    .replace(/\s+/g, ' ') // remove extra spacing
    .trim()
}

export async function getMarkdownForLink (link: string, includeCardTitle: boolean):
  Promise<{ markdown: string, title?: string, image?: string } | null> {
  const extension = link.split('.').pop()
  if (extension && ['jpg', 'jpeg', 'gif', 'png', 'svg', 'webp'].includes(extension)) {
    return {
      markdown: `![Image Description](${link})`,
      image: link,
    }
  }

  const linkData = await ScriptsService.getLinkData(link)
  if (!linkData) {
    return null
  }
  const canonicalUrl = linkData.canonical || link
  const url = new URL(canonicalUrl)
  const host = url.host.replace(/^www\./, '')
  let title = linkData.title || ''

  let markdown = ''
  switch (host) {
    case 'youtube.com':
    case 'youtu.be':
      const youtubeId = host === 'youtube.com' ? url.searchParams.get('v') : url.pathname.split('/')[1]
      if (youtubeId) {
        markdown = `\`youtube:${youtubeId}\``
        const titleParts = title.split('-')
        if (titleParts.length > 1) {
          title = titleParts.slice(0, -1).join('-').trim()
        }
      }
      break
    case 'twitter.com':
      const twitterId = url.pathname.split('/').pop()
      if (twitterId && /^\d+$/.test(twitterId)) {
        markdown = `\`twitter:${twitterId}\``
      }
      break
    case 'facebook.com':
      const facebookPaths = url.pathname.split('/').filter(p => !!p)
      if (facebookPaths.includes('videos')) {
        markdown = `\`facebook:${facebookPaths.join('/')}\``
        const titleParts = title.split('|')
        if (titleParts.length > 1) {
          title = titleParts.slice(0, -1).join('|').trim()
        }
      }
      break
    case 'finance.yahoo.com':
      const yahooVideoId = url.origin + url.pathname
      if (yahooVideoId && url.pathname.startsWith('/video')) {
        markdown = `\`yahoofinancevideo:${yahooVideoId}\``
        if (linkData.description) {
          markdown += `\n\n> ${linkData.description}`
        }
      }
      break
    case 'trends.google.com':
      markdown = `\`googletrends:${link}\``
      title = ''
      break
  }
  if (!markdown) {
    let markdownCard = `link=${canonicalUrl}`
    if (linkData.image) {
      markdownCard += `\nimage=${linkData.image}`
    }
    if (linkData.title && includeCardTitle) {
      markdownCard += `\ntitle=${linkData.title}`
    }
    if (linkData.description) {
      markdownCard += `\ndescription=${linkData.description}`
    }
    markdown = '```card\n' + markdownCard + '\n```'
  }
  return {
    markdown,
    title,
    image: linkData.image,
  }
}
