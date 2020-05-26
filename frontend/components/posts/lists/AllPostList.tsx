import React from 'react'
import gql from 'graphql-tag'
import { PostList, POSTS_PER_PAGE } from './PostList'

interface Props {
  viewerId: string | undefined
}

export const AllPostList = (props: Props) => {
  const { viewerId } = props
  return (
    <PostList viewerId={viewerId} query={ALL_POSTS_QUERY} queryVariables={{}} showPriceChange={true}/>
  )
}

const ALL_POSTS_QUERY = gql`
  query Posts ($after: String) {
    posts (first: ${POSTS_PER_PAGE}, filter: { votes: { comparator: GREATER_THAN, value: 0 } }, after: $after, orderBy: [{ createdAt: DESC }]) {
      ...PostList
    }
  }
  ${PostList.fragments.postList}
`
