import React from 'react'
import gql from 'graphql-tag'
import { PostList, POSTS_PER_PAGE } from './PostList'

interface Props {
  viewerId: string | undefined
  marketId: string
}

export const MarketPostList = (props: Props) => {
  const { viewerId, marketId } = props
  return (
    <PostList viewerId={viewerId} query={MARKET_LAST_POSTS_QUERY} queryVariables={{ marketId }}/>
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
