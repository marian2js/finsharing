import React from 'react'
import { NextPageContext } from 'next'
import Error from 'next/error'
import Head from 'next/head'
import { Layout } from '../../components/PageLayout/Layout'
import { PostList } from '../../components/posts/PostList'
import { CircularProgress, Grid, Typography } from '@material-ui/core'
import { withApollo } from '../../src/apollo'
import gql from 'graphql-tag'
import { useQuery } from '@apollo/react-hooks'
import { Market } from '../../src/types/Market'
import { AuthService } from '../../src/services/AuthService'
import { roundDecimals } from '../../src/utils/number.utils'

interface Props {
  symbol: string
  viewerId: string | undefined
}

const MARKET_QUERY = gql`
  query Market ($symbol: String!) {
    market (symbol: $symbol) {
      id
      symbol
      name
      fullName
      description
      price
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

      <Grid container>
        <Grid item xs={4} sm={1}>
          <Typography gutterBottom variant="subtitle1" component="p">
            {market.fullName}
          </Typography>
          <Typography gutterBottom variant="h4" component="h1">
            {market.symbol.toUpperCase()}
          </Typography>
        </Grid>
        <Grid item>
          <Typography gutterBottom variant="h5" component="p">
            {
              market.price && `$${roundDecimals(market.price, 2)}`
            }
          </Typography>
        </Grid>
      </Grid>


      <PostList market={market} viewerId={props.viewerId}/>
    </Layout>
  )
}

MarketPage.getInitialProps = async (ctx: NextPageContext): Promise<Props> => ({
  symbol: (Array.isArray(ctx.query.symbol) ? ctx.query.symbol[0] : ctx.query.symbol).toUpperCase(),
  viewerId: new AuthService(ctx).getViewer()?.id,
})

export default withApollo(MarketPage)
