import React from 'react'
import gql from 'graphql-tag'
import { useQuery } from '@apollo/react-hooks'
import { Market } from '../../src/types/Market'
import { Box, CircularProgress } from '@material-ui/core'
import { SideMenuMarketList } from './SideMenuMarketList'
import { getMarketPriceChange } from '../../src/utils/markets'

interface Props {
  viewerId: string
}

export const SideMenuWatchlist = (props: Props) => {
  const { viewerId } = props
  const { error, loading, data } = useQuery(
    LIST_FOLLOWED_MARKETS_QUERY, {
      pollInterval: 1000 * 60,
      notifyOnNetworkStatusChange: true,
      variables: {
        userId: viewerId
      }
    }
  )
  const markets: Market[] = (data?.marketFollows?.nodes?.map((f: { market: Market }) => f.market) || [])
    .sort((a: Market, b: Market) => getMarketPriceChange(b) - getMarketPriceChange(a))

  if (error) {
    return <div>Error loading markets, please try again</div>
  }

  if (loading && !markets.length) {
    return <CircularProgress/>
  }
  if (!markets.length) {
    return <Box p={2}><p>Your watchlist is empty. Follow markets to add them here.</p></Box>
  }

  return (
    <SideMenuMarketList markets={markets}/>
  )
}

export const LIST_FOLLOWED_MARKETS_QUERY = gql`
  query MarketFollows ($userId: ID!) {
    marketFollows (first: 100, filter: { user: { value: $userId } }) {
      nodes {
        id
        market {
          id
          ...SideMenuMarketList
        }
      }
    }
  }
  ${SideMenuMarketList.fragments.marketList}
`
