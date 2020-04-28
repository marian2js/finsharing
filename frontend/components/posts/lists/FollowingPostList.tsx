import React from 'react'
import { PostList, POSTS_PER_PAGE } from './PostList'
import gql from 'graphql-tag'
import { useQuery } from '@apollo/react-hooks'
import { CircularProgress } from '@material-ui/core'

interface Props {
  viewerId: string
}

export const FollowingPostList = (props: Props) => {
  const { viewerId } = props
  const { loading, error, data } = useQuery(
    LIST_FOLLOWED_MARKETS_QUERY,
    {
      variables: {
        userId: viewerId
      }
    }
  )

  if (loading) {
    return <CircularProgress/>
  }

  const followedMarkets = data.marketFollows.nodes
  if (!followedMarkets?.length) {
    return <></>
  }

  const filter = {
    or: followedMarkets.map((follow: { market: { id: string } }) => ({ market: { value: follow.market.id } }))
  }

  return (
    <PostList viewerId={viewerId} query={FOLLOWING_POSTS_QUERY} queryVariables={{ filter }}/>
  )
}

const FOLLOWING_POSTS_QUERY = gql`
  query Posts ($after: String, $filter: PostFilterInput) {
    posts (first: ${POSTS_PER_PAGE}, filter: $filter, after: $after, orderBy: [{ createdAt: DESC }]) {
      ...PostList
    }
  }
  ${PostList.fragments.postList}
`

const LIST_FOLLOWED_MARKETS_QUERY = gql`
  query MarketFollows ($userId: ID!) {
    marketFollows (filter: { user: { value: $userId } }) {
      nodes {
        id
        market {
          id
        }
      }
    }
  }
`
