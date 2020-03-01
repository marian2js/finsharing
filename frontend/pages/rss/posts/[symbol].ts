import { NextPageContext } from 'next'
import gql from 'graphql-tag'
import { initApolloClient } from '../../../src/apollo'
import { getPostsRss } from '../../../src/services/RssService'

interface Props {
  xml: string
}

const MarketPostsRss = (props: Props) => props.xml

const MARKET_QUERY = gql`
  query Market ($symbol: String!) {
    market(symbol: $symbol) {
      id
    }
  }
`

MarketPostsRss.getInitialProps = async ({ query, res }: NextPageContext): Promise<Props | null> => {
  if (!res) {
    return null
  }
  res.setHeader('Content-Type', 'text/xml')
  const apolloClient = initApolloClient()
  const symbol = (Array.isArray(query.symbol) ? query.symbol[0] : query.symbol).toUpperCase()
  const { data } = await apolloClient.query({
    query: MARKET_QUERY,
    variables: {
      symbol,
    }
  })
  const xml = await getPostsRss({
    apolloClient: apolloClient,
    feedUrlPath: `rss/posts/${symbol}`,
    minVotes: Number(query.minVotes) || 0,
    marketId: data.market.id,
  })
  res.write(xml)
  res.end()
  return { xml }
}

export default MarketPostsRss
