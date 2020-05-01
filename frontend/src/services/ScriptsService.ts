import fetch from 'isomorphic-unfetch'
import { LinkData } from '../types/Scripts'

export const ScriptsService = {
  async getLinkData (link: string): Promise<LinkData | null> {
    const requestUrl = `/scripts/link-data?link=${encodeURIComponent(link)}`
    const res = await fetch(requestUrl, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    })
    try {
      if (res.ok) {
        return await res.json()
      }
    } catch {}
    return null
  }
}
