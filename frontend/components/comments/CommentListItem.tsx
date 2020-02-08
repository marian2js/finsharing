import React, { useState } from 'react'
import { Comment } from '../../src/types/Comment'
import { Button, Card, CardActions, CardContent, makeStyles, Typography } from '@material-ui/core'
import { MarkdownContent } from '../MarkdownContent'
import EditIcon from '@material-ui/icons/Edit'
import DeleteIcon from '@material-ui/icons/Delete'
import { ConfirmCommentDeleteDialog } from '../posts/ConfirmCommentDeleteDialog'
import { CommentForm } from './CommentForm'
import { Post } from '../../src/types/Post'

const useStyles = makeStyles(theme => ({
  commentCard: {
    marginBottom: theme.spacing(2)
  },
}))

interface Props {
  post: Post
  comment: Comment
  authUserId?: string
  onCommentDelete: (comment: Comment) => void
}

export const CommentListItem = (props: Props) => {
  const classes = useStyles()
  const { authUserId, onCommentDelete } = props
  const [comment, setComment] = useState(props.comment)
  const [editingComment, setEditingComment] = useState(false)
  const [confirmCommentDeleteDialogOpen, setConfirmCommentDeleteDialogOpen] = useState(false)

  const handleCommentDeleted = () => {
    setConfirmCommentDeleteDialogOpen(false)
    onCommentDelete(comment)
  }

  const handleCommentUpdated = (c: Comment) => {
    setComment(c)
    setEditingComment(false)
  }

  const renderComment = () => {
    return (
      <>
        <CardContent>
          <Typography variant="subtitle2" color="textSecondary">
            {comment.user.username}
          </Typography>
          <MarkdownContent content={comment.body}/>
        </CardContent>
        <CardActions>
          {
            authUserId === comment.user.id && (
              <>
                <Button onClick={() => setEditingComment(true)} size="small" startIcon={<EditIcon/>}>
                  Edit
                </Button>
                <Button onClick={() => setConfirmCommentDeleteDialogOpen(true)} size="small" startIcon={<DeleteIcon/>}>
                  Delete
                </Button>
              </>
            )
          }
        </CardActions>
      </>
    )
  }

  const renderEditComment = () => {
    return (
      <CommentForm comment={comment} onCommentUpdate={handleCommentUpdated}/>
    )
  }

  return (
    <Card className={classes.commentCard}>
      {
        editingComment ? renderEditComment() : renderComment()
      }

      <ConfirmCommentDeleteDialog commentId={comment.id}
                                  post={props.post}
                                  open={confirmCommentDeleteDialogOpen}
                                  onCommentDelete={handleCommentDeleted}
                                  onCancel={() => setConfirmCommentDeleteDialogOpen(false)}/>
    </Card>
  )
}
