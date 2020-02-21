import React from 'react'
import { Grid, Typography } from '@material-ui/core'
import { roundDecimals } from '../../src/utils/number'
import { MarketPriceChange } from './MarketPriceChange'
import { makeStyles } from '@material-ui/core/styles'
import { Market } from '../../src/types/Market'
import gql from 'graphql-tag'

const useStyles = makeStyles(theme => ({
  priceChange: {
    marginLeft: theme.spacing(1)
  },
}))

interface Props {
  market: Market
}

export const MarketHeader = (props: Props) => {
  const classes = useStyles()
  const { market } = props

  return (
    <Grid container>
      <Grid item>
        <Typography gutterBottom variant="subtitle1" component="h1">
          {market.symbol.toUpperCase()} - {market.fullName}
        </Typography>
        <Typography gutterBottom variant="h4">
          {
            market.price && `$${roundDecimals(market.price, 2)}`
          }
          <span className={classes.priceChange}>
            {
              market.price && market.priceClose && <MarketPriceChange market={market} variant="h6" component="span"/>
            }
          </span>
        </Typography>
      </Grid>
    </Grid>
  )
}

MarketHeader.fragments = {
  market: gql`
    fragment MarketHeader on Market {
      id
      symbol
      fullName
      price
      priceClose
    }
  `
}
