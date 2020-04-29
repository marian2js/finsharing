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
