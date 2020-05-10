import React, { FormEvent, useState } from 'react'
import { Button, Grid, makeStyles, TextField, Typography } from '@material-ui/core'
import { MessageSnackbar, MessageSnackbarType } from '../MessageSnackbar'
import Router from 'next/router'
import { MarketSelector } from '../markets/MarketSelector'
import { Post } from '../../src/types/Post'
import gql from 'graphql-tag'
import { useMutation } from '@apollo/react-hooks'
import { getImage } from '../../src/utils/markdown'
import LinkIcon from '@material-ui/icons/Link'
import { ShareLinkDialog } from './ShareLinkDialog'
import { MarkdownBody } from '../body/MarkdownBody'

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
  previewButton: {
    marginRight: theme.spacing(2)
  },
  shareLinkButton: {
    marginTop: theme.spacing(2),
    textTransform: 'none',
  },
}))

interface Props {
  post?: Post
}

export const PostForm = (props: Props) => {
  const classes = useStyles()

  const [market, setMarket] = useState(props.post?.market?.id || '')
  const [title, setTitle] = useState(props.post?.title || '')
  const [body, setBody] = useState(props.post?.body || '')
  const [linkImage, setLinkImage] = useState('')
  const [message, setMessage] = useState<MessageSnackbarType>()
  const [shareLinkDialogOpen, setShareLinkDialogOpen] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)

  const [createPost] = useMutation(CREATE_POST_MUTATION)
  const [updatePost] = useMutation(UPDATE_POST_MUTATION)
  const [upvotePost] = useMutation(UPVOTE_POST_MUTATION)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      let postSlug: string
      const postImage = getImage(body) || linkImage || undefined
      if (props.post) {
        const res = await updatePost({
          variables: {
            slug: props.post.slug,
            title,
            body,
            smImageUrl: postImage,
            lgImageUrl: postImage,
          }
        })
        postSlug = res.data.updatePost.post.slug
      } else {
        const res = await createPost({
          variables: {
            marketId: market,
            title,
            body,
            smImageUrl: postImage,
            lgImageUrl: postImage,
          }
        })
        postSlug = res.data.createPost.post.slug

        // Up vote the post after creating it
        try {
          await upvotePost({
            variables: {
              postId: res.data.createPost.post.id
            }
          })
        } catch (e) {}

      }
      await Router.push('/posts/[slug]', `/posts/${postSlug}`)
    } catch (e) {
      setMessage({ text: e.message, severity: 'error' })
    }
  }

  const handleLinkShare = (data: { markdown: string, title?: string, image?: string }) => {
    if (!title.trim() && data.title) {
      setTitle(data.title)
    }
    if (!linkImage && data.image) {
      setLinkImage(data.image)
    }
    setBody(body.trim() ? `${body.trim()}\n\n${data.markdown}\n\n` : `${data.markdown}\n\n`)
    setShareLinkDialogOpen(false)
  }

  const handleCancel = async () => {
    await Router.push('/posts/[slug]', `/posts/${props.post!.slug}`)
  }

  const renderPostForm = () => {
    return (
      <Grid container>
        {
          !props.post && (
            <Grid item xs={12}>
              <MarketSelector value={market} onChange={market => setMarket(market.id)}/>
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

        <Button onClick={() => setShareLinkDialogOpen(true)}
                variant="contained"
                color="default"
                startIcon={<LinkIcon/>}
                className={classes.shareLinkButton}>
          Share a link
        </Button>

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
    )
  }

  const renderPreviewPost = () => {
    return (
      <>
        <Typography gutterBottom variant="h5">
          {title}
        </Typography>
        <MarkdownBody content={body}/>
      </>
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      {previewMode ? renderPreviewPost() : renderPostForm()}

      <Grid item xs={12} className={classes.actionButtons}>
        {
          body && (
            <Button onClick={() => setPreviewMode(!previewMode)} size="large" variant="contained" color="default"
                    className={classes.previewButton}>
              {previewMode ? 'Continue Editing' : 'Preview'}
            </Button>
          )
        }
        <Button type="submit" size="large" variant="contained" color="primary">
          {props.post ? 'Update' : 'Post'}
        </Button>
      </Grid>

      <MessageSnackbar message={message}/>

      <ShareLinkDialog open={shareLinkDialogOpen}
                       includeCardTitle={!!title}
                       onCancel={() => setShareLinkDialogOpen(false)}
                       onLinkShared={handleLinkShare}/>
    </form>
  )
}

const CREATE_POST_MUTATION = gql`
  mutation ($marketId: ID!, $title: String!, $body: String!, $smImageUrl: String, $lgImageUrl: String) {
    createPost (input: { market: $marketId, title: $title, body: $body, smImageUrl: $smImageUrl, lgImageUrl: $lgImageUrl }) {
      post {
        id
        slug
      }
    }
  }
`

const UPDATE_POST_MUTATION = gql`
  mutation ($slug: String!, $title: String!, $body: String!, $smImageUrl: String, $lgImageUrl: String) {
    updatePost (input: { slug: $slug, title: $title, body: $body, smImageUrl: $smImageUrl, lgImageUrl: $lgImageUrl }) {
      post {
        slug
        title
        body
      }
    }
  }
`

const UPVOTE_POST_MUTATION = gql`
  mutation ($postId: ID!) {
    createPostVote (input: { post: $postId, value: POSITIVE_1 }) {
      postVote {
        id
        value
      }
    }
  }
`
