export function getImage (markdown: string, size: 'small' | 'large' = 'large'): string | null {
  const youtubeMatch = markdown.match(/`youtube:([^`]+)`/)
  if (youtubeMatch && youtubeMatch.length === 2) {
    return size === 'large' ?
      `https://i3.ytimg.com/vi/${youtubeMatch[1]}/maxresdefault.jpg` :
      `https://i3.ytimg.com/vi/${youtubeMatch[1]}/hqdefault.jpg`
  }
  const imgMatch = markdown.match(/!\[[^\]]*]\(([^)]+)\)/)
  if (imgMatch && imgMatch.length === 2) {
    return imgMatch[1]
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
