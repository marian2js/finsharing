import gql from 'graphql-tag'
import { PostList } from '../../components/posts/lists/PostList'
import { useLazyQuery, useQuery } from '@apollo/react-hooks'
import { QueryResult } from '@apollo/react-common'
import { Post } from '../types/Post'
import { PageInfoResponse } from '../types/QueryResponse'

const now = Date.now()

export type PostsResponse = {
  posts: {
    nodes: Post[]
    pageInfo: PageInfoResponse
  }
}

export type PostsQueryResult = QueryResult<PostsResponse>

export function usePinnedPosts (symbol?: string): PostsQueryResult {
  return useQuery<PostsResponse>(getGlobalPinnedPostsQuery(symbol), {
    variables: {
      now,
      marketId: symbol,
    }
  })
}

export function useLazyPinnedPosts (symbol?: string) {
  return useLazyQuery<PostsResponse>(getGlobalPinnedPostsQuery(symbol), {
    variables: {
      now,
      marketId: symbol,
    }
  })
}

function getGlobalPinnedPostsQuery (symbol?: string) {
  if (symbol) {
    return gql`
      query GetPosts ($now: Date!, $marketId: ID!) {
        posts (filter: { and: [
          { pinnedUntil: { value: $now, comparator: GREATER_THAN } },
          { market: { value: $marketId } },
        ] }) {
          ...PostList
        }
      }
      ${PostList.fragments.postList}
    `
  }
  return gql`
    query GetPosts ($now: Date!) {
      posts (filter: { pinnedUntil: { value: $now, comparator: GREATER_THAN } }) {
        ...PostList
      }
    }
    ${PostList.fragments.postList}
  `
}
