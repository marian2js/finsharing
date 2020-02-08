import React from 'react'
import Head from 'next/head'
import { Card, CardContent } from '@material-ui/core'
import { Layout } from '../components/PageLayout/Layout'
import { PostForm } from '../components/posts/PostForm'
import { withApollo } from '../src/apollo'

function NewPostPage () {
  return (
    <Layout>
      <Head>
        <title>✍️ Write a post</title>
      </Head>

      <Card>
        <CardContent>
          <PostForm/>
        </CardContent>
      </Card>
    </Layout>
  )
}

export default withApollo(NewPostPage)
