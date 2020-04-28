import * as React from 'react'
import { useContext } from 'react'
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

  const url = 'https://finsharing.com'
  const title = 'FinSharing.com'
  const description = 'Community for Stock Market discussions, ideas and investment strategies.'
  const image = 'https://finsharing.com/finsharing.png'

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description}/>
        <meta property="og:title" content={title}/>
        <meta property="og:url" content={url}/>
        <meta name="twitter:title" content={title}/>
        <meta name="twitter:description" content={description}/>
        <link rel="canonical" href={url}/>
        <meta property="og:image" content={image}/>
        <meta name="twitter:image" content={image}/>
      </Head>

      <div>
        {welcomeMessage}
      </div>

      <PostList viewerId={viewer?.id}/>
    </>
  )
}

export default withApollo(IndexPage)
