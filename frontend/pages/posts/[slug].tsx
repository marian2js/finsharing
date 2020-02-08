import React, { useEffect, useState } from 'react'
import { Post } from '../../src/types/Post'
import { Comment } from '../../src/types/Comment'
import { Box, Card, CardContent, CircularProgress, Divider, Grid, makeStyles, Typography } from '@material-ui/core'
import { Layout } from '../../components/PageLayout/Layout'
import { MarkdownContent } from '../../components/MarkdownContent'
import { CommentForm } from '../../components/comments/CommentForm'
import Link from 'next/link'
import Error from 'next/error'
import Head from 'next/head'
import { withApollo } from '../../src/apollo'
import gql from 'graphql-tag'
import { useQuery } from '@apollo/react-hooks'
import { NextPageContext } from 'next'
import { UserService } from '../../src/services/UserService'
import { PostVotes } from '../../components/posts/PostVotes'
import { PostActions } from '../../components/posts/PostActions'
import { CommentList } from '../../components/comments/CommentList'
import { PostHeader } from '../../components/posts/PostHeader'

const useStyles = makeStyles(theme => ({
  marketLink: {
    textDecoration: 'none',
    color: theme.palette.text.primary,
    '&:hover': {
      textDecoration: 'underline'
    }
  }
}))

interface Props {
  slug: string
  authUserId?: string
}

const POST_QUERY = gql`
  query Post ($slug: String!) {
    post (slug: $slug) {
      id
      title
      slug
      body
      ...PostVotes
      ...PostActions
      ...PostHeader
    }
  }
  ${PostVotes.fragments.post}
  ${PostActions.fragments.post}
  ${PostHeader.fragments.post}
`

function PostPage (props: Props) {
  const classes = useStyles()
  const { loading, error, data } = useQuery(
    POST_QUERY,
    {
      variables: {
        slug: props.slug
      },
      notifyOnNetworkStatusChange: true,
    }
  )
  const { authUserId } = props
  const [post, setPost] = useState<Post>(data?.post)
  const [lastCommentAddedId, setLastCommentAddedId] = useState('')

  useEffect(() => {
    setPost(data?.post)
  }, [data])

  if (error) {
    return <Error title={error.message} statusCode={404}/>
  }

  if (loading || !post) {
    return <CircularProgress/>
  }

  const handleCommentAdded = (comment: Comment) => {
    setLastCommentAddedId(comment.id)
  }

  return (
    <Layout>
      <Head>
        <title>{post.title} - FinSharing.com</title>
      </Head>

      <Card>
        {/*<CardMedia
                component="img"
                alt="Contemplative Reptile"
                height="140"
                image="/static/images/cards/contemplative-reptile.jpg"
                title="Contemplative Reptile"/>*/}
        <Grid container>
          <Grid item xs={2} sm={1}>
            <PostVotes post={post}/>
          </Grid>
          <Grid item xs={10} sm={11}>
            <CardContent>
              <PostHeader post={post}/>

              <Typography gutterBottom variant="h5" component="h2">
                {post.title}
              </Typography>
              <MarkdownContent content={post.body}/>
            </CardContent>

            <Divider variant="middle"/>

            <PostActions post={post} authUserId={authUserId}/>
          </Grid>
        </Grid>
      </Card>

      <Box mt={2}>
        <Card>
          {
            authUserId ?
              <CommentForm post={post} onCommentAdd={handleCommentAdded}/> :
              <div>You need <Link href="/register"><a>a free account</a></Link> to comment.</div>
          }
        </Card>
      </Box>

      <Box mt={2}>
        <CommentList post={post}
                     authUserId={authUserId}
                     lastCommentAddedId={lastCommentAddedId}/>
      </Box>


    </Layout>
  )
}

PostPage.getInitialProps = async (ctx: NextPageContext): Promise<Props> => {
  const slug = Array.isArray(ctx.query.slug) ? ctx.query.slug[0] : ctx.query.slug
  return {
    authUserId: new UserService(ctx).getViewer()?.id,
    slug,
  }
}

export default withApollo(PostPage)
