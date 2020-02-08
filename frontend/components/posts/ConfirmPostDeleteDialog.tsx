import React from 'react'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, useMediaQuery } from '@material-ui/core'
import theme from '../../src/theme'
import { Post } from '../../src/types/Post'
import Router from 'next/router'
import Typography from '@material-ui/core/Typography'
import gql from 'graphql-tag'
import { useMutation } from '@apollo/react-hooks'

interface Props {
  post: Post
  open: boolean
  onCancel: () => void
}

const DELETE_POST_MUTATION = gql`
  mutation ($slug: String!) {
    deletePost (input: { slug: $slug }) {
      result
    }
  }
`

export const ConfirmPostDeleteDialog = (props: Props) => {
  const { post, open, onCancel } = props
  const [deletePost] = useMutation(DELETE_POST_MUTATION)

  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))

  const handlePostDelete = async () => {
    await deletePost({
      variables: {
        slug: post.slug
      }
    })
    await Router.push('/')
  }

  return (
    <Dialog
      fullScreen={fullScreen}
      open={open}
      onClose={onCancel}
      aria-labelledby="delete-post-dialog">

      <DialogTitle id="delete-post-dialog">
        <Typography variant="h6">
          Are you sure you want to delete this post?
        </Typography>
      </DialogTitle>

      <DialogContent>

      </DialogContent>

      <DialogActions>
        <Button onClick={onCancel} color="primary">
          Cancel
        </Button>
        <Button onClick={handlePostDelete} color="secondary">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  )
}
