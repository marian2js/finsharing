import React from 'react'
import { Market } from '../../src/types/Market'
import { Typography } from '@material-ui/core'
import { green, red } from '@material-ui/core/colors'
import { roundDecimals } from '../../src/utils/number'
import { Variant } from '@material-ui/core/styles/createTypography'

interface Props {
  market: Market
  variant?: Variant | 'inherit';
}

export const MarketPriceChange = (props: Props) => {
  const { market, variant } = props
  if (!market.price || !market.priceClose) {
    return <></>
  }
  const change = ((market.price - market.priceClose) * 100) / market.priceClose
  return (
    <Typography variant={variant} style={{ color: change > 0 ? green['500'] : change < 0 ? red['500'] : 'inherit' }}>
      {
        `${change > 0 ? '+' : ''}${roundDecimals(change, 2)}%`
      }
    </Typography>
  )
}
