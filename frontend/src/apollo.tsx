import React from 'react'
import Head from 'next/head'
import { ApolloProvider } from '@apollo/react-hooks'
import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'
import fetch from 'isomorphic-unfetch'
import { NormalizedCacheObject } from 'apollo-cache-inmemory/lib/types'
import { NextPageContext } from 'next'
import { parseCookies } from 'nookies'
import { TOKENS_COOKIE_NAME } from './services/AuthService'
import { UserTokens } from './types/UserTokens'

let globalApolloClient: ApolloClient<NormalizedCacheObject> | null = null

export function refreshApolloClient () {
  globalApolloClient = null
}

type ApolloPageContext = NextPageContext & { apolloClient: ApolloClient<NormalizedCacheObject> }

interface WithApolloProps {
  apolloClient?: ApolloClient<NormalizedCacheObject>
  apolloState?: NormalizedCacheObject
  tokens?: UserTokens
}

/**
 * Creates and provides the apolloContext
 * to a next.js PageTree. Use it by wrapping
 * your PageComponent via HOC pattern.
 */
export function withApollo (PageComponent: any, { ssr = true } = {}) {
  const WithApollo = ({ apolloClient, apolloState, tokens, ...pageProps }: WithApolloProps) => {
    const client = apolloClient || initApolloClient(apolloState, tokens)
    return (
      <ApolloProvider client={client}>
        <PageComponent {...pageProps} />
      </ApolloProvider>
    )
  }

  // Set the correct displayName in development
  if (process.env.NODE_ENV !== 'production') {
    const displayName =
      PageComponent.displayName || PageComponent.name || 'Component'

    if (displayName === 'App') {
      console.warn('This withApollo HOC only works with PageComponents.')
    }

    WithApollo.displayName = `withApollo(${displayName})`
  }

  if (ssr || PageComponent.getInitialProps) {
    WithApollo.getInitialProps = async (ctx: ApolloPageContext): Promise<WithApolloProps> => {
      const { AppTree } = ctx

      const tokensJson = parseCookies(ctx || null)[TOKENS_COOKIE_NAME]
      let tokens: UserTokens | undefined
      if (tokensJson) {
        tokens = JSON.parse(tokensJson)
      }

      // Initialize ApolloClient, add it to the ctx object so
      // we can use it in `PageComponent.getInitialProp`.
      const apolloClient = (ctx.apolloClient = initApolloClient({}, tokens))

      // Run wrapped getInitialProps methods
      let pageProps = {}
      if (PageComponent.getInitialProps) {
        pageProps = await PageComponent.getInitialProps(ctx)
      }

      // Only on the server:
      if (typeof window === 'undefined') {
        // When redirecting, the response is finished.
        // No point in continuing to render
        if (ctx.res && ctx.res.finished) {
          return pageProps
        }

        // Only if ssr is enabled
        if (ssr) {
          try {
            // Run all GraphQL queries
            const { getDataFromTree } = await import('@apollo/react-ssr')
            const res = await getDataFromTree(
              <AppTree
                pageProps={{
                  ...pageProps,
                  apolloClient,
                }}
              />
            )

          } catch (error) {
            // Prevent Apollo Client GraphQL errors from crashing SSR.
            // Handle them in components via the data.error prop:
            // https://www.apollographql.com/docs/react/api/react-apollo.html#graphql-query-data-error
            console.error('Error while running `getDataFromTree`', error)
          }

          // getDataFromTree does not call componentWillUnmount
          // head side effect therefore need to be cleared manually
          Head.rewind()
        }
      }

      // Extract query data from the Apollo store
      const apolloState = apolloClient.cache.extract()

      return {
        ...pageProps,
        apolloState,
        tokens,
      }
    }
  }

  return WithApollo
}

/**
 * Always creates a new apollo client on the server
 * Creates or reuses apollo client in the browser.
 */
export function initApolloClient (initialState: NormalizedCacheObject = {}, tokens?: UserTokens) {
  // Make sure to create a new client for every server-side request so that data
  // isn't shared between connections (which would be bad)
  if (typeof window === 'undefined') {
    return createApolloClient(initialState, tokens)
  }

  // Reuse client on the client-side
  if (!globalApolloClient) {
    globalApolloClient = createApolloClient(initialState, tokens)
  }

  return globalApolloClient
}

/**
 * Creates and configures the ApolloClient
 */
function createApolloClient (initialState: NormalizedCacheObject = {}, tokens?: UserTokens) {
  const headers: { [key: string]: string } = {}
  if (tokens) {
    headers.Authorization = `Bearer ${tokens.accessToken}`
  }

  const endpoint = typeof window === 'undefined' ? process.env.ENDPOINT! : ''

  return new ApolloClient({
    ssrMode: typeof window === 'undefined', // Disables forceFetch on the server (so queries are only run once)
    link: new HttpLink({
      uri: `${endpoint}/graphql`, // Server URL (must be absolute)
      credentials: 'same-origin', // Additional fetch() options like `credentials` or `headers`
      fetch,
      headers,
    }),
    cache: new InMemoryCache({
      dataIdFromObject: (node: any) => {
        switch (node.__typename) {
          case 'User':
            return node.username || node.id
          case 'Post':
            return node.slug || node.id
          case 'Market':
            return node.symbol || node.id
        }
        return node.id
      }
    }).restore(initialState),
  })
}
