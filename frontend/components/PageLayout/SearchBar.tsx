import React, { useEffect } from 'react'
import SearchIcon from '@material-ui/icons/Search'
import AddCircleIcon from '@material-ui/icons/AddCircle'
import DoneIcon from '@material-ui/icons/Done'
import { createStyles, fade, makeStyles, Theme } from '@material-ui/core'
import { MarketSelector } from '../markets/MarketSelector'
import Router from 'next/router'
import { Market } from '../../src/types/Market'
import { useFollowMarket } from '../../src/services/MarketHooks'
import { useViewer } from '../../src/services/UserHooks'
import { useLazyQuery } from '@apollo/react-hooks'
import { LIST_FOLLOWED_MARKETS_QUERY } from './SideMenuWatchlist'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    search: {
      position: 'relative',
      borderRadius: theme.shape.borderRadius,
      backgroundColor: fade(theme.palette.common.white, 0.15),
      '&:hover': {
        backgroundColor: fade(theme.palette.common.white, 0.25),
      },
      marginLeft: 0,
      marginRight: theme.spacing(2),
      width: '50%',
      [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(1),
        width: 'auto',
      },
    },
    searchIcon: {
      padding: theme.spacing(0, 2),
      height: '100%',
      position: 'absolute',
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    selector: {
      padding: 0,
      margin: 0,
    },
    searchInput: {
      '& .MuiInputBase-root': {
        padding: 0,
      },
      '& label': {
        top: `-${theme.spacing(1)}px`,
        paddingLeft: `calc(1em + ${theme.spacing(2)}px)`,
      },
      '& input': {
        margin: 0,
        padding: theme.spacing(1, 1, 1, 0),
        paddingLeft: `calc(1em + ${theme.spacing(4)}px)!important`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('sm')]: {
          width: '20ch!important',
        },
      }
    },
  }),
)

export const SearchBar = () => {
  const classes = useStyles()
  const [followMarket] = useFollowMarket()
  const { viewer } = useViewer()
  const [getMarketFollows, marketFollows] = useLazyQuery(
    LIST_FOLLOWED_MARKETS_QUERY,
    {
      variables: {
        userId: viewer?.id
      }
    }
  )

  useEffect(() => {
    if (viewer?.id) {
      getMarketFollows()
    }
  }, [viewer])

  const handleMarketSelected = async (market: Market) => {
    await Router.push('/markets/[symbol]', `/markets/${market.symbol}`)
  }

  const handleMarketFollow = async (e: React.MouseEvent<HTMLElement>, market: Market) => {
    e.preventDefault()

    // don't execute the market selected event
    e.stopPropagation()

    if (viewer?.id) {
      await followMarket({ market, viewerId: viewer.id })
    }
  }

  const renderMarketAction = (market: Market) => {
    if (!viewer?.id) {
      return <></>
    }
    const following = marketFollows.data?.marketFollows?.nodes
      ?.find((f: { market: Market }) => f.market.id === market.id)
    if (following) {
      return <div><DoneIcon/></div>
    } else {
      return <div onClick={(e) => handleMarketFollow(e, market)}><AddCircleIcon/></div>
    }
  }

  return (
    <div className={classes.search}>
      <div className={classes.searchIcon}>
        <SearchIcon/>
      </div>
      <MarketSelector label="Search Market…"
                      onChange={handleMarketSelected}
                      renderMarketAction={renderMarketAction}
                      className={classes.selector}
                      inputClassName={classes.searchInput}/>
    </div>
  )
}
