import Hidden from '@material-ui/core/Hidden'
import Drawer from '@material-ui/core/Drawer'
import React, { useState } from 'react'
import { makeStyles, Theme, useTheme } from '@material-ui/core/styles'
import Divider from '@material-ui/core/Divider'
import { AppBar, Box, Tab, Tabs, Typography } from '@material-ui/core'
import Link from 'next/link'
import HomeIcon from '@material-ui/icons/Home'
import { TabPanel, tabProps } from '../TabPanel'
import { SideMenuWatchlist } from './SideMenuWatchlist'
import { SideMenuPopularList } from './SideMenuPopularList'
import { useViewer } from '../../src/services/UserHooks'

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

export function SideMenu (props: Props) {
  const classes = useStyles()
  const theme = useTheme()
  const { viewer } = useViewer()
  const [tabIndex, setTabIndex] = useState(viewer?.id ? 0 : 1)

  const handleTabChange = (e: React.ChangeEvent<{}>, newIndex: number) => {
    e.preventDefault()
    setTabIndex(newIndex)
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

      <AppBar position="sticky" color="default">
        <Tabs value={tabIndex}
              variant="fullWidth"
              indicatorColor="primary"
              onChange={handleTabChange}
              aria-label="market list tabs">
          <Tab label="Watchlist" {...tabProps(0)} />
          <Tab label="Popular" {...tabProps(1)} />
        </Tabs>
      </AppBar>
      <TabPanel value={tabIndex} index={0}>
        {
          viewer?.id ?
            <SideMenuWatchlist viewerId={viewer?.id}/> :
            <Box p={2}><p>You need a <Link href="/register"><a>free account</a></Link> to create a watchlist.</p></Box>
        }
      </TabPanel>
      <TabPanel value={tabIndex} index={1}>
        <SideMenuPopularList/>
      </TabPanel>
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
