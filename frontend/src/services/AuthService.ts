import { User } from '../types/User'
import { NextPageContext } from 'next'
import { parseCookies } from 'nookies'

export const TOKENS_COOKIE_NAME = 'fs-tokens'
export const USER_COOKIE_NAME = 'fs-user'

export class AuthService {
  readonly endpoint: string

  constructor (readonly ctx?: NextPageContext) {
    this.endpoint = process.browser ? '' : process.env.ENDPOINT!
  }

  getCookies () {
    return parseCookies(this.ctx || null)
  }

  isLoggedIn () {
    return !!this.getCookies()[USER_COOKIE_NAME]
  }

  getViewer (): User | null {
    const userJson = this.getCookies()[USER_COOKIE_NAME]
    if (userJson) {
      return JSON.parse(userJson)
    }
    return null
  }
}
