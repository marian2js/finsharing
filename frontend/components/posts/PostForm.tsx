import React, { FormEvent, useState } from 'react'
import { Button, Grid, makeStyles, TextField } from '@material-ui/core'
import { MessageSnackbar } from '../MessageSnackbar'
import Router from 'next/router'
import { MarketSelector } from '../markets/MarketSelector'
import { Post } from '../../src/types/Post'
import gql from 'graphql-tag'
import { useMutation } from '@apollo/react-hooks'
import { getImage } from '../../src/utils/markdown'

const useStyles = makeStyles(theme => ({
  bodyField: {
    '& textarea': {
      minHeight: '160px',
    }
  },
  actionButtons: {
    float: 'right',
    margin: theme.spacing(3, 0),
  },
  cancelButton: {
    marginRight: theme.spacing(2)
  },
}))

interface Props {
  post?: Post
}

const CREATE_COMMENT_MUTATION = gql`
  mutation ($marketId: ID!, $title: String!, $body: String!, $smImageUrl: String, $lgImageUrl: String!) {
    createPost (input: { market: $marketId, title: $title, body: $body, smImageUrl: $smImageUrl, lgImageUrl: $lgImageUrl }) {
      post {
        slug
      }
    }
  }
`

const UPDATE_COMMENT_MUTATION = gql`
  mutation ($slug: String!, $title: String!, $body: String!, $smImageUrl: String, $lgImageUrl: String!) {
    updatePost (input: { slug: $slug, title: $title, body: $body, smImageUrl: $smImageUrl, lgImageUrl: $lgImageUrl }) {
      post {
        slug
      }
    }
  }
`

export const PostForm = (props: Props) => {
  const classes = useStyles()

  const [market, setMarket] = useState(props.post?.market?.id || '')
  const [title, setTitle] = useState(props.post?.title || '')
  const [body, setBody] = useState(props.post?.body || '')
  const [message, setMessage] = useState()
  const [createPost] = useMutation(CREATE_COMMENT_MUTATION)
  const [updatePost] = useMutation(UPDATE_COMMENT_MUTATION)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      let postSlug: string
      if (props.post) {
        const res = await updatePost({
          variables: {
            slug: props.post.slug,
            title,
            body,
            smImageUrl: getImage(body, 'small') || undefined,
            lgImageUrl: getImage(body, 'large') || undefined,
          }
        })
        postSlug = res.data.updatePost.post.slug
      } else {
        const res = await createPost({
          variables: {
            marketId: market,
            title,
            body,
            smImageUrl: getImage(body, 'small') || undefined,
            lgImageUrl: getImage(body, 'large') || undefined,
          }
        })
        postSlug = res.data.createPost.post.slug
      }
      await Router.push('/posts/[slug]', `/posts/${postSlug}`)
    } catch (e) {
      setMessage({ text: e.message, severity: 'error' })
    }
  }

  const handleCancel = async () => {
    await Router.push('/posts/[slug]', `/posts/${props.post!.slug}`)
  }

  return (
    <form onSubmit={handleSubmit}>
      <Grid container>
        {
          !props.post && (
            <Grid item xs={12}>
              <MarketSelector value={market} onChange={setMarket}/>
            </Grid>
          )
        }

        <Grid item xs={12}>
          <TextField
            label="Title"
            onChange={e => setTitle(e.target.value)}
            value={title}
            required
            name="title"
            variant="outlined"
            margin="normal"
            fullWidth/>
        </Grid>

        <Grid item xs={12}>
          <TextField
            className={classes.bodyField}
            label="Body"
            onChange={e => setBody(e.target.value)}
            value={body}
            required
            multiline
            name="body"
            type="number"
            variant="outlined"
            margin="normal"
            helperText="Markdown is supported"
            fullWidth/>
        </Grid>
      </Grid>

      <Grid item xs={12} className={classes.actionButtons}>
        {
          props.post && (
            <Button onClick={handleCancel} type="button" size="large" variant="contained" color="default"
                    className={classes.cancelButton}>
              Cancel
            </Button>
          )
        }
        <Button type="submit" size="large" variant="contained" color="primary">
          {props.post ? 'Update' : 'Post'}
        </Button>
      </Grid>

      <MessageSnackbar message={message}/>
    </form>
  )
}
