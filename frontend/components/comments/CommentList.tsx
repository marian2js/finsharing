import React, { useEffect, useState } from 'react'
import { Comment } from '../../src/types/Comment'
import { CommentListItem } from './CommentListItem'
import gql from 'graphql-tag'
import { useQuery } from '@apollo/react-hooks'
import { CircularProgress } from '@material-ui/core'
import { Post } from '../../src/types/Post'

interface Props {
  post: Post
  authUserId?: string
  lastCommentAddedId?: string
}

const LAST_COMMENTS_QUERY = gql`
  query Comments ($postId: ID!) {
    comments (filter: { post: { value: $postId } }, orderBy: [{ createdAt: ASC }]) {
      nodes {
        ...CommentListItem
      }
    }
  }
  ${CommentListItem.fragments.comment}
`

export const CommentList = (props: Props) => {
  const { loading, error, data, refetch, fetchMore, networkStatus } = useQuery(
    LAST_COMMENTS_QUERY,
    {
      variables: {
        postId: props.post.id
      },
      notifyOnNetworkStatusChange: true,
    }
  )

  const { authUserId, lastCommentAddedId } = props
  const [comments, setComments] = useState<Comment[]>(data?.comments?.nodes || [])

  useEffect(() => {
    setComments(data?.comments?.nodes || [])
  }, [data])

  useEffect(() => {
    refetch()
  }, [lastCommentAddedId])

  if (loading && !comments.length) {
    return <CircularProgress/>
  }

  if (error) {
    return <div>Unexpected error loading comments</div>
  }

  const handleCommentDeleted = (comment: Comment) => {
    const commentIndex = comments.findIndex(c => c.id === comment.id)
    const newComments = [...comments]
    newComments.splice(commentIndex, 1)
    setComments(newComments)
  }

  return (
    <>
      {
        comments.map(comment => <CommentListItem key={comment.id}
                                                 comment={comment}
                                                 viewerId={authUserId}
                                                 post={props.post}
                                                 onCommentDelete={handleCommentDeleted}/>)
      }
    </>
  )
}
