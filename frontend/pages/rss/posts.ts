import { initApolloClient } from '../../src/apollo'
import { NextPageContext } from 'next'
import { getPostsRss } from '../../src/services/RssService'

interface Props {
  xml: string
}

const PostsRss = (props: Props) => props.xml

PostsRss.getInitialProps = async ({ query, res }: NextPageContext): Promise<Props | null> => {
  if (!res) {
    return null
  }
  res.setHeader('Content-Type', 'text/xml')
  const apolloClient = initApolloClient()
  const xml = await getPostsRss({
    apolloClient: apolloClient,
    feedUrlPath: 'rss/posts',
    minVotes: Number(query.minVotes) || 0
  })
  res.write(xml)
  res.end()
  return { xml }
}

export default PostsRss
