import Hidden from '@material-ui/core/Hidden'
import Drawer from '@material-ui/core/Drawer'
import React from 'react'
import { createStyles, makeStyles, Theme, useTheme } from '@material-ui/core/styles'
import Divider from '@material-ui/core/Divider'
import List from '@material-ui/core/List'
import { CircularProgress, ListItem, ListItemText } from '@material-ui/core'
import gql from 'graphql-tag'
import Link from 'next/link'
import { useQuery } from '@apollo/react-hooks'
import { Market } from '../../src/types/Market'

export const drawerWidth = 240

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    drawer: {
      [theme.breakpoints.up('sm')]: {
        width: drawerWidth,
        flexShrink: 0,
      },
    },
    toolbar: theme.mixins.toolbar as any,
    drawerPaper: {
      width: drawerWidth,
    },
  }),
)

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
      }
    }
  }
`

export function SideMenu (props: Props) {
  const { loading, error, data } = useQuery(
    LIST_MARKETS_QUERY, {
      notifyOnNetworkStatusChange: true,
    }
  )
  const classes = useStyles()
  const theme = useTheme()

  if (error) {
    return <div>Error loading markets, please try again</div>
  }

  if (loading) {
    return <CircularProgress/>
  }

  const markets: Market[] = data?.markets?.nodes || []
  const drawer = (
    <div>
      <div className={classes.toolbar}/>
      <Divider/>
      <List>
        {
          markets.map(market => (
            <Link key={market.symbol} href="/markets/[symbol]" as={`/markets/${market.symbol}`}>
              <ListItem button>
                <ListItemText primary={market.symbol} secondary={market.name}/>
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
