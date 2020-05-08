import React from 'react'
import gql from 'graphql-tag'
import { PostList, POSTS_PER_PAGE } from './PostList'

interface Props {
  viewerId: string | undefined
  userId: string
}

export const UserPostList = (props: Props) => {
  const { viewerId, userId } = props
  return (
    <PostList viewerId={viewerId} query={USER_LAST_POSTS_QUERY} queryVariables={{ userId }} showPriceChange={true}/>
  )
}

const USER_LAST_POSTS_QUERY = gql`
  query Posts ($userId: ID!, $after: String) {
    posts (first: ${POSTS_PER_PAGE}, after: $after, filter: { user: { value: $userId } }, orderBy: [{ createdAt: DESC }]) {
      ...PostList
    }
  }
  ${PostList.fragments.postList}
`

