import { ApiService, TOKENS_COOKIE_NAME, USER_COOKIE_NAME } from './ApiService'
import { User } from '../types/User'
import { refreshApolloClient } from '../apollo'

export class UserService extends ApiService {
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

  async completeSocialAuth (provider: string, data: { code: string, username?: string }) {
    const res = await this.request('POST', `/auth/${provider}/token`, data)
    this.setCookie(TOKENS_COOKIE_NAME, JSON.stringify(res.tokens))
    this.setCookie(USER_COOKIE_NAME, JSON.stringify(res.user))
    refreshApolloClient()
    return res
  }

  async login (data: { username: string, password: string }) {
    const res = await this.request('POST', '/auth/password/login', data)
    this.setCookie(TOKENS_COOKIE_NAME, JSON.stringify(res.tokens))
    this.setCookie(USER_COOKIE_NAME, JSON.stringify(res.user))
    refreshApolloClient()
    return res
  }

  async logout () {
    try {
      await this.request('POST', '/auth/logout')
    } catch (e) {}
    this.destroyCookie(USER_COOKIE_NAME)
    this.destroyCookie(TOKENS_COOKIE_NAME)
    refreshApolloClient()
  }

  verify (data: { username: string, code: string }) {
    return this.request('POST', '/auth/verify', data)
  }

  sendForgotPassword (data: { username: string }) {
    return this.request('POST', '/auth/password/forgot', data)
  }

  resetPassword (data: { username: string, code: string, password: string }) {
    return this.request('POST', '/auth/password/reset', data)
  }
}
