import { Post } from '../types/Post'
import RSS from 'rss'
import { getPlainText } from '../utils/markdown'
import gql from 'graphql-tag'
import { ApolloClient } from 'apollo-client'

interface GetPostsRssParams {
  apolloClient: ApolloClient<any>
  feedUrlPath: string
  minVotes: number
  marketId?: string
}

export async function getPostsRss ({
  apolloClient,
  feedUrlPath,
  minVotes,
  marketId
}: GetPostsRssParams) {
  const { data } = await apolloClient.query({
    query: marketId ? RSS_MARKET_POSTS_QUERY : RSS_POSTS_QUERY,
    variables: {
      minVotes: minVotes || 0,
      marketId,
    },
  })
  const posts: Post[] = data.posts.nodes
  const rss = new RSS({
    title: 'FinSharing.com - RSS',
    feed_url: `https://finsharing.com/${feedUrlPath}`,
    site_url: 'https://finsharing.com',
    ttl: marketId ? 30 : 10,
  })
  for (const post of posts) {
    rss.item({
      title: `${post.title} $${post.market.symbol.toUpperCase().replace('^', '')}`,
      description: getPlainText(post.body).slice(0, 300).trim(),
      url: `https://finsharing.com/posts/${post.slug}`,
      guid: post.slug,
      date: new Date(Number(post.createdAt)),
    })
  }
  return rss.xml()
}

const RSS_POSTS_FRAGMENT = gql`
  fragment RssPosts on PostConnection {
    nodes {
      title
      slug
      body
      createdAt
      market {
        symbol
      }
    }
  }
`

const RSS_POSTS_QUERY = gql`
  query Posts ($minVotes: Float!) {
    posts (first: 10, orderBy: [{ createdAt: DESC }], filter: { votes: { value: $minVotes, comparator: GREATER_THAN_OR_EQUAL } }) {
      ...RssPosts
    }
  }
  ${RSS_POSTS_FRAGMENT}
`

const RSS_MARKET_POSTS_QUERY = gql`
  query Posts ($marketId: ID!, $minVotes: Float!) {
    posts (
      first: 10,
      orderBy: [{ createdAt: DESC }],
      filter: { market: { value: $marketId }, votes: { value: $minVotes, comparator: GREATER_THAN_OR_EQUAL } }
    ) {
      ...RssPosts
    }
  }
  ${RSS_POSTS_FRAGMENT}
`
