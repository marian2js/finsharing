import * as React from 'react'
import { Layout } from '../components/PageLayout/Layout'
import Head from 'next/head'
import { PostList } from '../components/posts/PostList'
import { withApollo } from '../src/apollo'

function IndexPage () {
  return (
    <Layout>
      <Head>
        <title>FinSharing.com</title>
      </Head>

      <PostList/>
    </Layout>
  )
}

export default withApollo(IndexPage)
