import React, { useContext } from 'react'
import Head from 'next/head'
import gql from 'graphql-tag'
import { NextPageContext } from 'next'
import { withApollo } from '../../src/apollo'
import { useQuery } from '@apollo/react-hooks'
import Error from 'next/error'
import { Box, CircularProgress, Typography } from '@material-ui/core'
import { User } from '../../src/types/User'
import { PostList } from '../../components/posts/PostList'
import { ViewerContext } from '../../components/providers/ViewerContextProvider'

const USER_QUERY = gql`
  query ($username: String!) {
    user(username: $username) {
      id
      username
      numberOfPosts
      numberOfComments
    }
  }
`

interface Props {
  username: string
}

const UserPage = (props: Props) => {
  const { viewer } = useContext(ViewerContext)
  const { loading, error, data } = useQuery(
    USER_QUERY,
    {
      variables: {
        username: props.username
      },
      notifyOnNetworkStatusChange: true,
    }
  )

  if (error) {
    return <Error title={error.message} statusCode={404}/>
  }

  if (loading) {
    return <CircularProgress/>
  }

  const user: User = data.user

  return (
    <>
      <Head>
        <title>{user.username} on FinSharing.com</title>
      </Head>

      <Box mb={2}>
        <Typography gutterBottom variant="h4" component="h1">
          {user.username}
        </Typography>
        <Typography gutterBottom variant="subtitle2" component="p">
          Number of posts: {user.numberOfPosts || 0}
        </Typography>
        <Typography gutterBottom variant="subtitle2" component="p">
          Number of comments: {user.numberOfComments || 0}
        </Typography>
      </Box>

      <PostList viewerId={viewer?.id} userId={user.id}/>
    </>
  )
}

UserPage.getInitialProps = async (ctx: NextPageContext): Promise<Props> => {
  const username = Array.isArray(ctx.query.username) ? ctx.query.username[0] : ctx.query.username
  return {
    username,
  }
}

export default withApollo(UserPage)
