import { NextPageContext } from 'next'
import fetch from 'isomorphic-unfetch'
import { destroyCookie, parseCookies, setCookie } from 'nookies'
import { HttpResponseError } from '../errors/HttpResponseError'

interface CookieSerializeOptions {
  encode?: (val: string) => string;
  decode?: (val: string) => string;
}

export const TOKENS_COOKIE_NAME = 'fs-tokens'
export const USER_COOKIE_NAME = 'fs-user'

export abstract class ApiService {
  readonly endpoint: string

  constructor (readonly ctx?: NextPageContext) {
    this.endpoint = process.browser ? '' : process.env.ENDPOINT!
  }

  getCookies () {
    return parseCookies(this.ctx || null)
  }

  setCookie (name: string, value: string, options: CookieSerializeOptions = {}) {
    setCookie(this.ctx || null, name, value, options)
  }

  destroyCookie (name: string) {
    destroyCookie(this.ctx || null, name)
    if (!this.ctx) {
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`
    }
  }

  async request (method: 'GET' | 'POST' | 'PUT' | 'DELETE', path: string, data?: any) {
    console.log(`[${method.toUpperCase()}] /api/v1${path}`)

    const headers: { [key: string]: string } = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }

    const tokensJson = this.getCookies()[TOKENS_COOKIE_NAME]
    if (tokensJson) {
      const tokens = JSON.parse(tokensJson)
      headers.Authorization = `Bearer ${tokens.accessToken}`
    }

    const res = await fetch(this.endpoint + '/api/v1' + path, {
      method,
      headers,
      body: JSON.stringify(data)
    })

    if (!res.ok) {
      // Client Error
      if (res.status >= 400 && res.status < 500) {
        const data = await res.json()
        throw new HttpResponseError(data.error.message, res.status)
      }
      throw new HttpResponseError('Something went wrong, please try again later', res.status)
    }

    return await res.json()
  }
}
