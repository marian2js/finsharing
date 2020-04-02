import * as React from 'react'
import { useContext } from 'react'
import { Layout } from '../components/PageLayout/Layout'
import Head from 'next/head'
import { PostList } from '../components/posts/PostList'
import { withApollo } from '../src/apollo'
import { Alert } from '@material-ui/lab'
import QuestionAnswerIcon from '@material-ui/icons/QuestionAnswer'
import { Box } from '@material-ui/core'
import Link from 'next/link'
import { ViewerContext } from '../components/providers/ViewerContextProvider'

function IndexPage () {
  const { viewer } = useContext(ViewerContext)

  const welcomeMessage = !viewer?.id && (
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

      <PostList viewerId={viewer?.id}/>
    </Layout>
  )
}

export default withApollo(IndexPage)
