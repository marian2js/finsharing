import React, { FormEvent, useState } from 'react'
import { Button, Grid, makeStyles, TextField } from '@material-ui/core'
import { MessageSnackbar } from '../MessageSnackbar'
import { Post } from '../../src/types/Post'
import { Comment } from '../../src/types/Comment'
import gql from 'graphql-tag'
import { useMutation } from '@apollo/react-hooks'

const useStyles = makeStyles(theme => ({
  form: {
    margin: theme.spacing(0, 4)
  },
  bodyField: {
    '& textarea': {
      minHeight: '80px',
    }
  },
  submitButton: {
    float: 'right',
    margin: theme.spacing(1, 0),
  },
}))

type NewCommentProps = {
  post: Post
  onCommentAdd: (comment: Comment) => void
}

type UpdateCommentProps = {
  comment: Comment
  onCommentUpdate: (comment: Comment) => void
}

type Props = NewCommentProps | UpdateCommentProps

export const CommentForm = (props: Props) => {
  const classes = useStyles()
  const [createComment] = useMutation(CREATE_COMMENT_MUTATION)
  const [updateComment] = useMutation(UPDATE_COMMENT_MUTATION)
  const [upvoteComment] = useMutation(UPVOTE_COMMENT_MUTATION)

  const [body, setBody] = useState((props as UpdateCommentProps).comment?.body || '')
  const [message, setMessage] = useState()
  const newComment = (props as NewCommentProps).post

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      if (newComment) {
        const newCommentProps = props as NewCommentProps
        const res = await createComment({
          variables: {
            body,
            postId: newCommentProps.post.id,
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
              slug: newCommentProps.post.slug
            }
          }]
        })

        // Up vote the comment after creating it
        try {
          await upvoteComment({
            variables: {
              commentId: res.data.createComment.comment.id,
            }
          })
        } catch (e) {}

        newCommentProps.onCommentAdd(res.data.createComment.comment)
        setMessage({ text: 'Comment added', severity: 'success' })
        setBody('')
      } else {
        const updateCommentProps = props as UpdateCommentProps
        const res = await updateComment({
          variables: {
            body,
            commentId: updateCommentProps.comment.id
          }
        })
        updateCommentProps.onCommentUpdate(res.data.updateComment.comment)
        setMessage({ text: 'Comment updated', severity: 'success' })
      }
    } catch (e) {
      setMessage({ text: e.message, severity: 'error' })
    }
  }

  return (
    <form onSubmit={handleSubmit} className={classes.form}>
      <Grid container>
        <Grid item xs={12}>
          <TextField
            className={classes.bodyField}
            label="Comment"
            placeholder="What do you think?"
            onChange={e => setBody(e.target.value)}
            value={body}
            required
            multiline
            name="comment"
            type="number"
            variant="outlined"
            margin="normal"
            helperText="Markdown is supported"
            fullWidth/>
        </Grid>
      </Grid>

      <Grid item xs={12}>
        <Button type="submit" size="large" variant="contained" color="primary" className={classes.submitButton}>
          {newComment ? 'Comment' : 'Update'}
        </Button>
      </Grid>

      <MessageSnackbar message={message}/>
    </form>
  )
}

CommentForm.fragments = {
  comment: gql`
    fragment CommentForm on Comment {
      id
      body
      user {
        id
        username
      }
    }
  `,
}

const CREATE_COMMENT_MUTATION = gql`
  mutation ($postId: ID!, $body: String!) {
    createComment (input: { post: $postId, body: $body }) {
      comment {
        ...CommentForm
      }
    }
  }
  ${CommentForm.fragments.comment}
`

const UPDATE_COMMENT_MUTATION = gql`
  mutation ($commentId: ID!, $body: String!) {
    updateComment (input: { id: $commentId, body: $body }) {
      comment {
        ...CommentForm
      }
    }
  }
  ${CommentForm.fragments.comment}
`

const UPVOTE_COMMENT_MUTATION = gql`
  mutation ($commentId: ID!) {
    createCommentVote (input: { comment: $commentId, value: POSITIVE_1 }) {
      commentVote {
        id
        value
      }
    }
  }
`
