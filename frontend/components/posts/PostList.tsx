import React from 'react'
import gql from 'graphql-tag'
import { CircularProgress } from '@material-ui/core'
import { useQuery } from '@apollo/react-hooks'
import { Market } from '../../src/types/Market'
import { Post } from '../../src/types/Post'
import { PostListItem } from './PostListItem'
import InfiniteScroll from 'react-infinite-scroller'

const POSTS_PER_PAGE = 30

interface Props {
  market?: Market
  userId?: string
  viewerId: string | undefined
}

export const PostList = (props: Props) => {
  const { market, userId, viewerId } = props
  const { loading, error, data, fetchMore } = useQuery(
    market ? MARKET_LAST_POSTS_QUERY : (userId ? USER_LAST_POSTS_QUERY : LAST_POSTS_QUERY),
    {
      variables: {
        marketId: market?.id,
        userId,
        after: undefined,
      },
    }
  )
  let lastCursorFetched: string

  const handleLoadMore = async () => {
    const cursor = data?.posts?.pageInfo?.endCursor
    if (loading || !cursor || cursor === lastCursorFetched) {
      return
    }
    lastCursorFetched = cursor
    await fetchMore({
      variables: {
        marketId: market?.id,
        userId,
        after: cursor,
      },
      updateQuery: (prev: { posts: any }, { fetchMoreResult }) => {
        if (!fetchMoreResult) {
          return prev
        }
        return Object.assign({}, prev, {
          posts: {
            ...prev.posts,
            nodes: [...prev.posts.nodes, ...fetchMoreResult.posts.nodes],
            pageInfo: fetchMoreResult.posts.pageInfo,
          }
        })
      },
    })
  }

  const posts = data?.posts?.nodes as Post[]

  if (error) {
    return <div>Unknown error rendering the list of posts</div>
  }

  if (loading && !posts?.length) {
    return <CircularProgress/>
  }

  return (
    <>
      <InfiniteScroll
        pageStart={0}
        loadMore={handleLoadMore}
        hasMore={!loading && (data?.posts?.pageInfo?.hasNextPage || false)}
        loader={<CircularProgress key={0}/>}>
        {
          posts.map((post, i) => <PostListItem key={i} post={post} viewerId={viewerId}/>)
        }
      </InfiniteScroll>
    </>
  )
}

PostList.fragments = {
  postList: gql`
    fragment PostList on PostConnection {
      nodes {
        ...PostListItem
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
    ${PostListItem.fragments.post}
  `,
}

const LAST_POSTS_QUERY = gql`
  query Posts ($after: String) {
    posts (first: ${POSTS_PER_PAGE}, after: $after, orderBy: [{ createdAt: DESC }]) {
      ...PostList
    }
  }
  ${PostList.fragments.postList}
`

const MARKET_LAST_POSTS_QUERY = gql`
  query Posts ($marketId: ID!, $after: String) {
    posts (first: ${POSTS_PER_PAGE}, after: $after, filter: { market: { value: $marketId } }, orderBy: [{ createdAt: DESC }]) {
      ...PostList
    }
  }
  ${PostList.fragments.postList}
`

const USER_LAST_POSTS_QUERY = gql`
  query Posts ($userId: ID!, $after: String) {
    posts (first: ${POSTS_PER_PAGE}, after: $after, filter: { user: { value: $userId } }, orderBy: [{ createdAt: DESC }]) {
      ...PostList
    }
  }
  ${PostList.fragments.postList}
`
