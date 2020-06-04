import React from 'react'
import { PostList, POSTS_PER_PAGE } from './PostList'
import gql from 'graphql-tag'
import { useQuery } from '@apollo/react-hooks'
import { CircularProgress } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import { Alert } from '@material-ui/lab'
import { LIST_FOLLOWED_MARKETS_QUERY } from '../../PageLayout/SideMenuWatchlist'

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
  const emptyMessage = (
    <Alert color="warning" icon={<AddIcon/>}>
      Follow the markets that interest you to get relevant posts here.
    </Alert>
  )

  if (loading) {
    return <CircularProgress/>
  }

  const followedMarkets = data.marketFollows.nodes
  if (!followedMarkets?.length) {
    return emptyMessage
  }

  const filter = {
    or: followedMarkets.map((follow: { market: { id: string } }) => ({ market: { value: follow.market.id } }))
  }

  return (
    <PostList viewerId={viewerId}
              query={FOLLOWING_POSTS_QUERY}
              queryVariables={{ filter }}
              showPriceChange={true}
              emptyMessage={emptyMessage}/>
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
