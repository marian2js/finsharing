import { useMutation } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import { MutationFunctionOptions } from '@apollo/react-common'
import { TOKENS_COOKIE_NAME, USER_COOKIE_NAME } from './AuthService'
import { refreshApolloClient } from '../apollo'
import { destroyCookie as nookiesDestroyCookie, setCookie } from 'nookies'

export function useLogin () {
  const mutation = gql`
    mutation login ($username: String!, $password: String!) {
      login (username: $username, password: $password) {
        user {
          id
          username
        }
        tokens {
          accessToken
          accessTokenExpiration
          refreshToken
        }
      }
    }
  `
  const [login] = useMutation(mutation)
  return [
    async <TData, TVariables> (options?: MutationFunctionOptions<TData, TVariables>) => {
      const res = await login(options)
      setCookie(null, TOKENS_COOKIE_NAME, JSON.stringify(res.data.login.tokens), {})
      setCookie(null, USER_COOKIE_NAME, JSON.stringify(res.data.login.user), {})
      refreshApolloClient()
    }
  ]
}

export function useLogout () {
  const mutation = gql`
    mutation logout {
      logout {
        result
      }
    }
  `
  const [logout] = useMutation(mutation)
  return [
    async <TData, TVariables> (options?: MutationFunctionOptions<TData, TVariables>) => {
      try {
        await logout(options)
      } catch (e) {}
      destroyCookie(USER_COOKIE_NAME)
      destroyCookie(TOKENS_COOKIE_NAME)
      refreshApolloClient()
    }
  ]
}

export function useVerifyEmail () {
  const mutation = gql`
    mutation verifyEmail ($username: String!, $code: String!) {
      verifyEmail (username: $username, code: $code) {
        result
      }
    }
  `
  return useMutation(mutation)
}

export function useSendResetPasswordEmail () {
  const mutation = gql`
    mutation sendResetPasswordEmail ($username: String!) {
      sendResetPasswordEmail(username: $username) {
        result
      }
    }
  `
  return useMutation(mutation)
}

export function useResetPassword () {
  const mutation = gql`
    mutation resetPassword ($username: String!, $password: String!, $code: String!) {
      resetPassword(username: $username, password: $password, code: $code) {
        result
      }
    }
  `
  return useMutation(mutation)
}

export function useCompleteSocialAuthentication () {
  const mutation = gql`
    mutation completeSocialAuthentication ($provider: String!, $code: String!, $username: String) {
      completeSocialAuthentication(provider: $provider, code: $code, username: $username) {
        user {
          id
          username
        }
        tokens {
          accessToken
          refreshToken
        }
      }
    }
  `
  const [completeSocialAuthentication] = useMutation(mutation)
  return [
    async <TData, TVariables> (options?: MutationFunctionOptions<TData, TVariables>) => {
      const res = await completeSocialAuthentication(options)
      setCookie(null, TOKENS_COOKIE_NAME, JSON.stringify(res.data.completeSocialAuthentication.tokens), {})
      setCookie(null, USER_COOKIE_NAME, JSON.stringify(res.data.completeSocialAuthentication.user), {})
      refreshApolloClient()
    }
  ]
}

function destroyCookie (name: string) {
  nookiesDestroyCookie(null, name)
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`
}
