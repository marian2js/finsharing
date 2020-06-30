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
import { faShare } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ShareDialog } from '../dialogs/ShareDialog'
import { getCashTag } from '../../src/utils/markets'

declare global {
  interface Navigator {
    share: (data: { url: string, title?: string, text?: string, }) => Promise<void>
  }
}

interface Props {
  post: Post
  authUserId?: string
  showShareButton?: boolean
}

export const PostActions = (props: Props) => {
  const { post, authUserId, showShareButton } = props
  const [confirmPostDeleteDialogOpen, setConfirmPostDeleteDialogOpen] = useState(false)
  const [shareDialogOpen, setShareDialogOpen] = useState(false)
  const [menuAnchorEl, setMenuAnchorEl] = React.useState<null | HTMLElement>(null)
  const postFullUrl = `https://finsharing.com/posts/${post.slug}`

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
    handleMenuClose()
    if (navigator.share) {
      const shareData = {
        title: post.title,
        text: post.title,
        url: postFullUrl,
      }
      navigator.share(shareData)
    } else {
      setShareDialogOpen(true)
    }
  }

  const userIsAuthor = authUserId && authUserId === post.user.id

  return (
    <>
      <Button size="small" startIcon={<CommentIcon/>}>
        {post.numberOfComments} comments
      </Button>
      {
        showShareButton && (!userIsAuthor || !useCompressActionsMenu) && (
          <Button size="small" startIcon={<FontAwesomeIcon icon={faShare}/>} onClick={handleShareClick}>
            Share
          </Button>
        )
      }
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
                <MenuItem onClick={handleShareClick}>Share</MenuItem>
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
      <ShareDialog open={shareDialogOpen}
                   onClose={() => setShareDialogOpen(false)}
                   shareUrl={postFullUrl}
                   shareTitle={post.title}
                   shareCashTag={getCashTag(post.market.symbol)}/>
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

