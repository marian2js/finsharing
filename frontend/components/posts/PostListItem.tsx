import { Post } from '../../src/types/Post'
import { parseUrl } from '../../src/utils/string'
import Link from 'next/link'
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
  makeStyles,
  Typography,
  useMediaQuery
} from '@material-ui/core'
import { PostVotes } from './PostVotes'
import { PostHeader } from './PostHeader'
import { PostActions } from './PostActions'
import React from 'react'
import theme from '../../src/theme'
import gql from 'graphql-tag'

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
  post: Post
  viewerId: string | undefined
}

export const PostListItem = (props: Props) => {
  const classes = useStyles()
  const { post, viewerId } = props
  const imageUrl = post.smImageUrl && parseUrl(post.smImageUrl)

  // xs screens show the image at the top of the card, larger screens do it at the right
  const showImageOnTop = useMediaQuery(theme.breakpoints.down('xs'))

  return (
    <Link href="/posts/[slug]" as={`/posts/${post.slug}`}>
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
}

PostListItem.fragments = {
  post: gql`
    fragment PostListItem on Post {
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

