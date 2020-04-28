import React from 'react'
import Head from 'next/head'
import { Card, CardContent } from '@material-ui/core'
import { PostForm } from '../components/posts/PostForm'
import { withApollo } from '../src/apollo'

function NewPostPage () {
  return (
    <>
      <Head>
        <title>✍️ Write a post</title>
      </Head>

      <Card>
        <CardContent>
          <PostForm/>
        </CardContent>
      </Card>
    </>
  )
}

export default withApollo(NewPostPage)
