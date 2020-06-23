import React, { useEffect, useState } from 'react'
import { Button, Grid, Typography, useMediaQuery } from '@material-ui/core'
import { roundDecimals } from '../../src/utils/number'
import { MarketPriceChange } from './MarketPriceChange'
import { makeStyles } from '@material-ui/core/styles'
import { Market } from '../../src/types/Market'
import gql from 'graphql-tag'
import BarChartIcon from '@material-ui/icons/BarChart'
import AttachMoneyIcon from '@material-ui/icons/AttachMoney'
import VisibilityIcon from '@material-ui/icons/Visibility'
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff'
import theme from '../../src/theme'
import { getPartnerLink } from '../../src/utils/partner'
import { useFollowMarket, useUnfollowMarket } from '../../src/services/MarketHooks'
import { SignUpDialog } from '../dialogs/SignUpDialog'

const useStyles = makeStyles(theme => ({
  priceChange: {
    marginLeft: theme.spacing(1)
  },
  analysisButton: {
    textAlign: 'right',
    marginBottom: theme.spacing(2),
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
  followCount: {
    margin: theme.spacing(1, 0, 0, 0),
    display: 'block',
    [theme.breakpoints.up('sm')]: {
      margin: theme.spacing(0, 0, 0, 1),
      display: 'inline',
    },
  },
}))

interface Props {
  market: Market
  viewerId: string | undefined
}

export const MarketHeader = (props: Props) => {
  const classes = useStyles()
  const { viewerId } = props
  const [market, setMarket] = useState(props.market)
  const [viewerFollowId, setViewerFollowId] = useState(market.viewerFollow?.id || null)
  const [signUpDialogOpen, setSignUpDialogOpen] = useState<boolean>(false)
  const [followMarket] = useFollowMarket()
  const [unfollowMarket] = useUnfollowMarket()
  const xsDown = useMediaQuery(theme.breakpoints.down('sm'))

  useEffect(() => {
    setMarket(props.market)
    setViewerFollowId(props.market.viewerFollow?.id || null)
  }, [props.market])

  const handleFollowClick = async () => {
    if (!viewerId) {
      setSignUpDialogOpen(true)
      return
    }

    const res = await followMarket({ market, viewerId })
    setViewerFollowId(res.data.createMarketFollow.marketFollow.id)
  }

  const handleUnfollowClick = async () => {
    if (viewerId && viewerFollowId) {
      await unfollowMarket({ market, viewerId, viewerFollowId })
    }
    setViewerFollowId(null)
  }

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
        {
          viewerFollowId ? (
            <Button variant="contained" color="secondary" startIcon={<VisibilityOffIcon/>}
                    onClick={handleUnfollowClick}>
              Unfollow
            </Button>
          ) : (
            <Button variant="contained" color="primary" startIcon={<VisibilityIcon/>}
                    onClick={handleFollowClick}>
              Follow
            </Button>
          )
        }
        {
          !xsDown && market.numberOfFollowers ? (
            <div className={classes.followCount}>
              {market.numberOfFollowers} followers
            </div>
          ) : ''
        }
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
                <Button variant="contained" color="default" startIcon={<AttachMoneyIcon/>}>
                  Invest on {market.partnerId.toUpperCase()}
                </Button>
              </a>
            </div>
          )
        }
      </Grid>

      <SignUpDialog open={signUpDialogOpen} onClose={() => setSignUpDialogOpen(false)}/>
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
      numberOfFollowers
      viewerFollow {
        id
      }
    }
  `
}
