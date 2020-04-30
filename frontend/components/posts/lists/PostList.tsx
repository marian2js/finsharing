import React, { useEffect } from 'react'
import gql from 'graphql-tag'
import { CircularProgress } from '@material-ui/core'
import { useQuery } from '@apollo/react-hooks'
import { Post } from '../../../src/types/Post'
import { PostListItem } from './PostListItem'
import InfiniteScroll from 'react-infinite-scroller'
import { DocumentNode } from 'graphql'

export const POSTS_PER_PAGE = 30

interface Props {
  viewerId: string | undefined
  query: DocumentNode
  queryVariables: object
  emptyMessage?: JSX.Element[] | JSX.Element
}

export const PostList = (props: Props) => {
  const { viewerId, query, queryVariables, emptyMessage } = props
  const { loading, error, data, fetchMore, refetch } = useQuery(
    query,
    {
      variables: {
        ...queryVariables,
        after: undefined,
      }
    }
  )
  let lastCursorFetched: string

  useEffect(() => {
    refetch()
  }, [])

  const handleLoadMore = async () => {
    const cursor = data?.posts?.pageInfo?.endCursor
    if (loading || !cursor || cursor === lastCursorFetched) {
      return
    }
    lastCursorFetched = cursor
    await fetchMore({
      variables: {
        ...queryVariables,
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
  if (!posts?.length && emptyMessage) {
    return <>{emptyMessage || ''}</>
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
