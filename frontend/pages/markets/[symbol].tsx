import React from 'react'
import { NextPageContext } from 'next'
import Error from 'next/error'
import Head from 'next/head'
import { Layout } from '../../components/PageLayout/Layout'
import { PostList } from '../../components/posts/PostList'
import { CircularProgress, Typography } from '@material-ui/core'
import { withApollo } from '../../src/apollo'
import gql from 'graphql-tag'
import { useQuery } from '@apollo/react-hooks'
import { Market } from '../../src/types/Market'

interface Props {
  symbol: string
}

const MARKET_QUERY = gql`
  query Market ($symbol: String!) {
    market (symbol: $symbol) {
      id
      symbol
      name
      fullName
      description
    }
  }
`

function MarketPage (props: Props) {
  const { loading, error, data } = useQuery(
    MARKET_QUERY,
    {
      variables: {
        symbol: props.symbol
      },
      notifyOnNetworkStatusChange: true,
    }
  )

  if (error) {
    return <Error title={error.message} statusCode={404}/>
  }

  if (loading || !data?.market) {
    return <CircularProgress/>
  }

  const market: Market = data.market

  return (
    <Layout>
      <Head>
        <title>{market.name} - FinSharing.com</title>
      </Head>

      <Typography gutterBottom variant="subtitle1" component="p">
        {market.fullName}
      </Typography>
      <Typography gutterBottom variant="h4" component="h1">
        {market.symbol.toUpperCase()}
      </Typography>

      <PostList market={market}/>
    </Layout>
  )
}

MarketPage.getInitialProps = async (ctx: NextPageContext): Promise<Props> => ({
  symbol: (Array.isArray(ctx.query.symbol) ? ctx.query.symbol[0] : ctx.query.symbol).toUpperCase()
})

export default withApollo(MarketPage)
