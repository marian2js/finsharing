import { Market } from '../types/Market'
import gql from 'graphql-tag'
import { useMutation } from '@apollo/react-hooks'
import { LIST_FOLLOWED_MARKETS_QUERY } from '../../components/PageLayout/SideMenuWatchlist'
import { DataProxy } from 'apollo-cache'

export function useFollowMarket () {
  const mutation = gql`
    mutation ($marketId: ID!) {
      createMarketFollow (input: { market: $marketId }) {
        marketFollow {
          id
          market {
            symbol
            price
            priceClose
            numberOfFollowers
          }
        }
      }
    }
  `
  const [followMarket] = useMutation(mutation)

  const followMarketHook = ({ market, viewerId }: { market: Market, viewerId: string }) => {
    return followMarket({
      variables: {
        marketId: market.id
      },
      update: (proxy, { data }) => {
        updateMarketFollowers({
          proxy: proxy,
          symbol: market.symbol,
          numberOfFollowers: data.createMarketFollow.marketFollow.market.numberOfFollowers,
          marketFollowId: data.createMarketFollow.marketFollow.id,
        })

        // update viewer watchlist
        const query = { query: LIST_FOLLOWED_MARKETS_QUERY, variables: { userId: viewerId } }
        const cachedData: any = proxy.readQuery(query)
        cachedData.marketFollows.nodes.push({
          id: data.createMarketFollow.marketFollow.id,
          market: {
            ...market,
            __typename: 'Market',
          },
          __typename: 'MarketFollow',
        })
        proxy.writeQuery({ ...query, data: cachedData })
      },
    })
  }
  return [followMarketHook]
}

export function useUnfollowMarket () {
  const mutation = gql`
    mutation ($followId: ID!) {
      deleteMarketFollow (input: {id: $followId}) {
        result
      }
    }
  `
  const [unfollowMarket] = useMutation(mutation)

  const unfollowMarketHook = ({ market, viewerId, viewerFollowId }: {
    market: Market,
    viewerId: string,
    viewerFollowId: string
  }) => {
    return unfollowMarket({
      variables: {
        followId: viewerFollowId
      },
      update: (proxy) => {
        updateMarketFollowers({
          proxy: proxy,
          symbol: market.symbol,
          numberOfFollowers: market.numberOfFollowers - 1,
          marketFollowId: null
        })

        // update viewer watchlist
        const query = { query: LIST_FOLLOWED_MARKETS_QUERY, variables: { userId: viewerId } }
        const data: any = proxy.readQuery(query)
        const index = data.marketFollows.nodes
          ?.findIndex((marketFollow: { market: Market }) => marketFollow.market.symbol === market.symbol)
        if (index >= 0) {
          data.marketFollows.nodes.splice(index, 1)
          proxy.writeQuery({ ...query, data })
        }
      },
    })
  }
  return [unfollowMarketHook]
}

const updateMarketFollowers = ({ proxy, symbol, numberOfFollowers, marketFollowId }: {
  proxy: DataProxy,
  symbol: string,
  numberOfFollowers: number,
  marketFollowId: string | null,
}) => {
  proxy.writeFragment({
    id: symbol,
    fragment: gql`
      fragment MarketFollowers on Market {
        __typename
        numberOfFollowers
        viewerFollow {
          id
          __typename
        }
      }
    `,
    data: {
      __typename: 'Market',
      numberOfFollowers,
      viewerFollow: marketFollowId ? {
        id: marketFollowId,
        __typename: 'MarketFollow'
      } : null
    },
  })
}
