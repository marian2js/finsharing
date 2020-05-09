import React from 'react'
import gql from 'graphql-tag'
import { useQuery } from '@apollo/react-hooks'
import { Market } from '../../src/types/Market'
import { CircularProgress } from '@material-ui/core'
import { SideMenuMarketList } from './SideMenuMarketList'

export const SideMenuPopularList = () => {
  const { error, loading, data } = useQuery(
    LIST_MARKETS_QUERY, {
      pollInterval: 1000 * 60,
      notifyOnNetworkStatusChange: true,
    }
  )
  const markets: Market[] = data?.markets?.nodes || []

  if (error) {
    return <div>Error loading markets, please try again</div>
  }

  if (loading && !markets.length) {
    return <CircularProgress/>
  }

  return (
    <SideMenuMarketList markets={markets}/>
  )
}

const LIST_MARKETS_QUERY = gql`
  {
    markets (first: 30, orderBy: [{ numberOfFollowers: DESC }]) {
      nodes {
        ...SideMenuMarketList
      }
    }
  }
  ${SideMenuMarketList.fragments.marketList}
`
