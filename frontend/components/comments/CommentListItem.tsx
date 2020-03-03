import React, { useEffect, useState } from 'react'
import { Comment } from '../../src/types/Comment'
import { Button, Card, CardActions, CardContent, makeStyles, Typography } from '@material-ui/core'
import { MarkdownContent } from '../MarkdownContent'
import EditIcon from '@material-ui/icons/Edit'
import DeleteIcon from '@material-ui/icons/Delete'
import { ConfirmCommentDeleteDialog } from '../posts/ConfirmCommentDeleteDialog'
import { CommentForm } from './CommentForm'
import { Post } from '../../src/types/Post'
import Link from 'next/link'
import moment from 'moment'
import gql from 'graphql-tag'
import IconButton from '@material-ui/core/IconButton'
import ExpandLessIcon from '@material-ui/icons/ExpandLess'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import Router from 'next/router'
import { useMutation } from '@apollo/react-hooks'

const useStyles = makeStyles(theme => ({
  commentCard: {
    marginBottom: theme.spacing(2)
  },
  usernameLink: {
    '&:hover': {
      color: theme.palette.text.secondary,
    }
  },
  voteButton: {
    padding: 0,
  },
  votes: {
    marginTop: '2px'
  },
}))

interface Props {
  post: Post
  comment: Comment
  viewerId?: string
  onCommentDelete: (comment: Comment) => void
}

export const CommentListItem = (props: Props) => {
  const classes = useStyles()
  const [createCommentVote] = useMutation(CREATE_COMMENT_VOTE_MUTATION)
  const [deleteCommentVote] = useMutation(DELETE_COMMENT_VOTE_MUTATION)
  const { viewerId, onCommentDelete } = props
  const [comment, setComment] = useState(props.comment)
  const [editingComment, setEditingComment] = useState(false)
  const [confirmCommentDeleteDialogOpen, setConfirmCommentDeleteDialogOpen] = useState(false)
  const [viewerVote, setViewerVote] = useState(comment.viewerVote ? (comment.viewerVote.value === 'POSITIVE_1' ? 1 : -1) : 0)

  useEffect(() => {
    setViewerVote(props.comment.viewerVote ? (props.comment.viewerVote.value === 'POSITIVE_1' ? 1 : -1) : 0)
    setComment(props.comment)
  }, [props.comment])

  const refetchCommentVotesQuery = {
    query: gql`
      query ($commentId: String!) {
        comment (id: $commentId) {
          id
          votes
          viewerVote {
            id
            value
          }
        }
      }
    `,
    variables: {
      commentId: comment.id
    }
  }

  const handleCommentDeleted = () => {
    setConfirmCommentDeleteDialogOpen(false)
    onCommentDelete(comment)
  }

  const handleCommentUpdated = (c: Comment) => {
    setComment(c)
    setEditingComment(false)
  }

  const handleVote = async (e: React.MouseEvent<HTMLButtonElement>, value: 1 | -1) => {
    e.preventDefault()

    if (!viewerId) {
      await Router.push('/register')
      return
    }

    if (value === viewerVote) {
      await handleDeleteVote(true)
    } else if (viewerVote) {
      await handleDeleteVote(false)
      await handleCreateVote(value)
    } else {
      await handleCreateVote(value)
    }
  }

  const handleCreateVote = async (value: 1 | -1) => {
    const voteValue = value === 1 ? 'POSITIVE_1' : 'NEGATIVE_1'
    await createCommentVote({
      variables: {
        commentId: comment.id,
        value: voteValue
      },
      refetchQueries: [refetchCommentVotesQuery]
    })
  }

  const handleDeleteVote = async (refetchVotes: boolean) => {
    await deleteCommentVote({
      variables: {
        voteId: comment.viewerVote.id
      },
      ...(refetchVotes && { refetchQueries: [refetchCommentVotesQuery] })
    })
  }

  const renderComment = () => {
    return (
      <>
        <CardContent>
          <Link href="/users/[username]" as={`/users/${comment.user.username}`}>
            <a className={classes.usernameLink}>
              <Typography variant="subtitle2" color="textSecondary" component="span">
                {comment.user.username}
              </Typography>
            </a>
          </Link>
          &nbsp; - &nbsp;
          <Typography variant="subtitle2" color="textSecondary" component="span">
            {moment(Number(comment.createdAt)).fromNow()}
          </Typography>
          <MarkdownContent content={comment.body}/>
        </CardContent>
        <CardActions>
          <IconButton size="small" aria-label="Up vote"
                      className={classes.voteButton}
                      color={viewerVote === 1 ? 'primary' : 'default'}
                      onClick={e => handleVote(e, 1)}>
            <ExpandLessIcon fontSize="large"/>
          </IconButton>
          <Typography gutterBottom variant="body2" className={classes.votes}>
            {comment.votes}
          </Typography>
          <IconButton size="small" aria-label="Down vote"
                      className={classes.voteButton}
                      color={viewerVote === -1 ? 'secondary' : 'default'}
                      onClick={e => handleVote(e, -1)}>
            <ExpandMoreIcon fontSize="large"/>
          </IconButton>
          {
            viewerId === comment.user.id && (
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

const CREATE_COMMENT_VOTE_MUTATION = gql`
  mutation ($commentId: ID!, $value: CommentVoteValueEnum!) {
    createCommentVote (input: { comment: $commentId, value: $value }) {
      commentVote {
        value
      }
    }
  }
`

const DELETE_COMMENT_VOTE_MUTATION = gql`
  mutation ($voteId: ID!) {
    deleteCommentVote (input: { id: $voteId }) {
      result
    }
  }
`

CommentListItem.fragments = {
  comment: gql`
    fragment CommentListItem on Comment {
      id
      body
      votes
      createdAt
      user {
        id
        username
      }
      viewerVote {
        id
        value
      }
    }
  `
}
