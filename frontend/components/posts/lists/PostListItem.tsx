import { Post } from '../../../src/types/Post'
import { parseUrl } from '../../../src/utils/string'
import Link from 'next/link'
import {
  Box,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  makeStyles,
  Typography,
  useMediaQuery
} from '@material-ui/core'
import { PostVotes } from '../PostVotes'
import { PostHeader } from '../PostHeader'
import { PostActions } from '../PostActions'
import React from 'react'
import theme from '../../../src/theme'
import gql from 'graphql-tag'

const useStyles = makeStyles(theme => ({
  card: {
    display: 'flex',
    marginBottom: theme.spacing(2)
  },
  content: {
    flex: '1 0 auto',
    paddingBottom: 0,
  },
  titleLink: {
    textDecoration: 'none',
    color: theme.palette.text.primary,
  },
  postTitle: {
    marginBottom: 0,
  },
  details: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  postImageContainer: {
    padding: theme.spacing(0, 1),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  postImage: { // ratio 16:12
    width: 104,
    height: 78,
  },
}))

interface Props {
  post: Post
  viewerId: string | undefined
  showPriceChange: boolean
}

export const PostListItem = (props: Props) => {
  const classes = useStyles()
  const { post, viewerId, showPriceChange } = props
  const imageUrl = post.smImageUrl && parseUrl(post.smImageUrl)

  const xsDownScreen = useMediaQuery(theme.breakpoints.down('xs'))

  return (
    <Link href="/posts/[slug]" as={`/posts/${post.slug}`}>
      <Card className={classes.card}>
        <div className={classes.details}>
          <CardActionArea component="div">
            {
              // xs screens show the image at the top of the card, larger screens do it at the right
              xsDownScreen && imageUrl && (
                <CardMedia
                  component="img"
                  height="140"
                  image={imageUrl}
                  title={post.title}
                />
              )
            }

            <Grid container>
              {
                !xsDownScreen && imageUrl && (
                  <Grid item sm={1} className={classes.postImageContainer}>
                    <CardMedia
                      component="img"
                      className={classes.postImage}
                      image={imageUrl}
                      title={post.title}
                    />
                  </Grid>
                )
              }

              <Grid item xs={12} sm={11}>
                <Box ml={xsDownScreen ? 0 : 2}>
                  <CardContent className={classes.content}>
                    <PostHeader post={post} showPriceChange={showPriceChange}/>
                    <Link key={post.slug} href="/posts/[slug]" as={`/posts/${post.slug}`}>
                      <a className={classes.titleLink}>
                        <Typography gutterBottom variant="h5" component="h2" className={classes.postTitle}>
                          {post.title}
                        </Typography>
                      </a>
                    </Link>
                  </CardContent>
                  <CardActions>
                    <PostVotes post={post} viewerId={viewerId} size="small"/>
                    <PostActions post={post}/>
                  </CardActions>
                </Box>
              </Grid>
            </Grid>
          </CardActionArea>
        </div>
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

