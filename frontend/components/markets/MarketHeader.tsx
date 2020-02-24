import React from 'react'
import { Button, Grid, Typography, useMediaQuery } from '@material-ui/core'
import { roundDecimals } from '../../src/utils/number'
import { MarketPriceChange } from './MarketPriceChange'
import { makeStyles } from '@material-ui/core/styles'
import { Market } from '../../src/types/Market'
import gql from 'graphql-tag'
import BarChartIcon from '@material-ui/icons/BarChart'
import AttachMoneyIcon from '@material-ui/icons/AttachMoney'
import theme from '../../src/theme'
import { getPartnerLink } from '../../src/utils/partner'

const useStyles = makeStyles(theme => ({
  priceChange: {
    marginLeft: theme.spacing(1)
  },
  analysisButton: {
    textAlign: 'right',
    marginBottom: theme.spacing(1),
    '& a:hover': {
      textDecoration: 'none',
    },
  },
  investButton: {
    textAlign: 'right',
    '& a:hover': {
      textDecoration: 'none',
    },
  },
}))

interface Props {
  market: Market
}

export const MarketHeader = (props: Props) => {
  const classes = useStyles()
  const { market } = props
  const xsDown = useMediaQuery(theme.breakpoints.down('sm'))

  return (
    <Grid container>
      <Grid item xs={6}>
        <Typography gutterBottom variant="subtitle1" component="h1">
          {market.symbol.toUpperCase()} - {market.fullName}
        </Typography>
        <Typography gutterBottom variant={xsDown ? 'h5' : 'h4'}>
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
      <Grid item xs={6}>
        {
          market.icId && (
            <div className={classes.analysisButton}>
              <a href={`http://inspectcompany.com/${market.icId}`}>
                <Button variant="contained" color="default" startIcon={!xsDown && <BarChartIcon/>}>
                  Company analysis
                </Button>
              </a>
            </div>
          )
        }
        {
          market.partnerId && (
            <div className={classes.investButton}>
              <a href={getPartnerLink(market.partnerId)} target="_blank" rel="nofollow noopener noreferrer">
                <Button variant="contained" color="primary" startIcon={!xsDown && <AttachMoneyIcon/>}>
                  Invest on {market.partnerId.toUpperCase()}
                </Button>
              </a>
            </div>
          )
        }
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
      icId
      partnerId
    }
  `
}
