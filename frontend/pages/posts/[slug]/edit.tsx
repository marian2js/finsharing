import React, { useEffect, useState } from 'react'
import { NextPageContext } from 'next'
import { PostForm } from '../../../components/posts/PostForm'
import Head from 'next/head'
import { Card, CardContent, CircularProgress } from '@material-ui/core'
import { Layout } from '../../../components/PageLayout/Layout'
import { withApollo } from '../../../src/apollo'
import gql from 'graphql-tag'
import { useQuery } from '@apollo/react-hooks'
import Error from 'next/error'

interface Props {
  slug: string
  error?: string
}

const POST_QUERY = gql`
  query Post ($slug: String!) {
    post (slug: $slug) {
      id
      title
      slug
      body
      market {
        id
      }
    }
  }
`

function EditPostPage (props: Props) {
  const { loading, error, data, fetchMore, networkStatus } = useQuery(
    POST_QUERY,
    {
      variables: {
        slug: props.slug
      },
      notifyOnNetworkStatusChange: true,
    }
  )

  const [post, setPost] = useState(data?.post)

  useEffect(() => {
    setPost(data?.post)
  }, [data])

  if (error) {
    return <Error title={error.message} statusCode={404}/>
  }

  if (loading || !post) {
    return <CircularProgress/>
  }

  return (
    <Layout>
      <Head>
        <title>Edit {post.title}</title>
      </Head>

      <Card>
        <CardContent>
          <PostForm post={post}/>
        </CardContent>
      </Card>
    </Layout>
  )
}

EditPostPage.getInitialProps = async (ctx: NextPageContext): Promise<Props> => ({
  slug: Array.isArray(ctx.query.slug) ? ctx.query.slug[0] : ctx.query.slug
})

export default withApollo(EditPostPage)
