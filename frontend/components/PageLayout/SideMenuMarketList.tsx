import React from 'react'
import Link from 'next/link'
import { ListItem, ListItemText, Typography } from '@material-ui/core'
import { roundDecimals } from '../../src/utils/number'
import { MarketPriceChange } from '../markets/MarketPriceChange'
import List from '@material-ui/core/List'
import { Market } from '../../src/types/Market'
import { makeStyles } from '@material-ui/core/styles'
import gql from 'graphql-tag'

interface Props {
  markets: Market[]
}

const useStyles = makeStyles({
  priceColumn: {
    textAlign: 'right',
    '& p': {
      fontWeight: 500,
    },
  },
})

export const SideMenuMarketList = (props: Props) => {
  const classes = useStyles()
  const { markets } = props

  return (
    <List>
      {
        markets.map(market => (
          <Link key={market.symbol} href="/markets/[symbol]" as={`/markets/${market.symbol}`}>
            <ListItem button>
              <ListItemText primary={market.symbol} secondary={market.name}/>
              <div className={classes.priceColumn}>
                <Typography variant="body2">
                  {
                    market.price && `$${roundDecimals(market.price, 2)}`
                  }
                </Typography>
                {
                  market.price && market.priceClose && <MarketPriceChange market={market} variant="body2"/>
                }
              </div>
            </ListItem>
          </Link>
        ))
      }
    </List>
  )
}

SideMenuMarketList.fragments = {
  marketList: gql`
    fragment SideMenuMarketList on Market {
      symbol
      name
      price
      priceClose
    }
  `
}
