import React from 'react'
import gql from 'graphql-tag'
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  CircularProgress,
  Grid,
  makeStyles,
  Typography,
  useMediaQuery
} from '@material-ui/core'
import Link from 'next/link'
import { useQuery } from '@apollo/react-hooks'
import { Market } from '../../src/types/Market'
import { PostVotes } from './PostVotes'
import { PostActions } from './PostActions'
import { Post } from '../../src/types/Post'
import { PostHeader } from './PostHeader'
import { parseUrl } from '../../src/utils/string'
import theme from '../../src/theme'

const useStyles = makeStyles(theme => ({
  card: {
    display: 'flex',
    marginBottom: theme.spacing(2)
  },
  titleLink: {
    textDecoration: 'none',
    color: theme.palette.text.primary,
  },
  details: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    flex: '1 0 auto',
  },
  imageRight: {
    width: 150,
  },
}))

interface Props {
  market?: Market
  userId?: string
  viewerId: string | undefined
}

export const PostList = (props: Props) => {
  const classes = useStyles()
  const { market, userId, viewerId } = props
  const { loading, error, data, fetchMore, networkStatus } = useQuery(
    market ? MARKET_LAST_POSTS_QUERY : (userId ? USER_LAST_POSTS_QUERY : LAST_POSTS_QUERY),
    {
      variables: {
        marketId: market?.id,
        userId,
      },
      notifyOnNetworkStatusChange: true,
    }
  )

  // xs screens show the image at the top of the card, larger screens do it at the right
  const showImageOnTop = useMediaQuery(theme.breakpoints.down('xs'))

  if (error) {
    return <div>Unknown error rendering the list of posts</div>
  }

  if (loading) {
    return <CircularProgress/>
  }

  const posts = data.posts.nodes as Post[]

  return (
    <>
      {
        posts.map(post => {
          const imageUrl = post.smImageUrl && parseUrl(post.smImageUrl)

          return (
            <Link key={post.slug} href="/posts/[slug]" as={`/posts/${post.slug}`}>
              <Card className={classes.card}>
                <div className={classes.details}>
                  <CardActionArea component="div">
                    {
                      showImageOnTop && imageUrl && (
                        <CardMedia
                          component="img"
                          height="140"
                          image={imageUrl}
                          title={post.title}
                        />
                      )
                    }

                    <Grid container>
                      <Grid item xs={2} sm={1}>
                        <PostVotes post={post} viewerId={viewerId}/>
                      </Grid>
                      <Grid item xs={10} sm={11}>
                        <CardContent className={classes.content}>
                          <PostHeader post={post}/>

                          <Link key={post.slug} href="/posts/[slug]" as={`/posts/${post.slug}`}>
                            <a className={classes.titleLink}>
                              <Typography gutterBottom variant="h5" component="h2">
                                {post.title}
                              </Typography>
                            </a>
                          </Link>
                        </CardContent>
                        <PostActions post={post}/>
                      </Grid>
                    </Grid>
                  </CardActionArea>
                </div>
                {
                  !showImageOnTop && imageUrl && (
                    <CardMedia
                      className={classes.imageRight}
                      image={imageUrl}
                      title={post.title}
                    />
                  )
                }
              </Card>
            </Link>
          )
        })
      }
    </>
  )
}

PostList.fragments = {
  post: gql`
    fragment PostList on Post {
      title
      slug
      smImageUrl
      ...PostHeader
      ...PostVotes
      ...PostActions
    }
    ${PostHeader.fragments.post}
    ${PostVotes.fragments.post}
    ${PostActions.fragments.post}
  `,
}

const LAST_POSTS_QUERY = gql`
  {
    posts (orderBy: [{ createdAt: DESC }]) {
      nodes {
        ...PostList

      }
    }
  }
  ${PostList.fragments.post}
`

const MARKET_LAST_POSTS_QUERY = gql`
  query Posts ($marketId: ID!) {
    posts (filter: { market: { value: $marketId } }, orderBy: [{ createdAt: DESC }]) {
      nodes {
        ...PostList
      }
    }
  }
  ${PostList.fragments.post}
`

const USER_LAST_POSTS_QUERY = gql`
  query Posts ($userId: ID!) {
    posts (filter: { user: { value: $userId } }, orderBy: [{ createdAt: DESC }]) {
      nodes {
        ...PostList
      }
    }
  }
  ${PostList.fragments.post}
`
