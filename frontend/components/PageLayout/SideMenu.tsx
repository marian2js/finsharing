import Hidden from '@material-ui/core/Hidden'
import Drawer from '@material-ui/core/Drawer'
import React from 'react'
import { makeStyles, Theme, useTheme } from '@material-ui/core/styles'
import Divider from '@material-ui/core/Divider'
import List from '@material-ui/core/List'
import { CircularProgress, ListItem, ListItemText, Typography } from '@material-ui/core'
import gql from 'graphql-tag'
import Link from 'next/link'
import { useQuery } from '@apollo/react-hooks'
import { Market } from '../../src/types/Market'
import { roundDecimals } from '../../src/utils/number'
import { MarketPriceChange } from '../markets/MarketPriceChange'
import HomeIcon from '@material-ui/icons/Home'

export const drawerWidth = 240

const useStyles = makeStyles((theme: Theme) => ({
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  toolbar: theme.mixins.toolbar as any,
  drawerPaper: {
    width: drawerWidth,
    background: theme.palette.background.default,
  },
  priceColumn: {
    textAlign: 'right',
    '& p': {
      fontWeight: 500,
    },
  },
  homeButton: {
    textAlign: 'center',
  },
  homeLink: {
    color: theme.palette.text.primary,
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
}))

interface Props {
  open: boolean
  onDrawerToggle: () => void
}

const LIST_MARKETS_QUERY = gql`
  {
    markets (first: 30, orderBy: [{ numberOfPosts: DESC }]) {
      nodes {
        symbol
        name
        price
        priceClose
      }
    }
  }
`

export function SideMenu (props: Props) {
  const { error, data } = useQuery(
    LIST_MARKETS_QUERY, {
      pollInterval: 1000 * 60,
      notifyOnNetworkStatusChange: true,
    }
  )
  const classes = useStyles()
  const theme = useTheme()
  const markets: Market[] = data?.markets?.nodes || []

  if (error) {
    return <div>Error loading markets, please try again</div>
  }

  if (!markets.length) {
    return <CircularProgress/>
  }

  const drawer = (
    <div>
      <div className={classes.toolbar}>
        <Typography variant="h3" noWrap className={classes.homeButton}>
          <Link href="/">
            <a className={classes.homeLink}>
              <HomeIcon/>
            </a>
          </Link>
        </Typography>
      </div>
      <Divider/>
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
    </div>
  )

  return (
    <nav className={classes.drawer} aria-label="mailbox folders">
      <Hidden smUp implementation="css">
        <Drawer
          variant="temporary"
          anchor={theme.direction === 'rtl' ? 'right' : 'left'}
          open={props.open}
          onClose={props.onDrawerToggle}
          classes={{
            paper: classes.drawerPaper,
          }}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
        >
          {drawer}
        </Drawer>
      </Hidden>
      <Hidden xsDown implementation="css">
        <Drawer
          classes={{
            paper: classes.drawerPaper,
          }}
          variant="permanent"
          open>
          {drawer}
        </Drawer>
      </Hidden>
    </nav>
  )
}
