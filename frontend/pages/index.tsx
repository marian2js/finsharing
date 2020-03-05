import * as React from 'react'
import { Layout } from '../components/PageLayout/Layout'
import Head from 'next/head'
import { PostList } from '../components/posts/PostList'
import { withApollo } from '../src/apollo'
import { NextPageContext } from 'next'
import { AuthService } from '../src/services/AuthService'
import { Alert } from '@material-ui/lab'
import QuestionAnswerIcon from '@material-ui/icons/QuestionAnswer'
import { Box } from '@material-ui/core'
import Link from 'next/link'

interface Props {
  viewerId: string | undefined
}

function IndexPage (props: Props) {
  const { viewerId } = props

  const welcomeMessage = !viewerId && (
    <Box mb={2}>
      <Alert color="warning" icon={<QuestionAnswerIcon/>}>
        Welcome to our community for investors. <Link href="/register"><a style={{ display: 'contents' }}>Sign
        Up</a></Link> for free to get started.
      </Alert>
    </Box>
  )

  return (
    <Layout>
      <Head>
        <title>FinSharing.com</title>
      </Head>

      <div>
        {welcomeMessage}
      </div>

      <PostList viewerId={viewerId}/>
    </Layout>
  )
}

IndexPage.getInitialProps = async (ctx: NextPageContext): Promise<Props> => {
  return {
    viewerId: new AuthService(ctx).getViewer()?.id,
  }
}

export default withApollo(IndexPage)
