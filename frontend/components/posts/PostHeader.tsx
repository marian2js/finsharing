import React from 'react'
import Link from 'next/link'
import { Box, makeStyles, Typography } from '@material-ui/core'
import moment from 'moment'
import { Post } from '../../src/types/Post'
import gql from 'graphql-tag'
import { MarketPriceChange } from '../markets/MarketPriceChange'

const useStyles = makeStyles(theme => ({
  headerLink: {
    textDecoration: 'none',
    color: theme.palette.text.primary,
    '&:hover': {
      textDecoration: 'underline'
    }
  },
  priceChange: {
    marginLeft: '2px',
  },
}))

interface Props {
  post: Post
  showPriceChange: boolean
}

export const PostHeader = (props: Props) => {
  const classes = useStyles()
  const { post, showPriceChange } = props
  return (
    <Box mb={1}>
      <Typography variant="subtitle2" component="div">
        <Link href="/markets/[symbol]" as={`/markets/${post.market.symbol}`}>
          <a className={classes.headerLink}>
            <strong>
              {post.market.name}
            </strong>
          </a>
        </Link>
        {
          showPriceChange && (
            <>
              &nbsp;<MarketPriceChange market={post.market}
                                       variant="subtitle2"
                                       component="span"
                                       className={classes.priceChange}/>
            </>
          )
        }
        &nbsp;- Posted by&nbsp;
        <Link href="/users/[username]" as={`/users/${post.user.username}`}>
          <a className={classes.headerLink}>
          <span>
            {post.user.username}
          </span>
          </a>
        </Link>
        &nbsp;{moment(Number(post.createdAt)).fromNow()}
      </Typography>
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
        price
        priceClose
      }
      user {
        username
      }
    }
  `,
}

