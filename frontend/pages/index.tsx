import * as React from 'react'
import { useState } from 'react'
import Head from 'next/head'
import { withApollo } from '../src/apollo'
import { Alert } from '@material-ui/lab'
import QuestionAnswerIcon from '@material-ui/icons/QuestionAnswer'
import { Box, Card, CardContent, Tabs, Typography } from '@material-ui/core'
import Link from 'next/link'
import { FollowingPostList } from '../components/posts/lists/FollowingPostList'
import { AllPostList } from '../components/posts/lists/AllPostList'
import { TabPanel } from '../components/TabPanel'
import { PostListTab } from '../components/posts/lists/PostListTab'
import { useViewer } from '../src/services/UserHooks'

function IndexPage () {
  const { viewer } = useViewer()
  const [tabIndex, setTabIndex] = useState(viewer?.id ? 0 : 1)

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

      {
        !viewer?.id && (
          <Card>
            <CardContent>
              <Typography variant="body1">
                👋 Welcome to our community for investors.&nbsp;
                <Link href="/register"><a>Join for free</a></Link> to customize your watchlist
                and participate on discussions.
              </Typography>
            </CardContent>
          </Card>
        )
      }

      <Box mb={2}>
        <Tabs value={tabIndex} onChange={(_, i) => setTabIndex(i)}
              indicatorColor="primary"
              textColor="primary"
              centered
              aria-label="post list tabs">
          <PostListTab label="Following"/>
          <PostListTab label="All"/>
        </Tabs>
      </Box>
      <TabPanel value={tabIndex} index={0}>
        {
          viewer?.id ? <FollowingPostList viewerId={viewer!.id}/> : (
            <Box mb={2}>
              <Alert color="warning" icon={<QuestionAnswerIcon/>}>
                Welcome to the best community for investors.
                You need a <Link href="/register"><a style={{ display: 'contents' }}>free account</a></Link>
                &nbsp;in order to personalize your homepage.
              </Alert>
            </Box>
          )
        }
      </TabPanel>

      <TabPanel value={tabIndex} index={1}>
        <AllPostList viewerId={viewer?.id}/>
      </TabPanel>
    </>
  )
}

export default withApollo(IndexPage)
