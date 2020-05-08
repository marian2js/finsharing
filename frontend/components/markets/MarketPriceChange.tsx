import React from 'react'
import { Market } from '../../src/types/Market'
import { Typography } from '@material-ui/core'
import { green, red } from '@material-ui/core/colors'
import { roundDecimals } from '../../src/utils/number'
import { Variant } from '@material-ui/core/styles/createTypography'
import { getMarketPriceChange } from '../../src/utils/markets'

interface Props {
  market: Market
  variant?: Variant | 'inherit'
  component?: React.ElementType
  className?: string
}

export const MarketPriceChange = (props: Props) => {
  const { market, variant, component, className } = props
  if (!market.price || !market.priceClose) {
    return <></>
  }
  const change = getMarketPriceChange(market)
  return (
    <Typography variant={variant}
                {...{ component }}
                style={{ color: change > 0 ? green['500'] : change < 0 ? red['500'] : 'inherit' }}
                className={className}>
      {
        `${change > 0 ? '+' : ''}${roundDecimals(change, 2)}%`
      }
    </Typography>
  )
}
