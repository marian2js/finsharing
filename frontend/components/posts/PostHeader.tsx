import React from 'react'
import Link from 'next/link'
import { Box, makeStyles, Typography } from '@material-ui/core'
import moment from 'moment'
import { Post } from '../../src/types/Post'
import gql from 'graphql-tag'

interface Props {
  post: Post
}

const useStyles = makeStyles(theme => ({
  headerLink: {
    textDecoration: 'none',
    color: theme.palette.text.primary,
    '&:hover': {
      textDecoration: 'underline'
    }
  }
}))

export const PostHeader = (props: Props) => {
  const classes = useStyles()
  const { post } = props
  return (
    <Box mb={1}>
      <Link href="/markets/[symbol]" as={`/markets/${post.market.symbol}`}>
        <a className={classes.headerLink}>
          <Typography gutterBottom variant="subtitle2" component="span">
            {post.market.name}
          </Typography>
        </a>
      </Link> - Posted by&nbsp;
      <Link href="/users/[username]" as={`/users/${post.user.username}`}>
        <a className={classes.headerLink}>
          <span>
            {post.user.username}
          </span>
        </a>
      </Link>
      &nbsp;{moment(Number(post.createdAt)).fromNow()}
    </Box>
  )
}

PostHeader.fragments = {
  post: gql`
    fragment PostHeader on Post {
      createdAt
      market {
        name
        symbol
      }
      user {
        username
      }
    }
  `,
}

