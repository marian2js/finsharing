import * as React from 'react'
import { Layout } from '../components/PageLayout/Layout'
import Head from 'next/head'
import { PostList } from '../components/posts/PostList'
import { withApollo } from '../src/apollo'
import { NextPageContext } from 'next'
import { AuthService } from '../src/services/AuthService'

interface Props {
  viewerId: string | undefined
}

function IndexPage (props: Props) {
  return (
    <Layout>
      <Head>
        <title>FinSharing.com</title>
      </Head>

      <PostList viewerId={props.viewerId}/>
    </Layout>
  )
}

IndexPage.getInitialProps = async (ctx: NextPageContext): Promise<Props> => {
  return {
    viewerId: new AuthService(ctx).getViewer()?.id,
  }
}

export default withApollo(IndexPage)
