export function parseUrl (url: string): string | null {
  if (!url?.startsWith('http')) {
    return null
  }
  try {
    const parsedUrl = new URL(url)
    return parsedUrl.href
  } catch {
    return null
  }
}
