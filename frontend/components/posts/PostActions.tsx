import React, { useState } from 'react'
import { Button, IconButton, Menu, MenuItem, useMediaQuery } from '@material-ui/core'
import { Post } from '../../src/types/Post'
import gql from 'graphql-tag'
import theme from '../../src/theme'
import { ConfirmPostDeleteDialog } from './ConfirmPostDeleteDialog'
import Link from 'next/link'
import MoreHorizIcon from '@material-ui/icons/MoreHoriz'
import EditIcon from '@material-ui/icons/Edit'
import DeleteIcon from '@material-ui/icons/Delete'
import CommentIcon from '@material-ui/icons/Comment'

interface Props {
  post: Post
  authUserId?: string
}

export const PostActions = (props: Props) => {
  const { post, authUserId } = props
  const [confirmPostDeleteDialogOpen, setConfirmPostDeleteDialogOpen] = useState(false)
  const [menuAnchorEl, setMenuAnchorEl] = React.useState<null | HTMLElement>(null)

  const useCompressActionsMenu = useMediaQuery(theme.breakpoints.down('sm'))

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setMenuAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setMenuAnchorEl(null)
  }

  const handleDeleteClick = () => {
    handleMenuClose()
    setConfirmPostDeleteDialogOpen(true)
  }

  const handleShareClick = () => {
    // TODO
  }

  const userIsAuthor = authUserId && authUserId === post.user.id

  return (
    <>
      <Button size="small" startIcon={<CommentIcon/>}>
        {post.numberOfComments} comments
      </Button>
      {/*<Button size="small" onClick={handleShareClick}>
        Share
      </Button>*/}
      {
        userIsAuthor && (
          useCompressActionsMenu ?
            <>
              <IconButton size="small" aria-label="author actions" color="default" onClick={handleMenuOpen}>
                <MoreHorizIcon/>
              </IconButton>
              <Menu
                id="author-actions-menu"
                anchorEl={menuAnchorEl}
                keepMounted
                open={Boolean(menuAnchorEl)}
                onClose={handleMenuClose}>
                <Link href="/posts/[slug]/edit" as={`/posts/${post.slug}/edit`}>
                  <MenuItem onClick={handleMenuClose}>Edit</MenuItem>
                </Link>
                <MenuItem onClick={handleDeleteClick}>Delete</MenuItem>
              </Menu>

            </> :
            <>
              <Link href="/posts/[slug]/edit" as={`/posts/${post.slug}/edit`}>
                <Button size="small" startIcon={<EditIcon/>}>
                  Edit
                </Button>
              </Link>
              <Button onClick={() => setConfirmPostDeleteDialogOpen(true)} size="small"
                      startIcon={<DeleteIcon/>}>
                Delete
              </Button>
            </>
        )
      }

      <ConfirmPostDeleteDialog post={post}
                               open={confirmPostDeleteDialogOpen}
                               onCancel={() => setConfirmPostDeleteDialogOpen(false)}/>
    </>
  )
}

PostActions.fragments = {
  post: gql`
    fragment PostActions on Post {
      slug
      numberOfComments
      user {
        id
      }
    }
  `,
}

