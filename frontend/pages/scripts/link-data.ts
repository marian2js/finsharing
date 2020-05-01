import { NextPageContext } from 'next'
import fetch from 'isomorphic-unfetch'
import * as cheerio from 'cheerio'
import { LinkData } from '../../src/types/Scripts'

const LinkDataApi = () => ''

LinkDataApi.getInitialProps = async ({ query, res }: NextPageContext): Promise<null> => {
  if (!res) {
    return null
  }
  res.setHeader('Content-Type', 'application/json')
  const link = Array.isArray(query.link) ? query.link[0] : query.link
  if (!link) {
    res.end()
    return null
  }
  try {
    const linkRes = await fetch(decodeURIComponent(link))
    const html = await linkRes?.text()
    const $ = cheerio.load(html)
    const title = $('title')?.text()?.trim()
    const image = $('meta[property="og:image"]')?.attr('content')?.trim()
    const canonical = $('link[rel="canonical"]')?.attr('href')?.trim()
    const description = $('meta[name="description"]')?.attr('content')?.trim()

    const data: LinkData = {
      title,
      image,
      canonical,
      description,
    }
    res.write(JSON.stringify(data))
  } catch {}
  res.end()
  return null
}

export default LinkDataApi
