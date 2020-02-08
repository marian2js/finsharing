import React from 'react'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, useMediaQuery } from '@material-ui/core'
import theme from '../../src/theme'
import Typography from '@material-ui/core/Typography'
import gql from 'graphql-tag'
import { useMutation } from '@apollo/react-hooks'
import { Post } from '../../src/types/Post'

interface Props {
  commentId: string
  post: Post
  open: boolean
  onCommentDelete: (commentId: string) => void
  onCancel: () => void
}

const DELETE_COMMENT_MUTATION = gql`
  mutation ($commentId: ID!) {
    deleteComment (input: { id: $commentId }) {
      result
    }
  }
`

export const ConfirmCommentDeleteDialog = (props: Props) => {
  const { commentId, open, onCommentDelete, onCancel } = props
  const [deleteComment] = useMutation(DELETE_COMMENT_MUTATION)

  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))

  const handleCommentDelete = async () => {
    await deleteComment({
      variables: {
        commentId
      },
      refetchQueries: [{
        query: gql`
          query Post ($slug: String!) {
            post (slug: $slug) {
              id
              slug
              numberOfComments
            }
          }`,
        variables: {
          slug: props.post.slug
        }
      }]
    })
    onCommentDelete(commentId)
  }

  return (
    <Dialog
      fullScreen={fullScreen}
      open={open}
      onClose={onCancel}
      aria-labelledby="delete-comment-dialog">

      <DialogTitle id="delete-comment-dialog">
        <Typography variant="h6">
          Are you sure you want to delete this comment?
        </Typography>
      </DialogTitle>

      <DialogContent>

      </DialogContent>

      <DialogActions>
        <Button onClick={onCancel} color="primary">
          Cancel
        </Button>
        <Button onClick={handleCommentDelete} color="secondary">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  )
}
