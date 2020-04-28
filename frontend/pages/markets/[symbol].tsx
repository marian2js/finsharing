import React, { useContext } from 'react'
import { NextPageContext } from 'next'
import Error from 'next/error'
import Head from 'next/head'
import { PostList } from '../../components/posts/PostList'
import { Box, CircularProgress } from '@material-ui/core'
import { withApollo } from '../../src/apollo'
import gql from 'graphql-tag'
import { useQuery } from '@apollo/react-hooks'
import { Market } from '../../src/types/Market'
import { MarketHeader } from '../../components/markets/MarketHeader'
import { ViewerContext } from '../../components/providers/ViewerContextProvider'

interface Props {
  symbol: string
}

const MARKET_QUERY = gql`
  query Market ($symbol: String!) {
    market (symbol: $symbol) {
      name
      ...MarketHeader
    }
  }
  ${MarketHeader.fragments.market}
`

function MarketPage (props: Props) {
  const { viewer } = useContext(ViewerContext)
  const { loading, error, data } = useQuery(
    MARKET_QUERY,
    {
      variables: {
        symbol: props.symbol
      },
    }
  )

  if (error) {
    return <Error title={error.message} statusCode={404}/>
  }

  if (loading || !data?.market) {
    return <CircularProgress/>
  }

  const market: Market = data.market
  const title = `${market.name} Posts`
  const description = `List of posts about ${market.name}`
  const url = `https://finsharing.com/markets/${market.symbol}`

  return (
    <>
      <Head>
        <title>{title} - ${market.symbol.toUpperCase()}</title>
        <meta name="description" content={description}/>
        <meta property="og:title" content={title}/>
        <meta property="og:url" content={url}/>
        <meta name="twitter:title" content={title}/>
        <meta name="twitter:description" content={description}/>
        <link rel="canonical" href={url}/>
      </Head>
      <Box mb={3}>
        <MarketHeader market={market} viewerId={viewer?.id}/>
      </Box>
      <PostList market={market} viewerId={viewer?.id}/>
    </>
  )
}

MarketPage.getInitialProps = async (ctx: NextPageContext): Promise<Props> => ({
  symbol: (Array.isArray(ctx.query.symbol) ? ctx.query.symbol[0] : ctx.query.symbol).toUpperCase(),
})

export default withApollo(MarketPage)
