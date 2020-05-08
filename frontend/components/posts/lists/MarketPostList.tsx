import React from 'react'
import gql from 'graphql-tag'
import { PostList, POSTS_PER_PAGE } from './PostList'
import WarningIcon from '@material-ui/icons/Warning'
import { Alert } from '@material-ui/lab'
import Link from 'next/link'

interface Props {
  viewerId: string | undefined
  marketId: string
}

export const MarketPostList = (props: Props) => {
  const { viewerId, marketId } = props
  return (
    <PostList viewerId={viewerId}
              query={MARKET_LAST_POSTS_QUERY}
              queryVariables={{ marketId }}
              showPriceChange={false}
              emptyMessage={
                <Alert color="warning" icon={<WarningIcon/>}>
                  There are no recent posts for this market. Please check out later or <Link href="/new-post">
                  <a style={{ display: 'contents' }}>create the first one</a></Link>.
                </Alert>
              }/>
  )
}

const MARKET_LAST_POSTS_QUERY = gql`
  query Posts ($marketId: ID!, $after: String) {
    posts (first: ${POSTS_PER_PAGE}, after: $after, filter: { market: { value: $marketId } }, orderBy: [{ createdAt: DESC }]) {
      ...PostList
    }
  }
  ${PostList.fragments.postList}
`
